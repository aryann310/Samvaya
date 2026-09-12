import os
import json

base_dir = r"f:\Hackathon\samvaya\server\src"

directories = [
    "models",
    "data",
    "utils",
    "services",
    "controllers",
    "routes",
    "middleware"
]

for d in directories:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

files = {}

files["models/index.ts"] = """
export interface Business {
  id: string;
  name: string;
  type: string;
  category: string;
  location: { village: string; taluka: string; district: string; state: string; pincode: string; lat: number; lng: number };
  owner: { name: string; phone: string; email: string; aadhaar: string; panCard: string };
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
"""

files["data/business.json"] = """
{
  "id": "b1",
  "name": "Patel General Store",
  "type": "Kirana Store",
  "category": "Retail",
  "location": {
    "village": "Modhera",
    "taluka": "Becharaji",
    "district": "Mehsana",
    "state": "Gujarat",
    "pincode": "384212",
    "lat": 23.5880,
    "lng": 72.1316
  },
  "owner": {
    "name": "Rameshbhai Patel",
    "phone": "9876543210",
    "email": "ramesh.patel@example.com",
    "aadhaar": "123456789012",
    "panCard": "ABCDE1234F"
  },
  "yearsActive": 8,
  "registrationType": "Sole Proprietorship",
  "gstRegistered": true,
  "gstNumber": "24ABCDE1234F1Z5",
  "monthlyRevenue": 180000,
  "monthlyExpenses": 145000,
  "employees": 2,
  "description": "General kirana store serving Modhera village for 8 years.",
  "documents": ["GST_Cert.pdf", "Aadhaar.pdf"],
  "createdAt": "2016-01-10T00:00:00Z",
  "updatedAt": "2024-09-01T00:00:00Z"
}
"""

files["data/financial-records.json"] = """
[
  {
    "month": "2023-07",
    "revenue": { "total": 170000, "breakdown": [{ "category": "Groceries", "amount": 93500 }, { "category": "FMCG", "amount": 34000 }, { "category": "Dairy", "amount": 25500 }, { "category": "Other", "amount": 17000 }] },
    "expenses": { "total": 140000, "breakdown": [{ "category": "Inventory", "amount": 91000 }, { "category": "Rent", "amount": 11200 }, { "category": "Utilities", "amount": 7000 }, { "category": "Transport", "amount": 9800 }, { "category": "Salary", "amount": 14000 }, { "category": "Other", "amount": 7000 }] },
    "profit": 30000,
    "profitMargin": 17.65
  },
  {
    "month": "2023-10",
    "revenue": { "total": 210000, "breakdown": [{ "category": "Groceries", "amount": 115500 }, { "category": "FMCG", "amount": 42000 }, { "category": "Dairy", "amount": 31500 }, { "category": "Other", "amount": 21000 }] },
    "expenses": { "total": 160000, "breakdown": [{ "category": "Inventory", "amount": 104000 }, { "category": "Rent", "amount": 12800 }, { "category": "Utilities", "amount": 8000 }, { "category": "Transport", "amount": 11200 }, { "category": "Salary", "amount": 16000 }, { "category": "Other", "amount": 8000 }] },
    "profit": 50000,
    "profitMargin": 23.8
  },
  {
    "month": "2024-01",
    "revenue": { "total": 190000, "breakdown": [{ "category": "Groceries", "amount": 104500 }, { "category": "FMCG", "amount": 38000 }, { "category": "Dairy", "amount": 28500 }, { "category": "Other", "amount": 19000 }] },
    "expenses": { "total": 150000, "breakdown": [{ "category": "Inventory", "amount": 97500 }, { "category": "Rent", "amount": 12000 }, { "category": "Utilities", "amount": 7500 }, { "category": "Transport", "amount": 10500 }, { "category": "Salary", "amount": 15000 }, { "category": "Other", "amount": 7500 }] },
    "profit": 40000,
    "profitMargin": 21.05
  },
  {
    "month": "2024-06",
    "revenue": { "total": 180000, "breakdown": [{ "category": "Groceries", "amount": 99000 }, { "category": "FMCG", "amount": 36000 }, { "category": "Dairy", "amount": 27000 }, { "category": "Other", "amount": 18000 }] },
    "expenses": { "total": 145000, "breakdown": [{ "category": "Inventory", "amount": 94250 }, { "category": "Rent", "amount": 11600 }, { "category": "Utilities", "amount": 7250 }, { "category": "Transport", "amount": 10150 }, { "category": "Salary", "amount": 14500 }, { "category": "Other", "amount": 7250 }] },
    "profit": 35000,
    "profitMargin": 19.44
  }
]
"""

