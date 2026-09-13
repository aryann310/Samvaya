import type { FinancialIntelligence } from '../types/intelligence.types.js';
import { EvidenceEngine } from '../evidence/evidence.engine.js';

export class FinancialEngine {
  static calculate(
    financialRecords: any[],
    evidence: EvidenceEngine
  ): FinancialIntelligence {
    if (!financialRecords || financialRecords.length === 0) {
      evidence.addEvidence('financials', null, 'status', 'financial.engine', 'INSUFFICIENT_DATA');
      return {
        revenue: 0,
        expenses: 0,
        grossProfit: 0,
        netProfit: 0,
        grossMargin: 0,
        netMargin: 0,
        trend: 'unknown',
        status: 'INSUFFICIENT_DATA'
      };
    }

    const latest = financialRecords[financialRecords.length - 1];
    const prev = financialRecords.length > 1 ? financialRecords[financialRecords.length - 2] : null;

    const revenue = latest.revenue?.total || 0;
    const expenses = latest.expenses?.total || 0;
    
    // For simplicity, we assume grossProfit and netProfit are same if cogs not explicitly separated.
    // If we had cogs, grossProfit = revenue - cogs, netProfit = grossProfit - opEx
    let cogs = 0;
    (latest.expenses?.breakdown || []).forEach((b: any) => {
      if (b.category.toLowerCase().includes('inventory') || b.category.toLowerCase().includes('stock')) {
        cogs += b.amount;
      }
    });

    const grossProfit = revenue - cogs;
    const netProfit = revenue - expenses;
    
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    let trend: 'up' | 'down' | 'stable' | 'unknown' = 'unknown';
    if (prev) {
      const prevRev = prev.revenue?.total || 0;
      if (revenue > prevRev * 1.05) trend = 'up';
      else if (revenue < prevRev * 0.95) trend = 'down';
      else trend = 'stable';
    }

    evidence.addEvidence('netMargin', netMargin, '%', 'financial.engine', 'CALCULATED');
    evidence.addEvidence('revenue', revenue, 'INR', 'financial.engine', 'CALCULATED');

    return {
      revenue,
      expenses,
      grossProfit,
      netProfit,
      grossMargin: parseFloat(grossMargin.toFixed(2)),
      netMargin: parseFloat(netMargin.toFixed(2)),
      trend,
      status: 'OK'
    };
  }
}
