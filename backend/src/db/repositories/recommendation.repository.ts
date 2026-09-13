import { ObjectId } from 'mongodb';
import { getDatabase } from '../connection.js';

const COL = 'recommendations';

export type RecommendationStatus = 'ACTIVE' | 'COMPLETED' | 'DISMISSED' | 'EXPIRED';

export interface SourceMetric {
  source: string;
  metric: string;
  value: number | string;
  unit: string;
}

export interface RecommendationDoc {
  _id?: ObjectId;
  businessId: string;
  conversationId?: string;
  intent: string;
  recommendation: string;
  why: string;
  localEvidence?: string;
  financialImpact?: string;
  risk?: string;
  nextStep?: { label: string; route: string };
  priority: string;
  sourceMetrics: SourceMetric[];
  status: RecommendationStatus;
  createdAt: Date;
  expiresAt?: Date;
}

export const RecommendationRepository = {
  async create(data: Omit<RecommendationDoc, '_id'>): Promise<RecommendationDoc> {
    const db = getDatabase();
    const result = await db.collection<RecommendationDoc>(COL).insertOne(data as RecommendationDoc);
    return { ...data, _id: result.insertedId };
  },

  async findByBusinessId(businessId: string, limit = 20): Promise<RecommendationDoc[]> {
    const db = getDatabase();
    return db.collection<RecommendationDoc>(COL)
      .find({ businessId, status: 'ACTIVE' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  },

  async findRecent(businessId: string, limit = 5): Promise<RecommendationDoc[]> {
    const db = getDatabase();
    return db.collection<RecommendationDoc>(COL)
      .find({ businessId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  },

  async updateStatus(id: string, status: RecommendationStatus): Promise<void> {
    const db = getDatabase();
    if (!ObjectId.isValid(id)) return;
    await db.collection<RecommendationDoc>(COL).updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
  }
};