files["data/inventory.json"] = """
[
  { "id": "i1", "businessId": "b1", "name": "Basmati Rice", "category": "Groceries", "quantity": 10, "unit": "kg", "reorderLevel": 20, "unitCost": 60, "salePrice": 80, "status": "low_stock", "lastRestocked": "2024-08-15" },
  { "id": "i2", "businessId": "b1", "name": "Wheat Flour (Atta)", "category": "Groceries", "quantity": 50, "unit": "kg", "reorderLevel": 30, "unitCost": 30, "salePrice": 40, "status": "in_stock", "lastRestocked": "2024-08-20" },
  { "id": "i3", "businessId": "b1", "name": "Toor Dal", "category": "Groceries", "quantity": 0, "unit": "kg", "reorderLevel": 15, "unitCost": 120, "salePrice": 150, "status": "out_of_stock", "lastRestocked": "2024-07-10" },
  { "id": "i4", "businessId": "b1", "name": "Sunflower Oil", "category": "Groceries", "quantity": 8, "unit": "L", "reorderLevel": 10, "unitCost": 110, "salePrice": 140, "status": "low_stock", "lastRestocked": "2024-08-25" },
  { "id": "i5", "businessId": "b1", "name": "Sugar", "category": "Groceries", "quantity": 40, "unit": "kg", "reorderLevel": 25, "unitCost": 35, "salePrice": 45, "status": "in_stock", "lastRestocked": "2024-08-28" }
]
"""

files["data/cashflow.json"] = """
[
  {
    "month": "2024-06",
    "inflows": { "total": 185000, "breakdown": [{ "source": "Store Sales", "amount": 180000 }, { "source": "Credit Recoveries", "amount": 5000 }] },
    "outflows": { "total": 145000, "breakdown": [{ "category": "Stock Purchase", "amount": 94250 }, { "category": "Rent", "amount": 11600 }, { "category": "Utilities", "amount": 7250 }, { "category": "Salaries", "amount": 14500 }, { "category": "Transport", "amount": 10150 }, { "category": "Misc", "amount": 7250 }] },
    "netFlow": 40000,
    "closingBalance": 85000
  }
]
"""

files["data/competitors.json"] = """
[
  { "id": "c1", "name": "Sharma Provision Store", "distance": 0.3, "type": "Kirana", "estimatedRevenue": 150000, "pricingInfo": [{ "item": "Toor Dal", "price": 145 }] },
  { "id": "c2", "name": "Mehta General Store", "distance": 0.8, "type": "Kirana", "estimatedRevenue": 120000, "pricingInfo": [{ "item": "Toor Dal", "price": 155 }] },
  { "id": "c3", "name": "Village Mini Market", "distance": 1.2, "type": "Supermarket", "estimatedRevenue": 300000, "pricingInfo": [{ "item": "Toor Dal", "price": 160 }] }
]
"""

files["data/hyperlocal.json"] = """
{
  "demand": [
    { "category": "Dairy", "trend": "increasing", "searchVolume": 85 },
    { "category": "Organic Pulses", "trend": "increasing", "searchVolume": 60 }
  ],
  "pricing": [
    { "item": "Toor Dal", "yourPrice": 150, "localAverage": 153 },
    { "item": "Sunflower Oil", "yourPrice": 140, "localAverage": 138 }
  ],
  "places": [
    { "name": "Modhera Sun Temple", "type": "Tourist Attraction", "distance": 1.0 },
    { "name": "Primary School", "type": "Education", "distance": 0.4 },
    { "name": "SBI Branch", "type": "Bank", "distance": 0.6 }
  ],
  "opportunities": [
    "Start stocking tourist-friendly packaged snacks due to proximity to Sun Temple.",
    "Add a dairy chiller as local dairy demand is rising."
  ]
}
"""

