import type { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service.js';

export const getInventory = (req: Request, res: Response) => {
  const data = InventoryService.getAll(req.params.businessId as string);
  res.json({ success: true, data });
};

export const addItem = (req: Request, res: Response) => {
  const data = InventoryService.addItem(req.params.businessId as string, req.body);
  res.json({ success: true, data });
};

export const updateItem = (req: Request, res: Response) => {
  const data = InventoryService.updateItem(req.params.itemId as string, req.body);
  res.json({ success: true, data });
};

export const deleteItem = (req: Request, res: Response) => {
  InventoryService.deleteItem(req.params.itemId as string);
  res.json({ success: true, data: { deleted: true } });
};
