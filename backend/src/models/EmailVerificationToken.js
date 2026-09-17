import mongoose, { Schema, model } from 'mongoose';

const emailVerificationTokenSchema = new Schema(
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
    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
      index: true
    },
    usedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// TTL index to automatically remove expired tokens after 24 hours
emailVerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });
emailVerificationTokenSchema.index({ userId: 1, usedAt: 1 });
emailVerificationTokenSchema.index({ tokenHash: 1, usedAt: 1 });

export const EmailVerificationToken = model('EmailVerificationToken', emailVerificationTokenSchema);
export default EmailVerificationToken;
