import type { Request, Response } from 'express';
import { ReportsService } from '../services/reports.service.js';

export const getReport = async (req: Request, res: Response) => {
  try {
    const data = await ReportsService.getReport(
      (req.params.businessId as string) || 'biz-001',
      req.query.range as string
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