files["data/loan-products.json"] = """
[
  {
    "id": "l1",
    "bankName": "SBI",
    "productName": "Mudra Yojana - Shishu",
    "type": "Working Capital",
    "interestRate": 10,
    "minAmount": 10000,
    "maxAmount": 50000,
    "tenure": { "min": 1, "max": 5 },
    "processingFee": 0,
    "eligibilityCriteria": ["No past default", "Micro enterprise"],
    "features": ["No collateral", "Quick processing"]
  },
  {
    "id": "l2",
    "bankName": "SBI",
    "productName": "Mudra Yojana - Kishor",
    "type": "Expansion",
    "interestRate": 11,
    "minAmount": 50001,
    "maxAmount": 500000,
    "tenure": { "min": 1, "max": 5 },
    "processingFee": 1000,
    "eligibilityCriteria": ["Running business > 2 years", "Good credit score"],
    "features": ["No collateral"]
  }
]
"""

files["data/schemes.json"] = """
[
  {
    "id": "s1",
    "name": "PM Mudra Yojana (PMMY)",
    "ministry": "Ministry of Finance",
    "description": "Loans up to 10 lakh to non-corporate, non-farm small/micro enterprises.",
    "benefits": ["Collateral free loans", "Low interest rates"],
    "eligibilityCriteria": [{ "criterion": "Micro enterprise", "met": true }, { "criterion": "Indian citizen", "met": true }],
    "applicationSteps": ["Visit nearest bank", "Submit business plan", "Provide KYC"],
    "officialLink": "https://www.mudra.org.in/",
    "category": "Finance",
    "maxBenefit": 1000000
  },
  {
    "id": "s2",
    "name": "PMEGP",
    "ministry": "MSME",
    "description": "Prime Minister's Employment Generation Programme.",
    "benefits": ["Margin money subsidy"],
    "eligibilityCriteria": [{ "criterion": "New project", "met": false }],
    "applicationSteps": ["Apply online via KVIC portal"],
    "officialLink": "https://www.kviconline.gov.in/",
    "category": "Subsidy",
    "maxBenefit": 2500000
  }
]
"""

files["data/insights.json"] = """
[
  {
    "id": "in1",
    "type": "revenue",
    "recommendation": "Increase prices on staples by 3-5%",
    "why": "Local average for Toor Dal is ₹153, you are at ₹150. Margins can be improved without losing competitiveness.",
    "localEvidence": "Competitors Sharma and Mehta are charging ₹145-155.",
    "financialImpact": "Est. ₹2,000 extra monthly profit",
    "nextStep": { "label": "Update Pricing", "route": "/inventory" },
    "priority": "high"
  },
  {
    "id": "in2",
    "type": "inventory",
    "recommendation": "Stock extra cooking oil before Diwali",
    "why": "Historical data shows a 40% spike in oil sales during October.",
    "localEvidence": "General festive trend in Modhera.",
    "financialImpact": "Est. ₹5,000 extra revenue",
    "nextStep": { "label": "Order Stock", "route": "/inventory" },
    "priority": "high"
  }
]
"""

files["data/priorities.json"] = """
[
  { "id": "p1", "title": "Restock rice before Friday market", "description": "Basmati rice is low in stock.", "completed": false, "category": "inventory", "route": "/inventory" },
  { "id": "p2", "title": "Collect ₹3,200 pending from Desai family", "description": "Outstanding credit for over 30 days.", "completed": false, "category": "finance", "route": "/cashflow" }
]
"""

