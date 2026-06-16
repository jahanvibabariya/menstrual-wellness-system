import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    token: {
      type: String,
      required: [true, 'Token is required'],
      index: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
  },
  {
    timestamps: true,
  }
);

// TTL index: MongoDB automatically removes documents when expiresAt is reached
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
