export interface Evidence {
  metric: string;
  value: any;
  unit: string;
  source: string;
  status: 'CALCULATED' | 'ESTIMATED' | 'DEMO' | 'STATIC' | 'LIVE' | 'CACHED' | 'UNKNOWN' | 'INSUFFICIENT_DATA';
}

export interface FinancialIntelligence {
  revenue: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
  grossMargin: number;
  netMargin: number;
  trend: 'up' | 'down' | 'stable' | 'unknown';
  status: 'OK' | 'INSUFFICIENT_DATA';
}

export interface CashFlowIntelligence {
  currentCash: number;
  netCashFlow30Days: number;
  projectedCash30Days: number;
  projectedCash60Days: number;
  projectedCash90Days: number;
  minimumProjectedCash: number;
  cashRunwayDays: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
}

export interface WorkingCapitalIntelligence {
  workingCapital: number;
  currentAssets: number;
  currentLiabilities: number;
  status: 'HEALTHY' | 'TIGHT' | 'CRITICAL' | 'UNKNOWN';
  receivables: {
    total: number;
    overdue: number;
    overduePercentage: number;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  payables: {
    total: number;
    overdue: number;
    upcoming: number;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

export interface InventoryItemIntelligence {
  sku: string;
  currentStock: number;
  averageDailySales: number;
  daysOfStock: number | 'NO_RECENT_SALES';
  reorderPoint: number;
  recommendedOrderQuantity: number;
  stockoutRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  deadStockRisk: 'HIGH' | 'LOW';
}

export interface InventoryIntelligence {
  health: 'HIGH' | 'MEDIUM' | 'LOW';
  stockoutItems: number;
  deadStockItems: number;
  items: InventoryItemIntelligence[];
}

export interface FinancingIntelligence {
  readinessScore: number;
  band: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  factors: Record<string, number>;
  debtService: {
    existingMonthlyDebt: number;
    estimatedRepaymentCapacity: number;
    remainingCapacity: number;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  structuring: {
    workingCapitalGap: number;
    suggestedFinancingRange: {
      min: number;
      max: number;
    };
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

export interface BusinessHealthIntelligence {
  score: number;
  band: 'HEALTHY' | 'STABLE' | 'VULNERABLE' | 'CRITICAL';
  factors: {
    profitability: number;
    cashFlow: number;
    inventory: number;
    debt: number;
  };
}

export interface RiskIntelligence {
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risks: Array<{
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    evidence: string[];
  }>;
}

export interface BusinessSnapshot {
  businessHealth: BusinessHealthIntelligence;
  financial: FinancialIntelligence;
  workingCapital: WorkingCapitalIntelligence;
  cashFlow: CashFlowIntelligence;
  inventory: InventoryIntelligence;
  financing: FinancingIntelligence;
  risks: RiskIntelligence;
  evidence: Evidence[];
}
