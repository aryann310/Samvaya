import type { Request, Response } from 'express';
import { BusinessService } from '../services/business.service.js';

export const getBusiness = (req: Request, res: Response) => {
  const data = BusinessService.getBusiness(req.params.id as string);
  if (!data) return res.status(404).json({ success: false, error: 'Business not found' });
  res.json({ success: true, data });
};

export const updateBusiness = (req: Request, res: Response) => {
  const data = BusinessService.updateBusiness(req.params.id as string, req.body);
  res.json({ success: true, data });
};
