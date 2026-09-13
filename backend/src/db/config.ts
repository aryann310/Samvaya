import dotenv from 'dotenv';
dotenv.config();

/** Live getters so shell/env changes and dotenv stay consistent. */
export const dbConfig = {
  get uri() {
    return process.env.MONGODB_URI || '';
  },
  get dbName() {
    return process.env.MONGODB_DB_NAME || 'samvaya';
  },
  get maxPoolSize() {
    return parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10);
  },
  get minPoolSize() {
    return parseInt(process.env.MONGODB_MIN_POOL_SIZE || '2', 10);
  },
  get serverSelectionTimeoutMS() {
    return parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || '5000', 10);
  },
  get connectTimeoutMS() {
    return parseInt(process.env.MONGODB_CONNECT_TIMEOUT_MS || '10000', 10);
  },
  get socketTimeoutMS() {
    return parseInt(process.env.MONGODB_SOCKET_TIMEOUT_MS || '45000', 10);
  },
};

export function getDatabaseMode(): 'demo' | 'mongodb' {
  return (process.env.DATABASE_MODE || 'demo') as 'demo' | 'mongodb';
}

/** @deprecated Prefer getDatabaseMode() — kept for existing imports */
export const DATABASE_MODE = getDatabaseMode();

export function isMongoMode(): boolean {
  return getDatabaseMode() === 'mongodb';
}
