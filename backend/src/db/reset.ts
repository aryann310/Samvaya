/**
 * Drop Samvaya collections then re-seed. Cross-platform (Windows/macOS/Linux).
 *
 * Usage:
 *   npm run db:reset
 *   set MONGODB_DB_NAME=samvaya_test && npm run db:reset   (PowerShell/cmd)
 */

import dotenv from 'dotenv';
dotenv.config();

// Default reset target — override with MONGODB_DB_NAME env var
if (!process.env.MONGODB_DB_NAME) {
  process.env.MONGODB_DB_NAME = 'samvaya';
}

import { connectDatabase, disconnectDatabase, getDatabase } from './connection.js';
import { createIndexes } from './indexes.js';
import { runSeed } from './seed.js';

const COLLECTIONS = [
  'businesses',
  'financial_records',
  'cashflow_entries',
  'inventory_items',
  'government_schemes',
  'recommendations',
  'conversations',
  'conversation_messages'
];

async function reset() {
  console.log(`\n[Reset] Dropping collections in ${process.env.MONGODB_DB_NAME}...\n`);
  await connectDatabase();
  const db = getDatabase();

  for (const name of COLLECTIONS) {
    try {
      await db.collection(name).drop();
      console.log(`[Reset] ✔ Dropped ${name}`);
    } catch {
      console.log(`[Reset] · ${name} did not exist (skipped)`);
    }
  }

  await createIndexes();
  await runSeed({ manageConnection: false });
  await disconnectDatabase();
  console.log('[Reset] ✅ Database reset complete.\n');
}

reset().catch(err => {
  console.error('[Reset] ❌ Error:', err.message);
  process.exit(1);
});
