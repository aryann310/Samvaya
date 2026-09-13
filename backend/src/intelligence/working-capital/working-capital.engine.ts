import type { WorkingCapitalIntelligence } from '../types/intelligence.types.js';
import { EvidenceEngine } from '../evidence/evidence.engine.js';

export class WorkingCapitalEngine {
  static calculate(
    businessData: any,
    inventoryData: any[],
    latestCash: number,
    evidence: EvidenceEngine
  ): WorkingCapitalIntelligence {
    if (!businessData) {
      evidence.addEvidence('workingCapital', null, 'status', 'working-capital.engine', 'INSUFFICIENT_DATA');
      return {
        workingCapital: 0,
        currentAssets: 0,
        currentLiabilities: 0,
        status: 'UNKNOWN',
        receivables: { total: 0, overdue: 0, overduePercentage: 0, risk: 'LOW' },
        payables: { total: 0, overdue: 0, upcoming: 0, risk: 'LOW' }
      };
    }

    const recData = businessData.receivables || { total: 0, overdue: 0 };
    const payData = businessData.payables || { total: 0, overdue: 0, upcoming: 0 };

    let inventoryValue = 0;
    if (inventoryData) {
      inventoryData.forEach((item: any) => {
        inventoryValue += (item.quantity || item.stock || 0) * (item.unitCost || 0);
      });
    }

    const currentAssets = latestCash + recData.total + inventoryValue;
    const currentLiabilities = payData.total;
    const workingCapital = currentAssets - currentLiabilities;

    let wcStatus: 'HEALTHY' | 'TIGHT' | 'CRITICAL' | 'UNKNOWN' = 'UNKNOWN';
    if (currentLiabilities === 0) {
      wcStatus = 'HEALTHY';
    } else {
      const ratio = currentAssets / currentLiabilities;
      if (ratio > 1.5) wcStatus = 'HEALTHY';
      else if (ratio > 1.0) wcStatus = 'TIGHT';
      else wcStatus = 'CRITICAL';
    }

    // Receivables logic
    const recOverduePercent = recData.total > 0 ? (recData.overdue / recData.total) * 100 : 0;
    let recRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (recOverduePercent > 30) recRisk = 'HIGH';
    else if (recOverduePercent > 15) recRisk = 'MEDIUM';

    // Payables logic
    let payRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (payData.overdue > 0) {
      if (payData.overdue > latestCash) payRisk = 'HIGH';
      else payRisk = 'MEDIUM';
    }

    evidence.addEvidence('workingCapital', workingCapital, 'INR', 'working-capital.engine', 'CALCULATED');
    
    return {
      workingCapital,
      currentAssets,
      currentLiabilities,
      status: wcStatus,
      receivables: {
        total: recData.total,
        overdue: recData.overdue,
        overduePercentage: parseFloat(recOverduePercent.toFixed(2)),
        risk: recRisk
      },
      payables: {
        total: payData.total,
        overdue: payData.overdue,
        upcoming: payData.upcoming,
        risk: payRisk
      }
    };
  }
}
