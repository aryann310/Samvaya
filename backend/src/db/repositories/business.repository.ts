import { ObjectId } from 'mongodb';
import { getDatabase } from '../connection.js';

const COL = 'businesses';

export interface BusinessDoc {
  _id?: ObjectId;
  legacyId?: string;         // "biz-001" — for backward compatibility
  ownerId?: string;
  name: string;
  type: string;
  category: string;
  location: {
    village?: string;
    taluka?: string;
    district: string;
    state: string;
    pincode: string;
    country: string;
    lat?: number;
    lng?: number;
  };
  owner: {
    name: string;
    phone: string;
    email: string;
    aadhaar?: string;
    panCard?: string;
  };
  yearsActive: number;
  registrationType: string;
  gstRegistered: boolean;
  gstNumber?: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  cashBalance: number;
  receivables: { total: number; overdue: number; aging?: Record<string, number> };
  payables: { total: number; overdue: number; upcoming: number };
  debt: { totalOutstanding: number; monthlyEmi: number };
  employees: number;
  description: string;
  documents: string[];
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export const BusinessRepository = {
  async findById(id: string): Promise<BusinessDoc | null> {
    const db = getDatabase();
    // Support both ObjectId and legacy string ID
    if (ObjectId.isValid(id) && id.length === 24) {
      return db.collection<BusinessDoc>(COL).findOne({ _id: new ObjectId(id) });
    }
    return db.collection<BusinessDoc>(COL).findOne({ legacyId: id });
  },

  async findByLegacyId(legacyId: string): Promise<BusinessDoc | null> {
    const db = getDatabase();
    return db.collection<BusinessDoc>(COL).findOne({ legacyId });
  },

  async create(data: Omit<BusinessDoc, '_id'>): Promise<BusinessDoc> {
    const db = getDatabase();
    const result = await db.collection<BusinessDoc>(COL).insertOne(data as BusinessDoc);
    return { ...data, _id: result.insertedId };
  },

  async update(id: string, updates: Partial<BusinessDoc>): Promise<BusinessDoc | null> {
    const db = getDatabase();
    const filter = ObjectId.isValid(id) && id.length === 24
      ? { _id: new ObjectId(id) }
      : { legacyId: id };
    const result = await db.collection<BusinessDoc>(COL).findOneAndUpdate(
      filter,
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result ?? null;
  },

  async upsertByLegacyId(legacyId: string, data: Omit<BusinessDoc, '_id'>): Promise<void> {
    const db = getDatabase();
    await db.collection<BusinessDoc>(COL).updateOne(
      { legacyId },
      { $set: data },
      { upsert: true }
    );
  }
};
