import type { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';
import { AdvisorService } from '../ai/services/advisor.service.js';

export const getInsights = (req: Request, res: Response) => {
  const data = AIService.getInsights(req.params.businessId as string);
  res.json({ success: true, data });
};

export const getAdvisorResponse = async (req: Request, res: Response) => {
  const { message, lang = 'en' } = req.body;
  const data = await AdvisorService.getAdvisory(message, req.body.businessId || 'biz-001', lang);
  res.json({ success: true, data });
};
