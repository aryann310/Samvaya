import type { BusinessHealthIntelligence } from '../types/intelligence.types.js';
import { EvidenceEngine } from '../evidence/evidence.engine.js';
import type { FinancialIntelligence, CashFlowIntelligence, InventoryIntelligence, FinancingIntelligence } from '../types/intelligence.types.js';

export class BusinessHealthEngine {
  static calculate(
    financials: FinancialIntelligence,
    cashflow: CashFlowIntelligence,
    inventory: InventoryIntelligence,
    financing: FinancingIntelligence,
    evidence: EvidenceEngine
  ): BusinessHealthIntelligence {
    let score = 0;
    
    // Profitability (30%)
    let profScore = 0;
    if (financials.netMargin > 20) profScore = 30;
    else if (financials.netMargin > 10) profScore = 20;
    else if (financials.netMargin > 0) profScore = 10;
    
    // Cash Flow (30%)
    let cashScore = 0;
    if (cashflow.cashRunwayDays > 90) cashScore = 30;
    else if (cashflow.cashRunwayDays > 30) cashScore = 20;
    else if (cashflow.cashRunwayDays > 15) cashScore = 10;
    
    // Inventory Health (20%)
    let invScore = 0;
    if (inventory.health === 'HIGH') invScore = 20;
    else if (inventory.health === 'MEDIUM') invScore = 10;
    
    // Debt & Financing (20%)
    let debtScore = 0;
    if (financing.debtService.risk === 'LOW') debtScore = 20;
    else if (financing.debtService.risk === 'MEDIUM') debtScore = 10;

    score = profScore + cashScore + invScore + debtScore;

    let band: 'HEALTHY' | 'STABLE' | 'VULNERABLE' | 'CRITICAL' = 'CRITICAL';
    if (score >= 80) band = 'HEALTHY';
    else if (score >= 60) band = 'STABLE';
    else if (score >= 40) band = 'VULNERABLE';

    evidence.addEvidence('healthScore', score, 'points', 'business-health.engine', 'CALCULATED');

    return {
      score,
      band,
      factors: {
        profitability: profScore,
        cashFlow: cashScore,
        inventory: invScore,
        debt: debtScore
      }
    };
  }
}
