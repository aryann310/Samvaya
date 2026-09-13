import type { Db } from 'mongodb';
import { getMongoClient, resetMongoClient } from './client.js';
import { dbConfig } from './config.js';

let db: Db | null = null;

export async function connectDatabase(): Promise<void> {
  const client = getMongoClient();
  await client.connect();
  db = client.db(dbConfig.dbName);
  console.log(`[DB] Connected to MongoDB: ${dbConfig.dbName}`);
}

export async function disconnectDatabase(): Promise<void> {
  if (!db) {
    resetMongoClient();
    return;
  }
  const client = getMongoClient();
  await client.close();
  db = null;
  resetMongoClient();
  console.log('[DB] MongoDB connection closed.');
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('[DB] Database not connected. Call connectDatabase() first.');
  }
  return db;
}

export async function checkDatabaseHealth(): Promise<{ status: 'ok' | 'unavailable'; latencyMs?: number }> {
  try {
    const start = Date.now();
    await getDatabase().command({ ping: 1 });
    return { status: 'ok', latencyMs: Date.now() - start };
  } catch {
    return { status: 'unavailable' };
  }
}