files["data/advisor-responses.json"] = """
[
  {
    "keywords": ["loan", "borrow"],
    "response": {
      "en": {
        "recommendation": "Consider Mudra Yojana - Kishor loan.",
        "why": "Based on your 8 years of operation and GST registration, you easily qualify.",
        "localEvidence": "SBI Modhera branch has processed 15 such loans recently.",
        "financialImpact": "Access to ₹2,000,000 working capital.",
        "nextStep": { "label": "View Loan Products", "route": "/financing" }
      },
      "hi": {
        "recommendation": "मुद्रा योजना - किशोर ऋण पर विचार करें।",
        "why": "आपके 8 साल के संचालन और जीएसटी पंजीकरण के आधार पर, आप आसानी से योग्य हैं।",
        "localEvidence": "एसबीआई मोढेरा शाखा ने हाल ही में ऐसे 15 ऋणों को संसाधित किया है।",
        "financialImpact": "₹2,000,000 कार्यशील पूंजी तक पहुंच।",
        "nextStep": { "label": "ऋण उत्पाद देखें", "route": "/financing" }
      },
      "gu": {
        "recommendation": "મુદ્રા યોજના - કિશોર લોનનો વિચાર કરો.",
        "why": "તમારા 8 વર્ષના સંચાલન અને જીએસટી નોંધણીના આધારે, તમે સરળતાથી લાયક છો.",
        "localEvidence": "એસબીઆઈ મોઢેરા શાખાએ તાજેતરમાં આવી 15 લોનની પ્રક્રિયા કરી છે.",
        "financialImpact": "₹2,000,000 કાર્યકારી મૂડીની ઍક્સેસ.",
        "nextStep": { "label": "લોન ઉત્પાદનો જુઓ", "route": "/financing" }
      }
    }
  },
  {
    "keywords": ["default"],
    "response": {
      "en": {
        "recommendation": "I can help you with inventory, financing, pricing, and business growth.",
        "why": "I analyze your local market data to give personalized advice.",
        "localEvidence": "Serving businesses in Modhera.",
        "financialImpact": "General business optimization.",
        "nextStep": { "label": "View Dashboard", "route": "/" }
      },
      "hi": {
        "recommendation": "मैं इन्वेंट्री, वित्तपोषण, मूल्य निर्धारण और व्यवसाय वृद्धि में आपकी सहायता कर सकता हूं।",
        "why": "मैं आपको व्यक्तिगत सलाह देने के लिए आपके स्थानीय बाज़ार डेटा का विश्लेषण करता हूँ।",
        "localEvidence": "मोढेरा में व्यवसायों की सेवा करना।",
        "financialImpact": "सामान्य व्यवसाय अनुकूलन।",
        "nextStep": { "label": "डैशबोर्ड देखें", "route": "/" }
      },
      "gu": {
        "recommendation": "હું તમને ઇન્વેન્ટરી, ધિરાણ, કિંમતો અને વ્યવસાયના વિકાસમાં મદદ કરી શકું છું.",
        "why": "હું તમને વ્યક્તિગત સલાહ આપવા માટે તમારા સ્થાનિક બજારના ડેટાનું વિશ્લેષણ કરું છું.",
        "localEvidence": "મોઢેરામાં વ્યવસાયોની સેવા કરવી.",
        "financialImpact": "સામાન્ય વ્યવસાય ઑપ્ટિમાઇઝેશન.",
        "nextStep": { "label": "ડેશબોર્ડ જુઓ", "route": "/" }
      }
    }
  }
]
"""

files["utils/emi.ts"] = """
import { AmortizationEntry } from '../models';

export function calculateEMI(principal: number, annualRate: number, years: number) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return emi;
}

export function generateAmortizationSchedule(principal: number, annualRate: number, years: number): AmortizationEntry[] {
  const schedule: AmortizationEntry[] = [];
  const r = annualRate / 12 / 100;
  const n = years * 12;
  const emi = calculateEMI(principal, annualRate, years);
  
  let balance = principal;
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    if (balance < 0) balance = 0;
    schedule.push({
      month: i,
      emi,
      principal: principalPaid,
      interest,
      balance
    });
  }
  return schedule;
}
"""

files["utils/healthScore.ts"] = """
export function calculateHealthScore(margin: number, cashRunwayMonths: number, dti: number, inventoryTurnover: string, revGrowth: number) {
  let marginScore = 0;
  if (margin > 20) marginScore = 100;
  else if (margin >= 15) marginScore = 80;
  else if (margin >= 10) marginScore = 60;
  else if (margin >= 5) marginScore = 40;
  else marginScore = 20;

  let runwayScore = 0;
  if (cashRunwayMonths > 6) runwayScore = 100;
  else if (cashRunwayMonths >= 3) runwayScore = 70;
  else if (cashRunwayMonths >= 1) runwayScore = 40;
  else runwayScore = 10;

  let dtiScore = 0;
  if (dti === 0) dtiScore = 100;
  else if (dti < 20) dtiScore = 80;
  else if (dti < 40) dtiScore = 60;
  else if (dti < 60) dtiScore = 40;
  else dtiScore = 20;

  let turnoverScore = 0;
  if (inventoryTurnover === 'high') turnoverScore = 100;
  else if (inventoryTurnover === 'medium') turnoverScore = 60;
  else turnoverScore = 30;

  let revScore = 0;
  if (revGrowth > 5) revScore = 100;
  else if (revGrowth >= 2) revScore = 80;
  else if (revGrowth >= 0) revScore = 60;
  else revScore = 30;

  const score = (marginScore * 0.25) + (runwayScore * 0.20) + (dtiScore * 0.20) + (turnoverScore * 0.15) + (revScore * 0.20);
  
  let explanation = '';
  if (score >= 80) explanation = 'Excellent financial health.';
  else if (score >= 60) explanation = 'Good health, but room for improvement.';
  else explanation = 'Needs immediate attention.';

  return { score: Math.round(score), explanation };
}
"""

