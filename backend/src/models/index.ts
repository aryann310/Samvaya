export interface BankAccountDetails {
  accountNumber: string;
  ifscCode: string;
  bankName?: string;
  accountHolderName?: string;
}

export interface Business {
  id: string;
  name: string;
  type: string;
  category: string;
  location: { village: string; taluka: string; district: string; state: string; pincode: string; lat: number; lng: number };
  owner: {
    name: string;
    phone: string;
    email: string;
    aadhaar: string;
    panCard: string;
    bankAccount?: BankAccountDetails;
  };
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

export interface FinancialRecord {
  month: string;
  revenue: { total: number; breakdown: { category: string; amount: number }[] };
  expenses: { total: number; breakdown: { category: string; amount: number }[] };
  profit: number;
  profitMargin: number;
}

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
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastRestocked: string;
}

export interface CashFlowEntry {
  month: string;
  inflows: { total: number; breakdown: { source: string; amount: number }[] };
  outflows: { total: number; breakdown: { category: string; amount: number }[] };
  netFlow: number;
  closingBalance: number;
}

export interface Competitor {
  id: string;
  name: string;
  distance: number;
  type: string;
  estimatedRevenue: number;
  pricingInfo: { item: string; price: number }[];
}

export interface DemandCategory {
  category: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  searchVolume: number;
}

export interface PricingComparison {
  item: string;
  yourPrice: number;
  localAverage: number;
}

export interface LocalPlace {
  name: string;
  type: string;
  distance: number;
}

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
}

export interface GovernmentScheme {
  id: string;
  name: string;
  ministry: string;
  description: string;
  benefits: string[];
  eligibilityCriteria: { criterion: string; met: boolean }[];
  applicationSteps: string[];
  officialLink: string;
  category: string;
  maxBenefit: number;
}

export interface AIInsight {
  id: string;
  type: 'revenue' | 'cost' | 'inventory' | 'market' | 'growth';
  recommendation: string;
  why: string;
  localEvidence: string;
  financialImpact: string;
  nextStep: { label: string; route: string };
  priority: 'high' | 'medium' | 'low';
}

export interface AdvisorResponse {
  keywords: string[];
  response: {
    en: ResponseText;
    hi: ResponseText;
    gu: ResponseText;
  };
}

export interface ResponseText {
  recommendation: string;
  why: string;
  localEvidence: string;
  financialImpact: string;
  nextStep: { label: string; route: string };
}

export interface DashboardPriority {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  route?: string;
}

export interface DashboardData {
  business: Business;
  healthScore: number;
  healthExplanation: string;
  recentFinancials: FinancialRecord[];
  insights: AIInsight[];
  priorities: DashboardPriority[];
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  averageMargin: number;
  records: FinancialRecord[];
}

export interface CashFlowData {
  entries: CashFlowEntry[];
  forecast: CashFlowEntry[];
  alerts: string[];
}

export interface HyperlocalData {
  competitors: Competitor[];
  demand: DemandCategory[];
  pricing: PricingComparison[];
  places: LocalPlace[];
  opportunities: string[];
}

export interface FinancingData {
  readinessScore: number;
  loans: LoanProduct[];
}

export interface ReportData {
  business: Business;
  financialSummary: FinancialSummary;
  inventorySummary: { totalItems: number; lowStock: number; outOfStock: number };
  hyperlocalSummary: HyperlocalData;
}

export interface LoanAffordabilityRequest {
  principal: number;
  rate: number;
  years: number;
}

export interface AmortizationEntry {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanAffordabilityResult {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  schedule: AmortizationEntry[];
  dti: number;
  isAffordable: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
