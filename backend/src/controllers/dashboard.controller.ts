import type { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { DataStore } from '../services/dataStore.js';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const data = await DashboardService.getDashboard(req.params.businessId as string);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const completePriority = (req: Request, res: Response) => {
  const p = DataStore.priorities.find((x: any) => x.id === req.params.id);
  if (p) {
    p.completed = true;
    DataStore.savePriorities();
  }
  res.json({ success: true, data: p });
};
