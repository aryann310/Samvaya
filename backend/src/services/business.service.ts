import { DataStore } from './dataStore.js';

export class BusinessService {
  static getBusiness(id: string) {
    if (DataStore.business.id === id || id === 'biz-001' || id === 'b1') return DataStore.business;
    return DataStore.business; // Fallback to demo business
  }
  static updateBusiness(id: string, updates: any) {
    if (updates.owner) {
      DataStore.business.owner = {
        ...DataStore.business.owner,
        ...updates.owner,
        ...(updates.owner.bankAccount && {
          bankAccount: {
            ...(DataStore.business.owner.bankAccount || {}),
            ...updates.owner.bankAccount,
          },
        }),
      };
      delete updates.owner;
    }
    Object.assign(DataStore.business, updates);
    DataStore.saveBusiness();
    return DataStore.business;
  }
}
