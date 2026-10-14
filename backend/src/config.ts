import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  databaseUrl: process.env.DATABASE_URL || '',
  sqlitePath: process.env.SQLITE_PATH || path.resolve(process.cwd(), 'data', 'connecthub.sqlite'),
  dbType: process.env.DATABASE_URL ? 'postgres' : 'sqlite',
  jwtSecret: process.env.JWT_SECRET || 'connecthub-hola-map-jwt-super-secret-2026',
};

if (config.nodeEnv === 'production' && !process.env.JWT_SECRET) {
  console.warn('⚠️ [SECURITY WARNING] JWT_SECRET is not configured in production! Please set JWT_SECRET in environment variables.');
}
