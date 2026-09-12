import type { Request, Response } from 'express';
import { CashFlowService } from '../services/cashflow.service.js';

export const getCashFlow = (req: Request, res: Response) => {
  const data = CashFlowService.getCashFlow(req.params.businessId as string);
  res.json({ success: true, data });
};
