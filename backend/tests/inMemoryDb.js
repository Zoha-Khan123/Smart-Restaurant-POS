import mongoose from 'mongoose';
import { User, ROLES } from '../src/models/User.js';
import { Session } from '../src/models/Session.js';
import { PasswordResetToken } from '../src/models/PasswordResetToken.js';
import { EmailVerificationToken } from '../src/models/EmailVerificationToken.js';

class InMemoryStore {
  constructor() {
    this.collections = {
      users: new Map(),
      sessions: new Map(),
      passwordresettokens: new Map(),
      emailverificationtokens: new Map()
    };
  }

  clear() {
    for (const key of Object.keys(this.collections)) {
      this.collections[key].clear();
    }
  }

  matchQuery(doc, query) {
    if (!query || Object.keys(query).length === 0) return true;

    for (const [key, value] of Object.entries(query)) {
      let docVal = doc[key];
      if (key === '_id' && docVal && typeof docVal.toString === 'function') {
        docVal = docVal.toString();
      }
      let queryVal = value;
      if (queryVal && typeof queryVal.toString === 'function' && (key === '_id' || key === 'userId')) {
        queryVal = queryVal.toString();
      }

      if (value === null) {
        if (docVal !== null && docVal !== undefined) return false;
      } else if (typeof value === 'object' && value !== null && !(value instanceof Date) && !(value instanceof mongoose.Types.ObjectId)) {
        if (value.$gt !== undefined) {
          const valDate = new Date(docVal).getTime();
          const targetDate = new Date(value.$gt).getTime();
          if (valDate <= targetDate) return false;
        }
        if (value.$lt !== undefined) {
          const valDate = new Date(docVal).getTime();
          const targetDate = new Date(value.$lt).getTime();
          if (valDate >= targetDate) return false;
        }
      } else if (value instanceof RegExp) {
        if (!value.test(docVal)) return false;
      } else {
        if (docVal != queryVal) {
          return false;
        }
      }
    }
    return true;
  }

  applyUpdate(doc, update) {
    if (update.$set) {
      Object.assign(doc, update.$set);
    }
    for (const [k, v] of Object.entries(update)) {
      if (!k.startsWith('$')) {
        doc[k] = v;
      }
    }
    return doc;
  }
}

export const memoryStore = new InMemoryStore();

function wrapDocument(model, rawData) {
  if (!rawData) return null;
  const doc = new model(rawData);
  // Keep original _id
  doc._id = rawData._id instanceof mongoose.Types.ObjectId ? rawData._id : new mongoose.Types.ObjectId(rawData._id);

  // Preserve select: false fields in memory
  if (rawData.passwordHash) doc.passwordHash = rawData.passwordHash;
  if (rawData.twoFactorSecret) doc.twoFactorSecret = rawData.twoFactorSecret;

  const originalSave = doc.save.bind(doc);
  doc.save = async function () {
    if (doc.role === ROLES.SUPER_ADMIN) {
      doc.tenantId = null;
    }
    const plain = doc.toObject({ transform: false });
    plain._id = doc._id;
    plain.passwordHash = doc.passwordHash;
    plain.twoFactorSecret = doc.twoFactorSecret;
    plain.updatedAt = new Date();
    const collectionName = model.collection.name;
    memoryStore.collections[collectionName].set(doc._id.toString(), plain);
    return doc;
  };

  return doc;
}

export function patchMongooseForTests() {
  const models = [User, Session, PasswordResetToken, EmailVerificationToken];

  for (const model of models) {
    const collectionName = model.collection.name;

    model.create = async function (docs) {
      const items = Array.isArray(docs) ? docs : [docs];
      const results = [];
      for (const item of items) {
        const id = item._id || new mongoose.Types.ObjectId();
        const data = {
          ...item,
          _id: id,
          createdAt: item.createdAt || new Date(),
          updatedAt: item.updatedAt || new Date()
        };
        if (data.role === ROLES.SUPER_ADMIN) {
          data.tenantId = null;
        }
        memoryStore.collections[collectionName].set(id.toString(), data);
        results.push(wrapDocument(model, data));
      }
      return Array.isArray(docs) ? results : results[0];
    };

    model.findOne = function (query) {
      const queryObj = {
        _select: '',
        select(fields) {
          this._select = fields;
          return this;
        },
        then(resolve, reject) {
          try {
            const map = memoryStore.collections[collectionName];
            for (const item of map.values()) {
              if (memoryStore.matchQuery(item, query)) {
                return resolve(wrapDocument(model, item));
              }
            }
            return resolve(null);
          } catch (err) {
            return reject(err);
          }
        },
        catch(reject) {
          return this.then(undefined, reject);
        }
      };
      return queryObj;
    };

    model.findById = function (id) {
      const idStr = id?.toString();
      return model.findOne({ _id: idStr });
    };

    model.find = function (query) {
      const queryObj = {
        _sort: null,
        sort(s) {
          this._sort = s;
          return this;
        },
        then(resolve, reject) {
          try {
            const map = memoryStore.collections[collectionName];
            const matches = [];
            for (const item of map.values()) {
              if (memoryStore.matchQuery(item, query)) {
                matches.push(wrapDocument(model, item));
              }
            }
            if (this._sort && this._sort.lastUsedAt === -1) {
              matches.sort((a, b) => new Date(b.lastUsedAt || 0) - new Date(a.lastUsedAt || 0));
            }
            return resolve(matches);
          } catch (err) {
            return reject(err);
          }
        },
        catch(reject) {
          return this.then(undefined, reject);
        }
      };
      return queryObj;
    };

    model.countDocuments = async function (query = {}) {
      const map = memoryStore.collections[collectionName];
      let count = 0;
      for (const item of map.values()) {
        if (memoryStore.matchQuery(item, query)) {
          count++;
        }
      }
      return count;
    };

    model.updateOne = async function (query, update) {
      const map = memoryStore.collections[collectionName];
      for (const [id, item] of map.entries()) {
        if (memoryStore.matchQuery(item, query)) {
          memoryStore.applyUpdate(item, update);
          map.set(id, item);
          return { matchedCount: 1, modifiedCount: 1 };
        }
      }
      return { matchedCount: 0, modifiedCount: 0 };
    };

    model.updateMany = async function (query, update) {
      const map = memoryStore.collections[collectionName];
      let count = 0;
      for (const [id, item] of map.entries()) {
        if (memoryStore.matchQuery(item, query)) {
          memoryStore.applyUpdate(item, update);
          map.set(id, item);
          count++;
        }
      }
      return { matchedCount: count, modifiedCount: count };
    };

    model.deleteMany = async function (query = {}) {
      const map = memoryStore.collections[collectionName];
      let deleted = 0;
      if (!query || Object.keys(query).length === 0) {
        deleted = map.size;
        map.clear();
      } else {
        for (const [id, item] of map.entries()) {
          if (memoryStore.matchQuery(item, query)) {
            map.delete(id);
            deleted++;
          }
        }
      }
      return { deletedCount: deleted };
    };
  }
}
