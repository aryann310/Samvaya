import { DataStore } from './dataStore.js';

export class SchemesService {
  static getSchemes(filters?: any) {
    const raw = DataStore.schemes || [];
    return raw.map((s: any) => {
      const criteria = s.eligibilityCriteria || [];
      const metCount = criteria.filter((c: any) => c.met).length;
      const pct = criteria.length > 0 ? Math.round((metCount / criteria.length) * 100) : 85;
      return {
        ...s,
        eligibilityMatch: pct,
        matchPercentage: pct
      };
    });
  }
}
