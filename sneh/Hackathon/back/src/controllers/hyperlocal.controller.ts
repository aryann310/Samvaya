import { Request, Response } from 'express';
import { HyperlocalService } from '../services/hyperlocal.service';

export const getHyperlocal = (req: Request, res: Response) => {
  const data = HyperlocalService.getHyperlocalData(req.params.businessId);
  res.json({ success: true, data });
};
