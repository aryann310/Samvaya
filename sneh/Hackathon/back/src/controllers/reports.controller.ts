import { Request, Response } from 'express';
import { ReportsService } from '../services/reports.service';

export const getReport = (req: Request, res: Response) => {
  const data = ReportsService.getReport(req.params.businessId, req.query.range as string);
  res.json({ success: true, data });
};
