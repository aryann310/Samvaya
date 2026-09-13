import { ObjectId } from 'mongodb';
import { getDatabase } from '../connection.js';

const COL = 'cashflow_entries';

export interface CashflowEntryDoc {
  _id?: ObjectId;
  businessId: string;
  month: string; // "YYYY-MM"
  inflows: { total: number; breakdown: { source: string; amount: number }[] };
  outflows: { total: number; breakdown: { category: string; amount: number }[] };
  netFlow: number;
  closingBalance: number;
  currency: string;
  createdAt: Date;
}

export const CashflowRepository = {
  async findByBusinessId(businessId: string, limitMonths = 6): Promise<CashflowEntryDoc[]> {
    const db = getDatabase();
    return db.collection<CashflowEntryDoc>(COL)
      .find({ businessId })
      .sort({ month: -1 })
      .limit(limitMonths)
      .toArray()
      .then(recs => recs.reverse()); // chronological
  },

  async getLatestEntry(businessId: string): Promise<CashflowEntryDoc | null> {
    const db = getDatabase();
    return db.collection<CashflowEntryDoc>(COL)
      .findOne({ businessId }, { sort: { month: -1 } });
  },

  async upsertByMonth(businessId: string, month: string, data: Omit<CashflowEntryDoc, '_id'>): Promise<void> {
    const db = getDatabase();
    await db.collection<CashflowEntryDoc>(COL).updateOne(
      { businessId, month },
      { $set: data },
      { upsert: true }
    );
  }
};
