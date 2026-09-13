import { DashboardService } from '../../services/dashboard.service.js';
import { FinanceService } from '../../services/finance.service.js';
import { HyperlocalService } from '../../services/hyperlocal.service.js';
import { InventoryService } from '../../services/inventory.service.js';
import { SchemesService } from '../../services/schemes.service.js';
import { CashflowService } from '../../services/cashflow.service.js';
import { BusinessService } from '../../services/business.service.js';

export class ToolRouter {
  static async fetchRequiredData(requiredData: string[], businessId: string): Promise<Record<string, any>> {
    const data: Record<string, any> = {};

    for (const req of requiredData) {
      try {
        switch (req) {
          case 'businessProfile':
            data.businessProfile = await BusinessService.getBusiness(businessId);
            break;
          case 'financialData':
            data.financialData = await FinanceService.getFinancialSummary(businessId);
            break;
          case 'financials':
          case 'cashflow':
            if (!data.financials) {
              data.financials = await FinanceService.getFinancialRecords(businessId);
            }
            if (!data.cashflow) {
              data.cashflow = await CashflowService.getCashflow(businessId);
            }
            break;
          case 'inventory':
            data.inventory = await InventoryService.getAll(businessId);
            break;
          case 'salesHistory':
            data.salesHistory = (await FinanceService.getFinancialRecords(businessId)).slice(-3);
            break;
          case 'marketData':
          case 'hyperlocalData':
            data.hyperlocalData = HyperlocalService.getHyperlocalData(businessId);
            break;
          case 'governmentSchemes':
            data.governmentSchemes = await SchemesService.getAll();
            break;
          case 'transactions':
            // Approximate from financial records
            data.transactions = (await FinanceService.getFinancialSummary(businessId))?.monthlyData || [];
            break;
        }
      } catch (err) {
        console.warn(`[ToolRouter] Failed to fetch data for ${req}:`, (err as any).message);
      }
    }

    // Always include dashboard aggregate for baseline context
    try {
      data.dashboard = await DashboardService.getDashboard(businessId);
    } catch (e) {}

    return data;
  }
}
