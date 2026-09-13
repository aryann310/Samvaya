import { DataStore } from './dataStore.js';
import { isMongoMode } from '../db/config.js';
import { BusinessRepository } from '../db/repositories/index.js';

export class BusinessService {
  static async getBusiness(id: string): Promise<any> {
    if (isMongoMode()) {
      const doc = await BusinessRepository.findByLegacyId(id)
        ?? await BusinessRepository.findByLegacyId('biz-001'); // demo fallback
      if (!doc) return null;
      // Normalize to existing API shape for backward compat
      return {
        id: doc.legacyId || id,
        name: doc.name,
        type: doc.type,
        category: doc.category,
        location: doc.location,
        owner: doc.owner,
        yearsActive: doc.yearsActive,
        registrationType: doc.registrationType,
        gstRegistered: doc.gstRegistered,
        gstNumber: doc.gstNumber,
        monthlyRevenue: doc.monthlyRevenue,
        monthlyExpenses: doc.monthlyExpenses,
        cashBalance: doc.cashBalance,
        receivables: doc.receivables,
        payables: doc.payables,
        debt: doc.debt,
        employees: doc.employees,
        description: doc.description,
        documents: doc.documents,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      };
    }
    // Demo mode — JSON DataStore
    if (DataStore.business.id === id || id === 'biz-001' || id === 'b1') return DataStore.business;
    return DataStore.business;
  }

  // Sync wrapper for callers that haven't been made async yet
  static getBusinessSync(id: string): any {
    if (DataStore.business.id === id || id === 'biz-001' || id === 'b1') return DataStore.business;
    return DataStore.business;
  }

  static async updateBusiness(id: string, updates: any): Promise<any> {
    if (isMongoMode()) {
      const doc = await BusinessRepository.update(id, {
        ...updates,
        updatedAt: new Date()
      });
      return doc;
    }
    Object.assign(DataStore.business, updates);
    DataStore.saveBusiness();
    return DataStore.business;
  }
}