files["utils/financingReadiness.ts"] = """
export function calculateFinancingReadiness(cashFlowStability: number, dti: number, vintageYears: number, margin: number) {
  let cfScore = cashFlowStability; // assume 0-100 provided
  let dtiScore = Math.max(0, 100 - dti);
  let vintageScore = Math.min(100, vintageYears * 10);
  let marginScore = Math.min(100, margin * 4);
  
  const score = (cfScore * 0.3) + (dtiScore * 0.25) + (vintageScore * 0.25) + (marginScore * 0.2);
  return Math.round(score);
}
"""

files["utils/formatCurrency.ts"] = """
export function formatCurrencyINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}
"""

files["services/dataStore.ts"] = """
import fs from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, '../data');

function loadJSON(filename: string) {
  return JSON.parse(fs.readFileSync(path.join(dataPath, filename), 'utf-8'));
}

export const DataStore = {
  business: loadJSON('business.json'),
  financials: loadJSON('financial-records.json'),
  inventory: loadJSON('inventory.json'),
  cashflow: loadJSON('cashflow.json'),
  competitors: loadJSON('competitors.json'),
  hyperlocal: loadJSON('hyperlocal.json'),
  loans: loadJSON('loan-products.json'),
  schemes: loadJSON('schemes.json'),
  insights: loadJSON('insights.json'),
  priorities: loadJSON('priorities.json'),
  advisorResponses: loadJSON('advisor-responses.json'),
  
  saveInventory() {
    fs.writeFileSync(path.join(dataPath, 'inventory.json'), JSON.stringify(this.inventory, null, 2));
  },
  savePriorities() {
    fs.writeFileSync(path.join(dataPath, 'priorities.json'), JSON.stringify(this.priorities, null, 2));
  }
};
"""

files["services/business.service.ts"] = """
import { DataStore } from './dataStore';

export class BusinessService {
  static getBusiness(id: string) {
    if (DataStore.business.id === id) return DataStore.business;
    return null;
  }
  static updateBusiness(id: string, updates: any) {
    Object.assign(DataStore.business, updates);
    return DataStore.business;
  }
}
"""

files["services/dashboard.service.ts"] = """
import { DataStore } from './dataStore';
import { calculateHealthScore } from '../utils/healthScore';

export class DashboardService {
  static getDashboard(businessId: string) {
    const business = DataStore.business;
    const financials = DataStore.financials;
    const recent = financials.slice(-2);
    
    const margin = recent[1]?.profitMargin || 0;
    const health = calculateHealthScore(margin, 4, 15, 'medium', 3);
    
    return {
      business,
      healthScore: health.score,
      healthExplanation: health.explanation,
      recentFinancials: recent,
      insights: DataStore.insights,
      priorities: DataStore.priorities
    };
  }
}
"""

files["services/finance.service.ts"] = """
import { DataStore } from './dataStore';
import { calculateEMI, generateAmortizationSchedule } from '../utils/emi';

export class FinanceService {
  static getFinancialSummary(businessId: string) {
    let totalRev = 0, totalExp = 0, totalProfit = 0;
    DataStore.financials.forEach((f: any) => {
      totalRev += f.revenue.total;
      totalExp += f.expenses.total;
      totalProfit += f.profit;
    });
    return {
      totalRevenue: totalRev,
      totalExpenses: totalExp,
      netProfit: totalProfit,
      averageMargin: totalProfit / totalRev * 100,
      records: DataStore.financials
    };
  }
  static calculateLoanAffordability(params: { principal: number, rate: number, years: number }) {
    const emi = calculateEMI(params.principal, params.rate, params.years);
    const schedule = generateAmortizationSchedule(params.principal, params.rate, params.years);
    const totalAmount = emi * params.years * 12;
    const totalInterest = totalAmount - params.principal;
    
    // simple DTI based on avg profit
    const avgProfit = this.getFinancialSummary('').netProfit / 12;
    const dti = (emi / avgProfit) * 100;
    
    return { emi, totalInterest, totalAmount, schedule, dti, isAffordable: dti < 40 };
  }
}
"""

