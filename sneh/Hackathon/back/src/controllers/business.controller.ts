import { Request, Response } from 'express';
import { BusinessService } from '../services/business.service';

export const getBusiness = (req: Request, res: Response) => {
  const data = BusinessService.getBusiness(req.params.id);
  res.json({ success: true, data });
};
export const updateBusiness = (req: Request, res: Response) => {
  const data = BusinessService.updateBusiness(req.params.id, req.body);
  res.json({ success: true, data });
};
