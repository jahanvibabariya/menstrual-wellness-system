import bcrypt from 'bcryptjs';

/**
 * Hash a password with 12 salt rounds.
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain-text password against a hash.
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
