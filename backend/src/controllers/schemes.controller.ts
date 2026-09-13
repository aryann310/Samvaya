import type { Request, Response } from 'express';
import { SchemesService } from '../services/schemes.service.js';

export const getSchemes = async (req: Request, res: Response) => {
  try {
    const data = await SchemesService.getAll();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
