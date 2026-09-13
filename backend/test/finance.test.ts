import { test } from 'node:test';
import assert from 'node:assert';
import { FinancialEngine } from '../src/intelligence/financial/financial.engine.js';
import { CashFlowEngine } from '../src/intelligence/cashflow/cashflow.engine.js';
import type { FinancialSnapshot, CashFlowForecast } from '../src/intelligence/types/intelligence.types.js';

class MockEvidenceEngine {
  addEvidence() {}
}

test('FinancialEngine calculates profit and margins correctly without NaN/undefined', () => {
  const records = [
    {
      revenue: { total: 180000 },
      expenses: { total: 125000, breakdown: [{ category: 'inventory', amount: 80000 }, { category: 'operating', amount: 45000 }] }
    }
  ];

  const result = FinancialEngine.calculate(records, new MockEvidenceEngine() as any);
  assert.strictEqual(result.revenue, 180000);
  assert.strictEqual(result.expenses, 125000);
  assert.strictEqual(result.netProfit, 55000);
  assert.strictEqual(result.grossMargin, 55.56);
  assert.strictEqual(result.netMargin, 30.56);
});

test('FinancialEngine handles zero revenue gracefully', () => {
  const records = [
    {
      revenue: { total: 0 },
      expenses: { total: 45000, breakdown: [{ category: 'operating', amount: 45000 }] }
    }
  ];

  const result = FinancialEngine.calculate(records, new MockEvidenceEngine() as any);
  assert.strictEqual(result.revenue, 0);
  assert.strictEqual(result.expenses, 45000);
  assert.strictEqual(result.netProfit, -45000);
  assert.strictEqual(result.grossMargin, 0);
  assert.strictEqual(result.netMargin, 0);
});

test('CashFlowEngine calculates runway correctly', () => {
  const financials: FinancialSnapshot = {
    monthlyRevenue: 180000,
    monthlyExpenses: 125000,
    netProfit: 55000,
    grossMargin: 55.56,
    netMargin: 30.56,
    workingCapital: 10000,
    currentRatio: 1.2,
    debtToEquity: 0.5,
    quickRatio: 1.1,
    operatingCashFlow: 55000
  };

  const business = {
    id: "biz-001",
    cashBalance: 42000
  };

  const cf = CashFlowEngine.calculate([{ closingBalance: 42000, inflows: { total: 180000 }, outflows: { total: 125000 } }], business as any, new MockEvidenceEngine() as any);
  
  assert.strictEqual(cf.cashRunwayDays, 10);
});
