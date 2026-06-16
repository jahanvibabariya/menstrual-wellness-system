import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/menstrual-wellness',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '1h',
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
