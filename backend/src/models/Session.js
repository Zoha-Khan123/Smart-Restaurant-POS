import mongoose, { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    tokenHash: {
      type: String,
      required: [true, 'Token hash is required'],
      index: true
    },
    device: {
      type: String,
      default: 'Unknown Device'
    },
    userAgent: {
      type: String,
      default: 'Unknown'
    },
    ipAddress: {
      type: String,
      default: 'Unknown'
    },
    lastUsedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
      index: true
    },
    revokedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(_doc, ret) {
        delete ret.tokenHash;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    }
  }
);

// Indexes
sessionSchema.index({ userId: 1, revokedAt: 1 });
sessionSchema.index({ tokenHash: 1, revokedAt: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // MongoDB TTL cleanup

// Check if session is active
sessionSchema.methods.isActive = function () {
  return !this.revokedAt && this.expiresAt > new Date();
};

export const Session = model('Session', sessionSchema);
export default Session;