files["services/cashflow.service.ts"] = """
import { DataStore } from './dataStore';

export class CashFlowService {
  static getCashFlow(businessId: string) {
    const entries = DataStore.cashflow;
    const forecast = []; // simplistic projection
    const alerts = [];
    if (entries.length > 0) {
      const last = entries[entries.length - 1];
      if (last.closingBalance < 10000) {
        alerts.push('Low balance projected. Maintain at least ₹10,000 liquidity.');
      }
    }
    return { entries, forecast, alerts };
  }
}
"""

files["services/inventory.service.ts"] = """
import { DataStore } from './dataStore';
import { v4 as uuidv4 } from 'uuid';

export class InventoryService {
  static getAll(businessId: string) {
    return DataStore.inventory.filter((i: any) => i.businessId === businessId);
  }
  static addItem(businessId: string, item: any) {
    const newItem = { id: uuidv4(), businessId, ...item };
    this.updateStatus(newItem);
    DataStore.inventory.push(newItem);
    DataStore.saveInventory();
    return newItem;
  }
  static updateItem(itemId: string, updates: any) {
    const item = DataStore.inventory.find((i: any) => i.id === itemId);
    if (item) {
      Object.assign(item, updates);
      this.updateStatus(item);
      DataStore.saveInventory();
    }
    return item;
  }
  static deleteItem(itemId: string) {
    DataStore.inventory = DataStore.inventory.filter((i: any) => i.id !== itemId);
    DataStore.saveInventory();
    return true;
  }
  static updateStatus(item: any) {
    if (item.quantity === 0) item.status = 'out_of_stock';
    else if (item.quantity <= item.reorderLevel) item.status = 'low_stock';
    else item.status = 'in_stock';
  }
}
"""

files["services/hyperlocal.service.ts"] = """
import { DataStore } from './dataStore';

export class HyperlocalService {
  static getHyperlocalData(businessId: string) {
    return {
      competitors: DataStore.competitors,
      ...DataStore.hyperlocal
    };
  }
}
"""

files["services/ai.service.ts"] = """
import { DataStore } from './dataStore';

export class AIService {
  static getInsights(businessId: string) {
    return DataStore.insights;
  }
  static getAdvisorResponse(message: string, businessId: string, lang: 'en'|'hi'|'gu' = 'en') {
    const msgLower = message.toLowerCase();
    for (const resp of DataStore.advisorResponses) {
      if (resp.keywords.some((kw: string) => msgLower.includes(kw) && kw !== 'default')) {
        return resp.response[lang] || resp.response['en'];
      }
    }
    const def = DataStore.advisorResponses.find((r: any) => r.keywords.includes('default'));
    return def.response[lang] || def.response['en'];
  }
}
"""

files["services/financing.service.ts"] = """
import { DataStore } from './dataStore';
import { calculateFinancingReadiness } from '../utils/financingReadiness';

export class FinancingService {
  static getFinancingData(businessId: string) {
    const readinessScore = calculateFinancingReadiness(80, 20, 8, 20);
    return { readinessScore, loans: DataStore.loans };
  }
}
"""

files["services/schemes.service.ts"] = """
import { DataStore } from './dataStore';

export class SchemesService {
  static getSchemes(filters?: any) {
    return DataStore.schemes; // add basic filtering if needed
  }
}
"""

files["services/reports.service.ts"] = """
import { DataStore } from './dataStore';
import { FinanceService } from './finance.service';
import { InventoryService } from './inventory.service';
import { HyperlocalService } from './hyperlocal.service';

export class ReportsService {
  static getReport(businessId: string, range?: string) {
    const inv = InventoryService.getAll(businessId);
    return {
      business: DataStore.business,
      financialSummary: FinanceService.getFinancialSummary(businessId),
      inventorySummary: {
        totalItems: inv.length,
        lowStock: inv.filter((i: any) => i.status === 'low_stock').length,
        outOfStock: inv.filter((i: any) => i.status === 'out_of_stock').length
      },
      hyperlocalSummary: HyperlocalService.getHyperlocalData(businessId)
    };
  }
}
"""

