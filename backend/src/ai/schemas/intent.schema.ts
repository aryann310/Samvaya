export type IntentType = 
  | 'GENERAL_BUSINESS_ADVICE'
  | 'BUSINESS_HEALTH'
  | 'CASH_FLOW'
  | 'PROFITABILITY'
  | 'EXPENSE_ANALYSIS'
  | 'INVENTORY'
  | 'REORDER_DECISION'
  | 'STOCKOUT_RISK'
  | 'DEAD_STOCK'
  | 'PRICING'
  | 'SALES'
  | 'MARKET_DEMAND'
  | 'COMPETITOR_ANALYSIS'
  | 'PROCUREMENT'
  | 'SUPPLIER_DECISION'
  | 'SEASONAL_PLANNING'
  | 'BUSINESS_EXPANSION'
  | 'BUSINESS_OPPORTUNITY'
  | 'LOAN_READINESS'
  | 'FINANCING'
  | 'EMI'
  | 'DEBT_MANAGEMENT'
  | 'GOVERNMENT_SCHEME'
  | 'RISK_ANALYSIS'
  | 'BUSINESS_PLAN'
  | 'GENERAL_INFORMATION'
  | 'UNKNOWN';

export interface IntentSchema {
  intent: IntentType;
  confidence: number;
  language: 'en' | 'hi' | 'gu' | 'mixed';
  entities: Record<string, string>;
  requiredData: string[];
  requiresCalculation: boolean;
  requiresFinancialData: boolean;
  requiresInventoryData: boolean;
  requiresMarketData: boolean;
  requiresSchemeData: boolean;
}
