// ============================================================
// Samvaya — Shared TypeScript Interfaces
// All types match the backend data models and API response shapes
// ============================================================

// ---- Business ----
export interface BusinessLocation {
  village: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
}

export interface BusinessOwner {
  name: string;
  phone: string;
  email: string;
  aadhaar: string;
  panCard: string;
}

export interface Business {
  id: string;
  name: string;
  type: string;
  category: string;
  location: BusinessLocation;
  owner: BusinessOwner;
  yearsActive: number;
  registrationType: string;
  gstRegistered: boolean;
  gstNumber?: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  employees: number;
  description: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

// ---- Dashboard ----
export interface HealthScoreFactor {
  name: string;
  score: number;
  weight: number;
}

export interface HealthScore {
  score: number;
  explanation: string;
  factors: HealthScoreFactor[];
}

export interface StatData {
  value: number;
  trend: number; // percentage vs last month
  data: number[]; // sparkline data points
}

export interface DashboardStats {
  revenue: StatData;
  expenses: StatData;
  profit: StatData;
  cash: StatData;
}

export interface DashboardPriority {
  id: string;
  businessId: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  route?: string;
}

export interface MarketPulse {
  competitors: number;
  avgDemandGrowth: number;
  topCategory: string;
  summary: string;
}

export interface CashFlowChartPoint {
  month: string;
  inflow: number;
  outflow: number;
}

export interface BusinessOpportunity {
  id: string;
  title: string;
  description: string;
  impact: string;
  category: string;
}

export interface DashboardData {
  healthScore: HealthScore;
  stats: DashboardStats;
  insights: AIInsight[];
  priorities: DashboardPriority[];
  marketPulse: MarketPulse;
  cashFlowChart: CashFlowChartPoint[];
  opportunities: BusinessOpportunity[];
}

// ---- AI / Advisor ----
export interface AINextStep {
  label: string;
  route: string;
}

export interface AIInsight {
  id: string;
  businessId: string;
  type: 'revenue' | 'cost' | 'inventory' | 'market' | 'growth';
  recommendation: string;
  why: string;
  localEvidence: string;
  financialImpact: string;
  nextStep: AINextStep;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface AdvisorResponse {
  recommendation: string;
  why: string;
  localEvidence: string;
  financialImpact: string;
  nextStep: AINextStep;
}

export interface AdvisorMessage {
  id: string;
  role: 'user' | 'advisor';
  content: string;           // for user messages
  response?: AdvisorResponse; // for advisor messages (structured)
  timestamp: string;
}

// ---- Finances ----
export interface BreakdownItem {
  category: string;
  amount: number;
}

export interface MonthlyFinancial {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  revenueBreakdown: BreakdownItem[];
  expenseBreakdown: BreakdownItem[];
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  avgProfitMargin: number;
  revenueTrend: number;
  debtToIncome: number;
  financingReadinessScore: number;
  monthlyData: MonthlyFinancial[];
  revenueByCategory: BreakdownItem[];
  expenseByCategory: BreakdownItem[];
}

export interface LoanAffordabilityRequest {
  loanAmount?: number;
  principal?: number;
  interestRate?: number;
  rate?: number;
  tenureMonths?: number;
  years?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
}

export interface LoanAffordabilityResult {
  emi: number;
  totalPayment?: number;
  totalAmount?: number;
  totalInterest: number;
  affordable?: boolean;
  isAffordable?: boolean;
  dtiRatio?: number;
  dti?: number;
  maxAffordableEmi?: number;
  amortizationSchedule?: AmortizationEntry[];
  schedule?: AmortizationEntry[];
}

export interface AmortizationEntry {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

// ---- Cash Flow ----
export interface CashFlowBreakdownItem {
  source: string;
  amount: number;
}

export interface CashFlowEntry {
  month: string;
  inflows: {
    total: number;
    breakdown: CashFlowBreakdownItem[];
  };
  outflows: {
    total: number;
    breakdown: CashFlowBreakdownItem[];
  };
  netFlow: number;
  closingBalance: number;
}

export interface CashFlowForecast {
  month: string;
  projectedInflow: number;
  projectedOutflow: number;
  projectedNetFlow: number;
  projectedBalance: number;
}

export interface CashFlowAlert {
  id: string;
  type: 'shortfall' | 'warning' | 'info';
  month: string;
  message: string;
  amount?: number;
}

export interface CashFlowData {
  entries: CashFlowEntry[];
  forecast: CashFlowForecast[];
  alerts: CashFlowAlert[];
  currentBalance: number;
}

// ---- Inventory ----
export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface InventoryItem {
  id: string;
  businessId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  unitCost: number;
  salePrice: number;
  status: InventoryStatus;
  lastRestocked: string;
}

export interface InventoryItemInput {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  unitCost: number;
  salePrice: number;
}

// ---- Hyperlocal ----
export interface Competitor {
  id: string;
  name: string;
  type: string;
  category: string;
  distance: number;
  location: {
    lat: number;
    lng: number;
    area: string;
  };
  estimatedMonthlyRevenue: number;
  pricing: { item: string; price: number }[];
}

export interface DemandCategory {
  category: string;
  demand: number;
  trend: number;
}

export interface PricingComparison {
  item: string;
  yourPrice: number;
  localAverage: number;
  difference: number;
}

export interface LocalPlace {
  id: string;
  name: string;
  type: 'market' | 'school' | 'transport' | 'hospital' | 'temple' | 'bank';
  distance: number;
  location: { lat: number; lng: number };
}

export interface HyperlocalData {
  competitors: Competitor[];
  demand: DemandCategory[];
  pricing: PricingComparison[];
  opportunities: BusinessOpportunity[];
  nearbyPlaces: LocalPlace[];
}

// ---- Financing / Loan Products ----
export interface LoanProduct {
  id: string;
  bankName: string;
  productName: string;
  type: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  tenure: { min: number; max: number };
  processingFee: number;
  eligibilityCriteria: string[];
  features: string[];
  eligible: boolean;
  matchScore: number;
}

export interface FinancingData {
  readinessScore: number;
  readinessFactors: { name: string; score: number; maxScore: number }[];
  loanProducts: LoanProduct[];
}

export interface LoanApplicationStep {
  step: number;
  title: string;
  fields: LoanApplicationField[];
}

export interface LoanApplicationField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'file';
  required: boolean;
  options?: string[];
}

// ---- Government Schemes ----
export interface SchemeEligibility {
  criterion: string;
  met: boolean;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  ministry: string;
  description: string;
  benefits: string[];
  eligibilityCriteria: SchemeEligibility[];
  eligibilityMatch: number;
  applicationSteps: string[];
  officialLink: string;
  category: string;
  maxBenefit: string;
}

// ---- Reports ----
export interface ReportData {
  businessName: string;
  period: string;
  generatedAt: string;
  financialSummary: {
    revenue: number;
    expenses: number;
    profit: number;
    profitMargin: number;
    cashBalance: number;
  };
  monthlyTrend: { month: string; revenue: number; expenses: number; profit: number }[];
  topInsights: AIInsight[];
  inventorySummary: {
    totalItems: number;
    lowStockItems: number;
    totalValue: number;
  };
  hyperlocalSummary: {
    competitorCount: number;
    marketPosition: string;
    topOpportunity: string;
  };
}

// ---- Utility Types ----
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'gu';

export interface UserPreferences {
  language: SupportedLanguage;
  theme: 'light' | 'dark';
  notifications: {
    lowStock: boolean;
    cashFlowAlerts: boolean;
    aiInsights: boolean;
    schemeUpdates: boolean;
  };
}
