import type { Request, Response } from 'express';
import { IntelligenceEngine } from '../intelligence/index.js';

export const getIntelligenceSummary = async (req: Request, res: Response) => {
  try {
    const businessId = (req.query.businessId as string) || 'biz-001';
    const snapshot = await IntelligenceEngine.getBusinessIntelligenceSnapshotForBusiness(businessId);
    res.json(snapshot);
  } catch (error) {
    console.error('[Intelligence Controller] Error getting summary:', error);
    res.status(500).json({ error: 'Failed to generate intelligence snapshot' });
  }
};