files["controllers/business.controller.ts"] = """
import { Request, Response } from 'express';
import { BusinessService } from '../services/business.service';

export const getBusiness = (req: Request, res: Response) => {
  const data = BusinessService.getBusiness(req.params.id);
  res.json({ success: true, data });
};
export const updateBusiness = (req: Request, res: Response) => {
  const data = BusinessService.updateBusiness(req.params.id, req.body);
  res.json({ success: true, data });
};
"""

files["controllers/dashboard.controller.ts"] = """
import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { DataStore } from '../services/dataStore';

export const getDashboard = (req: Request, res: Response) => {
  const data = DashboardService.getDashboard(req.params.businessId);
  res.json({ success: true, data });
};

export const completePriority = (req: Request, res: Response) => {
  const p = DataStore.priorities.find((x: any) => x.id === req.params.id);
  if (p) {
    p.completed = true;
    DataStore.savePriorities();
  }
  res.json({ success: true, data: p });
};
"""

files["controllers/finance.controller.ts"] = """
import { Request, Response } from 'express';
import { FinanceService } from '../services/finance.service';

export const getFinancialSummary = (req: Request, res: Response) => {
  const data = FinanceService.getFinancialSummary(req.params.businessId);
  res.json({ success: true, data });
};

export const calculateLoanAffordability = (req: Request, res: Response) => {
  const { principal, rate, years } = req.body;
  const data = FinanceService.calculateLoanAffordability({ principal, rate, years });
  res.json({ success: true, data });
};
"""

files["controllers/cashflow.controller.ts"] = """
import { Request, Response } from 'express';
import { CashFlowService } from '../services/cashflow.service';

export const getCashFlow = (req: Request, res: Response) => {
  const data = CashFlowService.getCashFlow(req.params.businessId);
  res.json({ success: true, data });
};
"""

files["controllers/inventory.controller.ts"] = """
import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';

export const getInventory = (req: Request, res: Response) => {
  const data = InventoryService.getAll(req.params.businessId);
  res.json({ success: true, data });
};

export const addItem = (req: Request, res: Response) => {
  const data = InventoryService.addItem(req.params.businessId, req.body);
  res.json({ success: true, data });
};

export const updateItem = (req: Request, res: Response) => {
  const data = InventoryService.updateItem(req.params.itemId, req.body);
  res.json({ success: true, data });
};

export const deleteItem = (req: Request, res: Response) => {
  InventoryService.deleteItem(req.params.itemId);
  res.json({ success: true, data: { deleted: true } });
};
"""

files["controllers/hyperlocal.controller.ts"] = """
import { Request, Response } from 'express';
import { HyperlocalService } from '../services/hyperlocal.service';

export const getHyperlocal = (req: Request, res: Response) => {
  const data = HyperlocalService.getHyperlocalData(req.params.businessId);
  res.json({ success: true, data });
};
"""

files["controllers/ai.controller.ts"] = """
import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

export const getInsights = (req: Request, res: Response) => {
  const data = AIService.getInsights(req.params.businessId);
  res.json({ success: true, data });
};

export const getAdvisorResponse = (req: Request, res: Response) => {
  const { message, lang = 'en' } = req.body;
  const data = AIService.getAdvisorResponse(message, req.body.businessId, lang);
  res.json({ success: true, data });
};
"""

files["controllers/financing.controller.ts"] = """
import { Request, Response } from 'express';
import { FinancingService } from '../services/financing.service';

export const getFinancing = (req: Request, res: Response) => {
  const data = FinancingService.getFinancingData(req.params.businessId);
  res.json({ success: true, data });
};

export const applyLoan = (req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'applied', productId: req.params.productId } });
};
"""

files["controllers/schemes.controller.ts"] = """
import { Request, Response } from 'express';
import { SchemesService } from '../services/schemes.service';

export const getSchemes = (req: Request, res: Response) => {
  const data = SchemesService.getSchemes(req.query);
  res.json({ success: true, data });
};
"""

files["controllers/reports.controller.ts"] = """
import { Request, Response } from 'express';
import { ReportsService } from '../services/reports.service';

export const getReport = (req: Request, res: Response) => {
  const data = ReportsService.getReport(req.params.businessId, req.query.range as string);
  res.json({ success: true, data });
};
"""

