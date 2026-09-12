import type { Request, Response } from 'express';
import { ReportsService } from '../services/reports.service.js';

export const getReport = (req: Request, res: Response) => {
  const data = ReportsService.getReport(req.params.businessId as string, req.query.range as string);
  res.json({ success: true, data });
};
