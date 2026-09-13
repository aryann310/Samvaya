import type { Request, Response } from 'express';
import { CashflowService } from '../services/cashflow.service.js';

export const getCashFlow = async (req: Request, res: Response) => {
  try {
    const data = await CashflowService.getCashflowSummary(req.params.businessId as string);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