files["routes/business.routes.ts"] = """
import { Router } from 'express';
import * as ctrl from '../controllers/business.controller';
const router = Router();
router.get('/:id', ctrl.getBusiness);
router.put('/:id', ctrl.updateBusiness);
export default router;
"""

files["routes/dashboard.routes.ts"] = """
import { Router } from 'express';
import * as ctrl from '../controllers/dashboard.controller';
const router = Router();
router.get('/:businessId', ctrl.getDashboard);
router.patch('/priorities/:id/complete', ctrl.completePriority);
export default router;
"""

files["routes/finance.routes.ts"] = """
import { Router } from 'express';
import * as ctrl from '../controllers/finance.controller';
const router = Router();
router.get('/:businessId', ctrl.getFinancialSummary);
router.post('/loan-affordability', ctrl.calculateLoanAffordability);
export default router;
"""

files["routes/cashflow.routes.ts"] = """
import { Router } from 'express';
import * as ctrl from '../controllers/cashflow.controller';
const router = Router();
router.get('/:businessId', ctrl.getCashFlow);
export default router;
"""

files["routes/inventory.routes.ts"] = """
import { Router } from 'express';
import * as ctrl from '../controllers/inventory.controller';
const router = Router();
router.get('/:businessId', ctrl.getInventory);
router.post('/:businessId', ctrl.addItem);
router.put('/item/:itemId', ctrl.updateItem);
router.delete('/item/:itemId', ctrl.deleteItem);
export default router;
"""

files["routes/hyperlocal.routes.ts"] = """
import { Router } from 'express';
import * as ctrl from '../controllers/hyperlocal.controller';
const router = Router();
router.get('/:businessId', ctrl.getHyperlocal);
export default router;
"""

files["routes/ai.routes.ts"] = """
import { Router } from 'express';
import * as ctrl from '../controllers/ai.controller';
const router = Router();
router.get('/insights/:businessId', ctrl.getInsights);
router.post('/advisor', ctrl.getAdvisorResponse);
export default router;
"""

files["routes/financing.routes.ts"] = """
import { Router } from 'express';
import * as ctrl from '../controllers/financing.controller';
const router = Router();
router.get('/:businessId', ctrl.getFinancing);
router.post('/apply/:productId', ctrl.applyLoan);
export default router;
"""

files["routes/schemes.routes.ts"] = """
import { Router } from 'express';
import * as ctrl from '../controllers/schemes.controller';
const router = Router();
router.get('/', ctrl.getSchemes);
export default router;
"""

files["routes/reports.routes.ts"] = """
import { Router } from 'express';
import * as ctrl from '../controllers/reports.controller';
const router = Router();
router.get('/:businessId', ctrl.getReport);
export default router;
"""

files["routes/index.ts"] = """
import { Router } from 'express';
import businessRoutes from './business.routes';
import dashboardRoutes from './dashboard.routes';
import financeRoutes from './finance.routes';
import cashflowRoutes from './cashflow.routes';
import inventoryRoutes from './inventory.routes';
import hyperlocalRoutes from './hyperlocal.routes';
import aiRoutes from './ai.routes';
import financingRoutes from './financing.routes';
import schemesRoutes from './schemes.routes';
import reportsRoutes from './reports.routes';

const router = Router();

router.use('/business', businessRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/finance', financeRoutes);
router.use('/cashflow', cashflowRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/hyperlocal', hyperlocalRoutes);
router.use('/ai', aiRoutes);
router.use('/financing', financingRoutes);
router.use('/schemes', schemesRoutes);
router.use('/reports', reportsRoutes);

export default router;
"""

files["middleware/errorHandler.ts"] = """
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
"""

files["middleware/cors.ts"] = """
import cors from 'cors';

export const corsMiddleware = cors({
  origin: '*', // Allow all for local dev
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
"""

files["middleware/validateRequest.ts"] = """
import { Request, Response, NextFunction } from 'express';

export const validateBody = (keys: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const key of keys) {
      if (req.body[key] === undefined) {
        return res.status(400).json({ success: false, message: `Missing required field: ${key}` });
      }
    }
    next();
  };
};
"""

files["app.ts"] = """
import express from 'express';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
"""

files["server.ts"] = """
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Samvaya Backend Server started on port ${PORT}`);
});
"""

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\\n")

print("All files generated successfully.")
