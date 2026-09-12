import { Request, Response, NextFunction } from 'express';

export const validateBody = (keys: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const key of keys) {
      if (req.body[key] === undefined) {
        return res.status(400).json({ success: false, message: `Missing required field: ${key}` });
      }
    }
    next();
  };
};
