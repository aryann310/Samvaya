/**
 * Advisor integration: service data → engines → response → MongoDB persistence.
 * Skips when MONGODB_URI is absent.
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
let getDatabase: typeof import('../src/db/connection.js').getDatabase;
let createIndexes: typeof import('../src/db/indexes.js').createIndexes;
let runSeed: typeof import('../src/db/seed.js').runSeed;
let AdvisorService: typeof import('../src/ai/services/advisor.service.js').AdvisorService;
let IntelligenceEngine: typeof import('../src/intelligence/index.js').IntelligenceEngine;
let FinanceService: typeof import('../src/services/finance.service.js').FinanceService;
let RecommendationRepository: typeof import('../src/db/repositories/index.js').RecommendationRepository;
let ConversationRepository: typeof import('../src/db/repositories/index.js').ConversationRepository;

before(async () => {
  if (skip) return;
  ({ connectDatabase, disconnectDatabase, getDatabase } = await import('../src/db/connection.js'));
  ({ createIndexes } = await import('../src/db/indexes.js'));
  ({ runSeed } = await import('../src/db/seed.js'));
  ({ AdvisorService } = await import('../src/ai/services/advisor.service.js'));
  ({ IntelligenceEngine } = await import('../src/intelligence/index.js'));
  ({ FinanceService } = await import('../src/services/finance.service.js'));
  ({ RecommendationRepository, ConversationRepository } = await import('../src/db/repositories/index.js'));

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

test('IntelligenceEngine uses Mongo-backed service data (not DataStore-only)', { skip }, async () => {
  const records = await FinanceService.getFinancialRecords('biz-001');
  assert.ok(records.length >= 1);

  const snapshot = await IntelligenceEngine.getBusinessIntelligenceSnapshotForBusiness('biz-001');
  assert.strictEqual(snapshot.financial.revenue, 180000);
  assert.strictEqual(snapshot.financial.expenses, 145000);
  assert.strictEqual(snapshot.cashFlow.currentCash, 85000);
  assert.ok(snapshot.financial.status !== 'INSUFFICIENT_DATA');
});

test('Advisor persists recommendation and conversation messages', { skip }, async () => {
  const beforeRecs = await RecommendationRepository.findRecent('biz-001', 50);
  const beforeCount = beforeRecs.length;

  const response = await AdvisorService.getAdvisory(
    'How is my cash flow looking this month?',
    'biz-001',
    'en'
  );

  assert.ok(response.recommendation);
  assert.ok(response.why);
  assert.ok(response.nextStep);

  // Persistence is fire-and-forget — brief wait
  await new Promise(r => setTimeout(r, 1500));

  const afterRecs = await RecommendationRepository.findRecent('biz-001', 50);
  assert.ok(
    afterRecs.length > beforeCount,
    `Expected recommendations to increase (before=${beforeCount}, after=${afterRecs.length})`
  );

  const conv = await ConversationRepository.getOrCreateForBusiness('biz-001', 'en');
  const msgs = await ConversationRepository.getRecentMessages(conv._id!.toString(), 20);
  assert.ok(msgs.length >= 2, 'Expected user + assistant messages');
  assert.ok(msgs.some(m => m.role === 'USER'));
  assert.ok(msgs.some(m => m.role === 'ASSISTANT'));
});
