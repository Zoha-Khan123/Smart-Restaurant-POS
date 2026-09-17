import mongoose, { Schema, model } from 'mongoose';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  CASHIER: 'cashier',
  WAITER: 'waiter',
  KITCHEN_STAFF: 'kitchen_staff'
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false
    },
    role: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: '{VALUE} is not a valid role'
      },
      required: [true, 'Role is required']
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      default: null,
      index: true
    },
    status: {
      type: String,
      enum: {
        values: Object.values(USER_STATUS),
        message: '{VALUE} is not a valid status'
      },
      default: USER_STATUS.ACTIVE
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      default: null,
      select: false
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.twoFactorSecret;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    }
  }
);

// Pre-save validation: super_admin must always have tenantId = null
userSchema.pre('save', function (next) {
  if (this.role === ROLES.SUPER_ADMIN) {
    this.tenantId = null;
  }
  if (typeof next === 'function') {
    next();
  }
});

// Helper instance method to return safe sanitized object
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id ? this._id.toString() : this.id,
    name: this.name,
    email: this.email,
    role: this.role,
    tenantId: this.tenantId ? this.tenantId.toString() : null,
    status: this.status,
    emailVerified: this.emailVerified,
    twoFactorEnabled: this.twoFactorEnabled,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Ensure compound index if needed
userSchema.index({ email: 1 });
userSchema.index({ tenantId: 1, role: 1 });

export const User = model('User', userSchema);
export default User;
