import { DataStore } from './dataStore';

export class CashFlowService {
  static getCashFlow(businessId: string) {
    const entries = DataStore.cashflow || [];
    const last = entries.length > 0 ? entries[entries.length - 1] : { closingBalance: 85000, inflows: { total: 185000 }, outflows: { total: 145000 } };
    
    const baseInflow = last.inflows?.total || 185000;
    const baseOutflow = last.outflows?.total || 145000;
    let runningBalance = last.closingBalance || 85000;

    const forecast = [
      { month: "2024-07", projectedInflow: Math.round(baseInflow * 1.04), projectedOutflow: Math.round(baseOutflow * 1.02), projectedNetFlow: Math.round(baseInflow * 1.04 - baseOutflow * 1.02), projectedBalance: 0 },
      { month: "2024-08", projectedInflow: Math.round(baseInflow * 1.08), projectedOutflow: Math.round(baseOutflow * 1.03), projectedNetFlow: Math.round(baseInflow * 1.08 - baseOutflow * 1.03), projectedBalance: 0 },
      { month: "2024-09", projectedInflow: Math.round(baseInflow * 1.15), projectedOutflow: Math.round(baseOutflow * 1.06), projectedNetFlow: Math.round(baseInflow * 1.15 - baseOutflow * 1.06), projectedBalance: 0 }
    ].map(f => {
      runningBalance += f.projectedNetFlow;
      return { ...f, projectedBalance: runningBalance };
    });

    const alerts = [
      {
        id: 'alert-festive-prep',
        type: 'info' as const,
        month: '2024-09',
        message: 'Advance cash needed for Diwali wholesale procurement (~₹40,000 extra inventory).'
      }
    ];

    return { 
      entries, 
      forecast, 
      alerts,
      currentBalance: last.closingBalance || 85000
    };
  }
}
