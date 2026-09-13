import type { RiskIntelligence, FinancialIntelligence, CashFlowIntelligence, InventoryIntelligence, FinancingIntelligence, WorkingCapitalIntelligence } from '../types/intelligence.types.js';
import { EvidenceEngine } from '../evidence/evidence.engine.js';

export class RiskEngine {
  static calculate(
    financials: FinancialIntelligence,
    cashflow: CashFlowIntelligence,
    inventory: InventoryIntelligence,
    workingCapital: WorkingCapitalIntelligence,
    financing: FinancingIntelligence,
    evidence: EvidenceEngine
  ): RiskIntelligence {
    const risks: RiskIntelligence['risks'] = [];
    
    // Cash Flow Risk
    if (cashflow.riskLevel !== 'LOW' && cashflow.riskLevel !== 'UNKNOWN') {
      risks.push({
        type: 'CASH_FLOW',
        severity: cashflow.riskLevel,
        evidence: [`Runway is ${cashflow.cashRunwayDays} days`, `Minimum projected cash: ${cashflow.minimumProjectedCash}`]
      });
    }

    // Working Capital Risk
    if (workingCapital.status === 'CRITICAL' || workingCapital.status === 'TIGHT') {
      risks.push({
        type: 'WORKING_CAPITAL',
        severity: workingCapital.status === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
        evidence: [`Current Ratio is tight`, `Working capital: ${workingCapital.workingCapital}`]
      });
    }

    // Receivables Risk
    if (workingCapital.receivables.risk !== 'LOW') {
      risks.push({
        type: 'RECEIVABLES',
        severity: workingCapital.receivables.risk,
        evidence: [`${workingCapital.receivables.overduePercentage}% of receivables are overdue`]
      });
    }

    // Inventory Risk
    if (inventory.health !== 'HIGH') {
      risks.push({
        type: 'INVENTORY',
        severity: inventory.health === 'LOW' ? 'HIGH' : 'MEDIUM',
        evidence: [`${inventory.stockoutItems} items at stockout risk`, `${inventory.deadStockItems} items are dead stock`]
      });
    }

    // Debt Risk
    if (financing.debtService.risk !== 'LOW') {
      risks.push({
        type: 'DEBT',
        severity: financing.debtService.risk,
        evidence: [`Remaining repayment capacity is ${financing.debtService.remainingCapacity}`]
      });
    }

    // Overall Risk
    let overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    const highCount = risks.filter(r => r.severity === 'HIGH' || r.severity === 'CRITICAL').length;
    if (highCount >= 2) overallRisk = 'CRITICAL';
    else if (highCount === 1) overallRisk = 'HIGH';
    else if (risks.length >= 2) overallRisk = 'MEDIUM';
    else if (risks.length === 1) overallRisk = 'MEDIUM';

    evidence.addEvidence('overallRisk', overallRisk, 'level', 'risk.engine', 'CALCULATED');

    return {
      overallRisk,
      risks
    };
  }
}
