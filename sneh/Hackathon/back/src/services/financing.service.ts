import { DataStore } from './dataStore';
import { calculateFinancingReadiness } from '../utils/financingReadiness';

export class FinancingService {
  static getFinancingData(businessId: string) {
    const readinessScore = calculateFinancingReadiness(80, 20, 8, 20);
    
    const readinessFactors = [
      { name: "Cash Flow Stability", score: 26, maxScore: 30 },
      { name: "Existing Debt Level", score: 22, maxScore: 25 },
      { name: "Business Vintage (8 yrs)", score: 25, maxScore: 25 },
      { name: "Profit Margin Track", score: 16, maxScore: 20 }
    ];

    const loanProducts = (DataStore.loans || []).map((l: any, idx: number) => ({
      id: l.id || `loan-${idx + 1}`,
      bankName: l.bankName || "State Bank of India",
      productName: l.productName || "PM Mudra Scheme",
      type: l.type || "Micro Credit",
      interestRate: l.interestRate || 10.5,
      minAmount: l.minAmount || 20000,
      maxAmount: l.maxAmount || 500000,
      tenure: l.tenure || { min: 12, max: 60 },
      processingFee: l.processingFee || 0,
      eligibilityCriteria: l.eligibilityCriteria || ["Indian citizen", "Vintage > 1 yr"],
      features: l.features || ["Subsidized rates", "Nil collateral"],
      eligible: true,
      matchScore: 92 - (idx * 6)
    }));

    return { 
      readinessScore, 
      readinessFactors,
      loanProducts 
    };
  }
}
