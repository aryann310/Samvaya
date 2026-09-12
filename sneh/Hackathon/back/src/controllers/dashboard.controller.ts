import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { DataStore } from '../services/dataStore';

export const getDashboard = (req: Request, res: Response) => {
  const data = DashboardService.getDashboard(req.params.businessId);
  res.json({ success: true, data });
};

export const completePriority = (req: Request, res: Response) => {
  const p = DataStore.priorities.find((x: any) => x.id === req.params.id);
  if (p) {
    p.completed = true;
    DataStore.savePriorities();
  }
  res.json({ success: true, data: p });
};
