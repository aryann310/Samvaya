import type { Request, Response } from 'express';
import { BusinessService } from '../services/business.service.js';

export const getBusiness = async (req: Request, res: Response) => {
  try {
    const data = await BusinessService.getBusiness(req.params.id as string);
    if (!data) return res.status(404).json({ success: false, error: 'Business not found' });
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateBusiness = async (req: Request, res: Response) => {
  try {
    const data = await BusinessService.updateBusiness(req.params.id as string, req.body);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
