import { ObjectId } from 'mongodb';
import { getDatabase } from '../connection.js';

const COL = 'government_schemes';

export interface SchemeDoc {
  _id?: ObjectId;
  legacyId?: string;
  schemeName: string;
  ministry: string;
  description: string;
  benefits: string[];
  eligibilityCriteria: { criterion: string; met: boolean }[];
  applicationSteps: string[];
  officialLink: string;
  category: string;
  maxBenefit: number;
  status: 'active' | 'archived';
  lastVerified: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const SchemeRepository = {
  async findAll(): Promise<SchemeDoc[]> {
    const db = getDatabase();
    return db.collection<SchemeDoc>(COL)
      .find({ status: 'active' })
      .sort({ maxBenefit: -1 })
      .toArray();
  },

  async findById(id: string): Promise<SchemeDoc | null> {
    const db = getDatabase();
    if (ObjectId.isValid(id) && id.length === 24) {
      return db.collection<SchemeDoc>(COL).findOne({ _id: new ObjectId(id) });
    }
    return db.collection<SchemeDoc>(COL).findOne({ legacyId: id });
  },

  async upsertByLegacyId(legacyId: string, data: Omit<SchemeDoc, '_id'>): Promise<void> {
    const db = getDatabase();
    await db.collection<SchemeDoc>(COL).updateOne(
      { legacyId },
      { $set: data },
      { upsert: true }
    );
  }
};
