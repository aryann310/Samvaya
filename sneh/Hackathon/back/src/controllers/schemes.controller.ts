import { Request, Response } from 'express';
import { SchemesService } from '../services/schemes.service';

export const getSchemes = (req: Request, res: Response) => {
  const data = SchemesService.getSchemes(req.query);
  res.json({ success: true, data });
};
