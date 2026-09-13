import { DataStore } from './dataStore.js';
import { isMongoMode } from '../db/config.js';
import { CashflowRepository } from '../db/repositories/index.js';

export class CashflowService {
  static async getCashflow(businessId: string): Promise<any[]> {
    if (isMongoMode()) {
      return CashflowRepository.findByBusinessId(businessId || 'biz-001', 6);
    }
    return DataStore.cashflow || [];
  }

  static async getCashflowSummary(businessId: string): Promise<any> {
    const entries = await this.getCashflow(businessId);
    if (!entries.length) return { entries: [], forecast: [], alerts: [] };

    const latest = entries[entries.length - 1];
    const avgInflow = entries.reduce((s: number, e: any) => s + (e.inflows?.total || 0), 0) / entries.length;
    const avgOutflow = entries.reduce((s: number, e: any) => s + (e.outflows?.total || 0), 0) / entries.length;
    const avgNet = avgInflow - avgOutflow;

    // Simple 3-month forecast
    const forecast = [1, 2, 3].map(offset => {
      const d = new Date(latest.month + '-01');
      d.setMonth(d.getMonth() + offset);
      const forecastMonth = d.toISOString().slice(0, 7);
      return {
        month: forecastMonth,
        inflow: Math.round(avgInflow),
        outflow: Math.round(avgOutflow),
        netFlow: Math.round(avgNet),
        closingBalance: Math.round(latest.closingBalance + avgNet * offset),
        isForecast: true
      };
    });

    const alerts: string[] = [];
    if (latest.closingBalance < avgOutflow * 0.5) {
      alerts.push('Cash balance is below 50% of average monthly outflow. Consider collecting outstanding receivables.');
    }

    return {
      entries: entries.map((e: any) => ({
        month: e.month,
        inflow: e.inflows?.total || 0,
        outflow: e.outflows?.total || 0,
        netFlow: e.netFlow,
        closingBalance: e.closingBalance
      })),
      forecast,
      alerts
    };
  }
}
