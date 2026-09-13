import type { CashFlowIntelligence } from '../types/intelligence.types.js';
import { EvidenceEngine } from '../evidence/evidence.engine.js';

export class CashFlowEngine {
  static calculate(
    cashFlowData: any[],
    businessData: any,
    evidence: EvidenceEngine
  ): CashFlowIntelligence {
    if (!cashFlowData || cashFlowData.length === 0) {
      evidence.addEvidence('cashRunwayDays', null, 'days', 'cashflow.engine', 'INSUFFICIENT_DATA');
      return {
        currentCash: 0,
        netCashFlow30Days: 0,
        projectedCash30Days: 0,
        projectedCash60Days: 0,
        projectedCash90Days: 0,
        minimumProjectedCash: 0,
        cashRunwayDays: 0,
        riskLevel: 'UNKNOWN'
      };
    }

    const latest = cashFlowData[cashFlowData.length - 1];
    const currentCash = latest.closingBalance || 0;
    
    // Simple moving average for monthly inflows and outflows over last 3 months
    const recentData = cashFlowData.slice(-3);
    const avgInflow = recentData.reduce((acc: number, val: any) => acc + (val.inflows?.total || 0), 0) / recentData.length;
    const avgOutflow = recentData.reduce((acc: number, val: any) => acc + (val.outflows?.total || 0), 0) / recentData.length;
    
    // Add known upcoming payables to the 30-day outflow
    const upcomingPayables = businessData?.payables?.upcoming || 0;
    const overduePayables = businessData?.payables?.overdue || 0;
    const expectedOutflow30 = avgOutflow + upcomingPayables + overduePayables;

    // Add expected receivables to the 30-day inflow (assume we collect 50% of outstanding)
    const totalReceivables = businessData?.receivables?.total || 0;
    const expectedInflow30 = avgInflow + (totalReceivables * 0.5);

    const netCashFlow30Days = expectedInflow30 - expectedOutflow30;
    const projectedCash30Days = currentCash + netCashFlow30Days;
    
    // 60 and 90 days revert to average
    const avgNetFlow = avgInflow - avgOutflow;
    const projectedCash60Days = projectedCash30Days + avgNetFlow;
    const projectedCash90Days = projectedCash60Days + avgNetFlow;
    
    const minimumProjectedCash = Math.min(projectedCash30Days, projectedCash60Days, projectedCash90Days);
    
    const cashRunwayDays = avgOutflow > 0 ? Math.floor((currentCash / avgOutflow) * 30) : 999;
    
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN' = 'LOW';
    if (minimumProjectedCash < 0 || cashRunwayDays < 15) {
      riskLevel = 'HIGH';
    } else if (minimumProjectedCash < avgOutflow * 0.5 || cashRunwayDays < 45) {
      riskLevel = 'MEDIUM';
    }

    evidence.addEvidence('cashRunwayDays', cashRunwayDays, 'days', 'cashflow.engine', 'CALCULATED');
    evidence.addEvidence('projectedCash30Days', projectedCash30Days, 'INR', 'cashflow.engine', 'CALCULATED');

    return {
      currentCash,
      netCashFlow30Days,
      projectedCash30Days,
      projectedCash60Days,
      projectedCash90Days,
      minimumProjectedCash,
      cashRunwayDays,
      riskLevel
    };
  }
}
