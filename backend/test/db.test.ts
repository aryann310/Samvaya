/**
 * Repository CRUD tests against MongoDB (samvaya_test).
 * Skips automatically when MONGODB_URI is not set.
 *
 *   set MONGODB_DB_NAME=samvaya_test
 *   set DATABASE_MODE=mongodb
 *   npm run test:db
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert';
import dotenv from 'dotenv';

dotenv.config();

const hasMongo = Boolean(process.env.MONGODB_URI);
const skip = !hasMongo;

if (hasMongo) {
  process.env.MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'samvaya_test';
  process.env.DATABASE_MODE = 'mongodb';
}

let connectDatabase: typeof import('../src/db/connection.js').connectDatabase;
let disconnectDatabase: typeof import('../src/db/connection.js').disconnectDatabase;
let checkDatabaseHealth: typeof import('../src/db/connection.js').checkDatabaseHealth;
let createIndexes: typeof import('../src/db/indexes.js').createIndexes;
let runSeed: typeof import('../src/db/seed.js').runSeed;
let BusinessRepository: typeof import('../src/db/repositories/index.js').BusinessRepository;
let FinancialRepository: typeof import('../src/db/repositories/index.js').FinancialRepository;
let CashflowRepository: typeof import('../src/db/repositories/index.js').CashflowRepository;
let InventoryRepository: typeof import('../src/db/repositories/index.js').InventoryRepository;
let SchemeRepository: typeof import('../src/db/repositories/index.js').SchemeRepository;
let ConversationRepository: typeof import('../src/db/repositories/index.js').ConversationRepository;
let RecommendationRepository: typeof import('../src/db/repositories/index.js').RecommendationRepository;
let getDatabase: typeof import('../src/db/connection.js').getDatabase;

before(async () => {
  if (skip) return;
  ({ connectDatabase, disconnectDatabase, checkDatabaseHealth, getDatabase } = await import('../src/db/connection.js'));
  ({ createIndexes } = await import('../src/db/indexes.js'));
  ({ runSeed } = await import('../src/db/seed.js'));
  ({
    BusinessRepository,
    FinancialRepository,
    CashflowRepository,
    InventoryRepository,
    SchemeRepository,
    ConversationRepository,
    RecommendationRepository
  } = await import('../src/db/repositories/index.js'));

  await connectDatabase();
  const db = getDatabase();
  for (const name of [
    'businesses', 'financial_records', 'cashflow_entries', 'inventory_items',
    'government_schemes', 'recommendations', 'conversations', 'conversation_messages'
  ]) {
    await db.collection(name).drop().catch(() => {});
  }
  await createIndexes();
  await runSeed({ manageConnection: false });
});

after(async () => {
  if (skip) return;
  await disconnectDatabase();
});

test('checkDatabaseHealth returns ok', { skip }, async () => {
  const health = await checkDatabaseHealth();
  assert.strictEqual(health.status, 'ok');
  assert.ok(typeof health.latencyMs === 'number');
});

test('BusinessRepository finds seeded biz-001', { skip }, async () => {
  const biz = await BusinessRepository.findByLegacyId('biz-001');
  assert.ok(biz);
  assert.strictEqual(biz!.name, 'Shree Ganesh Kirana Store');
  assert.strictEqual(biz!.cashBalance, 85000);
  assert.strictEqual(biz!.debt?.totalOutstanding, 45000);
});

test('FinancialRepository returns June 2024 consistent totals', { skip }, async () => {
  const records = await FinancialRepository.findByBusinessId('biz-001');
  assert.ok(records.length >= 1);
  const june = records.find(r => r.month === '2024-06');
  assert.ok(june);
  assert.strictEqual(june!.revenue.total, 180000);
  assert.strictEqual(june!.expenses.total, 145000);
  assert.strictEqual(june!.profit, 35000);
});

test('CashflowRepository latest closing balance is 85000', { skip }, async () => {
  const entries = await CashflowRepository.findByBusinessId('biz-001');
  const latest = entries[entries.length - 1];
  assert.strictEqual(latest.month, '2024-06');
  assert.strictEqual(latest.closingBalance, 85000);
});

test('InventoryRepository CRUD + atomic stock adjust', { skip }, async () => {
  const items = await InventoryRepository.findByBusinessId('biz-001');
  assert.ok(items.length >= 2);

  const oil = items.find(i => i.legacyId === 'i4');
  assert.ok(oil);
  const beforeQty = oil!.quantity;

  const adjusted = await InventoryRepository.atomicStockAdjust(oil!.legacyId!, 5);
  assert.ok(adjusted);
  assert.strictEqual(adjusted!.quantity, beforeQty + 5);

  await InventoryRepository.atomicStockAdjust(oil!.legacyId!, -5);
});

test('SchemeRepository findAll returns seeded schemes', { skip }, async () => {
  const schemes = await SchemeRepository.findAll();
  assert.ok(schemes.length >= 3);
  assert.ok(schemes.some(s => s.legacyId === 's1'));
});

test('ConversationRepository persists messages with ObjectId conversationId', { skip }, async () => {
  const conv = await ConversationRepository.getOrCreateForBusiness('biz-001', 'en');
  assert.ok(conv._id);

  await ConversationRepository.addMessage({
    conversationId: conv._id!.toString(),
    role: 'USER',
    content: 'What is my cash runway?',
    intent: 'CASHFLOW',
    createdAt: new Date()
  });
  await ConversationRepository.addMessage({
    conversationId: conv._id!.toString(),
    role: 'ASSISTANT',
    content: 'Your cash runway is healthy.',
    intent: 'CASHFLOW',
    createdAt: new Date()
  });

  const msgs = await ConversationRepository.getRecentMessages(conv._id!.toString(), 10);
  assert.strictEqual(msgs.length, 2);
  assert.strictEqual(msgs[0].role, 'USER');
  assert.ok(msgs[0].conversationId.equals(conv._id!));
});

test('RecommendationRepository create + findRecent', { skip }, async () => {
  const created = await RecommendationRepository.create({
    businessId: 'biz-001',
    intent: 'CASHFLOW',
    recommendation: 'Collect overdue receivables this week.',
    why: '₹12,000 overdue',
    priority: 'P1',
    sourceMetrics: [{ source: 'test', metric: 'cash', value: 85000, unit: 'INR' }],
    status: 'ACTIVE',
    createdAt: new Date()
  });
  assert.ok(created._id);

  const recent = await RecommendationRepository.findRecent('biz-001', 5);
  assert.ok(recent.some(r => r._id?.equals(created._id!)));
});
