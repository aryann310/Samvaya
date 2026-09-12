import type { Request, Response } from 'express';
import { HyperlocalService } from '../services/hyperlocal.service.js';

export const getHyperlocal = (req: Request, res: Response) => {
  const data = HyperlocalService.getHyperlocalData(req.params.businessId as string);
  res.json({ success: true, data });
};
