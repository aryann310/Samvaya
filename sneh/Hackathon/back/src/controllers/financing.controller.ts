import { Request, Response } from 'express';
import { FinancingService } from '../services/financing.service';

export const getFinancing = (req: Request, res: Response) => {
  const data = FinancingService.getFinancingData(req.params.businessId);
  res.json({ success: true, data });
};

export const applyLoan = (req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'applied', productId: req.params.productId } });
};
