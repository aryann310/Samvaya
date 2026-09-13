import { DataStore } from './dataStore.js';
import { isMongoMode } from '../db/config.js';
import { SchemeRepository } from '../db/repositories/index.js';

export class SchemesService {
  static async getAll(): Promise<any[]> {
    if (isMongoMode()) {
      const docs = await SchemeRepository.findAll();
      return docs.map(d => ({
        id: d.legacyId || d._id?.toString(),
        name: d.schemeName,
        ministry: d.ministry,
        description: d.description,
        benefits: d.benefits,
        eligibilityCriteria: d.eligibilityCriteria,
        applicationSteps: d.applicationSteps,
        officialLink: d.officialLink,
        category: d.category,
        maxBenefit: d.maxBenefit
      }));
    }
    return DataStore.schemes || [];
  }
}
