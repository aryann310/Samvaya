import { DataStore } from '../services/dataStore.js';
import { FinancialEngine } from './financial/financial.engine.js';
import { CashFlowEngine } from './cashflow/cashflow.engine.js';
import { InventoryEngine } from './inventory/inventory.engine.js';
import { WorkingCapitalEngine } from './working-capital/working-capital.engine.js';
import { FinancingEngine } from './financing/financing.engine.js';
import { BusinessHealthEngine } from './health/business-health.engine.js';
import { RiskEngine } from './risk/risk.engine.js';
import { EvidenceEngine } from './evidence/evidence.engine.js';
import type { BusinessSnapshot } from './types/intelligence.types.js';

/** Optional raw inputs — when provided, engines never touch DataStore. */
export interface IntelligenceInput {
  businessData?: any;
  financialRecords?: any[];
  cashFlowRecords?: any[];
  inventoryData?: any[];
}

export class IntelligenceEngine {
  /**
   * Pure composition over engines. Pass repository/service data in mongodb mode;
   * omit input to fall back to demo JSON DataStore.
   */
  static getBusinessIntelligenceSnapshot(input?: IntelligenceInput): BusinessSnapshot {
    const evidence = new EvidenceEngine();

    const businessData = input?.businessData ?? DataStore.business;
    const financialRecords = input?.financialRecords ?? DataStore.financials;
    const cashFlowRecords = input?.cashFlowRecords ?? DataStore.cashflow;
    const inventoryData = input?.inventoryData ?? DataStore.inventory;

    const financial = FinancialEngine.calculate(financialRecords, evidence);
    const cashFlow = CashFlowEngine.calculate(cashFlowRecords, businessData, evidence);
    const workingCapital = WorkingCapitalEngine.calculate(
      businessData,
      inventoryData,
      cashFlow.currentCash,
      evidence
    );
    const inventory = InventoryEngine.calculate(inventoryData, evidence);
    const financing = FinancingEngine.calculate(businessData, financial, cashFlow, evidence);
    const businessHealth = BusinessHealthEngine.calculate(
      financial,
      cashFlow,
      inventory,
      financing,
      evidence
    );
    const risks = RiskEngine.calculate(
      financial,
      cashFlow,
      inventory,
      workingCapital,
      financing,
      evidence
    );

    return {
      businessHealth,
      financial,
      workingCapital,
      cashFlow,
      inventory,
      financing,
      risks,
      evidence: evidence.getEvidence()
    };
  }

  /** Async helper: load dual-mode service data then compute snapshot. */
  static async getBusinessIntelligenceSnapshotForBusiness(
    businessId = 'biz-001'
  ): Promise<BusinessSnapshot> {
    const { BusinessService } = await import('../services/business.service.js');
    const { FinanceService } = await import('../services/finance.service.js');
    const { CashflowService } = await import('../services/cashflow.service.js');
    const { InventoryService } = await import('../services/inventory.service.js');

    const [businessData, financialRecords, cashFlowRecords, inventoryData] = await Promise.all([
      BusinessService.getBusiness(businessId),
      FinanceService.getFinancialRecords(businessId),
      CashflowService.getCashflow(businessId),
      InventoryService.getAll(businessId)
    ]);

    return this.getBusinessIntelligenceSnapshot({
      businessData,
      financialRecords,
      cashFlowRecords,
      inventoryData
    });
  }
}
