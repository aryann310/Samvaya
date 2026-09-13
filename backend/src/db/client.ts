import { MongoClient } from 'mongodb';
import { dbConfig } from './config.js';

let client: MongoClient | null = null;

export function getMongoClient(): MongoClient {
  if (!client) {
    if (!dbConfig.uri) {
      throw new Error('[DB] MONGODB_URI is not set.');
    }
    client = new MongoClient(dbConfig.uri, {
      maxPoolSize: dbConfig.maxPoolSize,
      minPoolSize: dbConfig.minPoolSize,
      serverSelectionTimeoutMS: dbConfig.serverSelectionTimeoutMS,
      connectTimeoutMS: dbConfig.connectTimeoutMS,
      socketTimeoutMS: dbConfig.socketTimeoutMS,
    });
  }
  return client;
}

/** Clear the singleton so a later connect() creates a fresh client. */
export function resetMongoClient(): void {
  client = null;
}
