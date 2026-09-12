import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

export const getInsights = (req: Request, res: Response) => {
  const data = AIService.getInsights(req.params.businessId);
  res.json({ success: true, data });
};

export const getAdvisorResponse = (req: Request, res: Response) => {
  const { message, lang = 'en' } = req.body;
  const data = AIService.getAdvisorResponse(message, req.body.businessId, lang);
  res.json({ success: true, data });
};
