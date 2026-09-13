import type { Request, Response } from 'express';
import { FinanceService } from '../services/finance.service.js';

export const getFinancialSummary = async (req: Request, res: Response) => {
  try {
    const data = await FinanceService.getFinancialSummary(req.params.businessId as string);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const calculateLoanAffordability = (req: Request, res: Response) => {
  const principal = Number(req.body.principal || req.body.loanAmount || 100000);
  const rate = Number(req.body.rate || req.body.interestRate || 10.5);
  const years = Number(req.body.years || (req.body.tenureMonths ? req.body.tenureMonths / 12 : 3));
  const data = FinanceService.calculateLoanAffordability({ principal, rate, years });
  const responseData = {
    ...data,
    totalPayment: data.totalAmount,
    affordable: data.isAffordable,
    dtiRatio: data.dti,
    amortizationSchedule: data.schedule,
  };
  res.json({ success: true, data: responseData });
};
