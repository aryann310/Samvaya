import { Request, Response } from 'express';
import { CashFlowService } from '../services/cashflow.service';

export const getCashFlow = (req: Request, res: Response) => {
  const data = CashFlowService.getCashFlow(req.params.businessId);
  res.json({ success: true, data });
};
