import type { FinancingIntelligence } from '../types/intelligence.types.js';
import { EvidenceEngine } from '../evidence/evidence.engine.js';
import type { FinancialIntelligence, CashFlowIntelligence } from '../types/intelligence.types.js';

export class FinancingEngine {
  static calculate(
    businessData: any,
    financials: FinancialIntelligence,
    cashflow: CashFlowIntelligence,
    evidence: EvidenceEngine
  ): FinancingIntelligence {
    const existingMonthlyDebt = businessData?.debt?.monthlyEmi || 0;
    const avgMonthlyProfit = financials.netProfit > 0 ? financials.netProfit : 0; // In reality this would be averaged over history, but we use netProfit
    
    // Repayment Capacity: typically 40-50% of net profit
    const estimatedRepaymentCapacity = avgMonthlyProfit * 0.4;
    const remainingCapacity = estimatedRepaymentCapacity - existingMonthlyDebt;
    
    const dti = avgMonthlyProfit > 0 ? (existingMonthlyDebt / avgMonthlyProfit) * 100 : 100;
    let debtRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (dti > 50 || remainingCapacity <= 0) debtRisk = 'HIGH';
    else if (dti > 30) debtRisk = 'MEDIUM';

    // Samvaya Financing Readiness Score
    let readinessScore = 50; // Base score
    const factors: Record<string, number> = {};
    
    // Profitability factor
    if (financials.netMargin > 15) { readinessScore += 15; factors.profitability = 20; }
    else if (financials.netMargin > 5) { readinessScore += 5; factors.profitability = 10; }
    else { factors.profitability = 0; }

    // Cash flow factor
    if (cashflow.cashRunwayDays > 60) { readinessScore += 15; factors.cashFlow = 20; }
    else if (cashflow.cashRunwayDays > 30) { readinessScore += 5; factors.cashFlow = 10; }
    else { factors.cashFlow = 0; }

    // Debt Burden factor
    if (dti < 20) { readinessScore += 20; factors.debtBurden = 20; }
    else if (dti < 40) { readinessScore += 10; factors.debtBurden = 10; }
    else { factors.debtBurden = 0; }

    // Cap at 100
    readinessScore = Math.min(100, readinessScore);

    let band: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' = 'POOR';
    if (readinessScore >= 80) band = 'EXCELLENT';
    else if (readinessScore >= 60) band = 'GOOD';
    else if (readinessScore >= 40) band = 'FAIR';

    // Financial Structuring
    // Working capital gap = Payables - Receivables - Cash (if negative, it's a gap)
    const payables = businessData?.payables?.total || 0;
    const receivables = businessData?.receivables?.total || 0;
    const cash = cashflow.currentCash;
    let gap = payables - receivables - cash;
    if (gap < 0) gap = 0;

    // Safe financing range max based on 36 month loan at ~15% interest = roughly 30 * remaining capacity
    let maxLoan = remainingCapacity > 0 ? remainingCapacity * 30 : 0;
    
    let structRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (maxLoan < gap) structRisk = 'HIGH'; // They need more than they can safely borrow

    evidence.addEvidence('readinessScore', readinessScore, 'points', 'financing.engine', 'CALCULATED');
    
    return {
      readinessScore,
      band,
      factors,
      debtService: {
        existingMonthlyDebt,
        estimatedRepaymentCapacity,
        remainingCapacity,
        risk: debtRisk
      },
      structuring: {
        workingCapitalGap: gap,
        suggestedFinancingRange: {
          min: Math.floor(maxLoan * 0.2), // Suggest starting with 20% of max
          max: Math.floor(maxLoan)
        },
        riskLevel: structRisk
      }
    };
  }
}
