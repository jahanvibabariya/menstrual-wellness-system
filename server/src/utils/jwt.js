import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import RefreshToken from '../models/RefreshToken.js';

/**
 * Generate an access token for a user.
 */
export const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, config.jwtAccessSecret, {
    expiresIn: config.accessTokenExpiry,
  });
};

/**
 * Generate a refresh token, store it in the DB, and return the token string.
 */
export const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ userId }, config.jwtRefreshSecret, {
    expiresIn: config.refreshTokenExpiry,
  });

  // Calculate expiry date from the configured duration
  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);

  await RefreshToken.create({
    userId,
    token,
    expiresAt,
  });

  return token;
};

/**
 * Verify an access token.
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtAccessSecret);
};

/**
 * Verify a refresh token.
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwtRefreshSecret);
};
