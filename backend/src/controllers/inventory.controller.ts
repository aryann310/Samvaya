import type { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service.js';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const data = await InventoryService.getAll(req.params.businessId as string);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    const data = await InventoryService.addItem(req.params.businessId as string, req.body);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const data = await InventoryService.updateItem(req.params.itemId as string, req.body);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    await InventoryService.deleteItem(req.params.itemId as string);
    res.json({ success: true, data: { deleted: true } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
