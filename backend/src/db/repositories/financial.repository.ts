import { ObjectId } from 'mongodb';
import { getDatabase } from '../connection.js';

const COL = 'financial_records';

export interface FinancialRecordDoc {
  _id?: ObjectId;
  businessId: string;
  month: string; // "YYYY-MM"
  revenue: { total: number; breakdown: { category: string; amount: number }[] };
  expenses: { total: number; breakdown: { category: string; amount: number }[] };
  profit: number;
  profitMargin: number;
  currency: string;
  createdAt: Date;
}

export const FinancialRepository = {
  async findByBusinessId(businessId: string, limitMonths = 12): Promise<FinancialRecordDoc[]> {
    const db = getDatabase();
    return db.collection<FinancialRecordDoc>(COL)
      .find({ businessId })
      .sort({ month: -1 })
      .limit(limitMonths)
      .toArray()
      .then(recs => recs.reverse()); // return chronological order
  },

  async getLatestRecord(businessId: string): Promise<FinancialRecordDoc | null> {
    const db = getDatabase();
    return db.collection<FinancialRecordDoc>(COL)
      .findOne({ businessId }, { sort: { month: -1 } });
  },

  async insertRecord(data: Omit<FinancialRecordDoc, '_id'>): Promise<FinancialRecordDoc> {
    const db = getDatabase();
    const result = await db.collection<FinancialRecordDoc>(COL).insertOne(data as FinancialRecordDoc);
    return { ...data, _id: result.insertedId };
  },

  async upsertByMonth(businessId: string, month: string, data: Omit<FinancialRecordDoc, '_id'>): Promise<void> {
    const db = getDatabase();
    await db.collection<FinancialRecordDoc>(COL).updateOne(
      { businessId, month },
      { $set: data },
      { upsert: true }
    );
  }
};
