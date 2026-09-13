import { getDatabase } from './connection.js';

export async function createIndexes(): Promise<void> {
  const db = getDatabase();

  // businesses
  await db.collection('businesses').createIndex({ legacyId: 1 }, { unique: true, sparse: true });
  await db.collection('businesses').createIndex({ ownerId: 1 });

  // financial_records
  await db.collection('financial_records').createIndex({ businessId: 1, month: -1 });
  await db.collection('financial_records').createIndex(
    { businessId: 1, month: 1 },
    { unique: true }
  );

  // cashflow_entries
  await db.collection('cashflow_entries').createIndex({ businessId: 1, month: -1 });
  await db.collection('cashflow_entries').createIndex(
    { businessId: 1, month: 1 },
    { unique: true }
  );

  // inventory_items
  await db.collection('inventory_items').createIndex({ businessId: 1 });
  await db.collection('inventory_items').createIndex(
    { businessId: 1, sku: 1 },
    { unique: true, sparse: true }
  );
  // deletedAt for soft deletes
  await db.collection('inventory_items').createIndex({ businessId: 1, deletedAt: 1 });

  // government_schemes
  await db.collection('government_schemes').createIndex({ status: 1 });
  await db.collection('government_schemes').createIndex({ legacyId: 1 }, { unique: true, sparse: true });

  // conversations
  await db.collection('conversations').createIndex({ businessId: 1, updatedAt: -1 });
  await db.collection('conversations').createIndex({ userId: 1, updatedAt: -1 });

  // conversation_messages
  await db.collection('conversation_messages').createIndex({ conversationId: 1, createdAt: 1 });

  // recommendations
  await db.collection('recommendations').createIndex({ businessId: 1, createdAt: -1 });
  await db.collection('recommendations').createIndex({ businessId: 1, status: 1 });
  // TTL for expired recommendations (30-day expiry)
  await db.collection('recommendations').createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, sparse: true }
  );

  console.log('[DB] Indexes created/verified.');
}
