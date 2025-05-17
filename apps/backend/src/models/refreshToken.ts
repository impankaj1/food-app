import mongoose, { Types } from 'mongoose';

export interface RefreshToken {
  _id: Types.ObjectId;
  email: string;
  refreshTokenHash: string;
  expiresAt: Date;
  first_name: string;
}

const RefreshTokenSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  refreshTokenHash: { type: String, default: null, required: true },
  expiresAt: { type: Date, required: true },
  first_name: { type: String, required: true },
});

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = mongoose.model(
  'RefreshToken',
  RefreshTokenSchema
);
