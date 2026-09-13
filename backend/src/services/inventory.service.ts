import { DataStore } from './dataStore.js';
import { isMongoMode } from '../db/config.js';
import { InventoryRepository } from '../db/repositories/index.js';
import { v4 as uuidv4 } from 'uuid';

function computeStatus(quantity: number, reorderLevel: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (quantity === 0) return 'out_of_stock';
  if (quantity <= reorderLevel) return 'low_stock';
  return 'in_stock';
}

export class InventoryService {
  static async getAll(businessId: string): Promise<any[]> {
    if (isMongoMode()) {
      const docs = await InventoryRepository.findByBusinessId(businessId || 'biz-001');
      return docs.map(d => ({
        id: d.legacyId || d._id?.toString(),
        businessId: d.businessId,
        name: d.name,
        category: d.category,
        quantity: d.quantity,
        unit: d.unit,
        reorderLevel: d.reorderLevel,
        unitCost: d.unitCost,
        salePrice: d.salePrice,
        status: d.status,
        lastRestocked: d.lastRestocked
      }));
    }
    return DataStore.inventory.filter((i: any) => i.businessId === businessId);
  }

  static async addItem(businessId: string, item: any): Promise<any> {
    if (isMongoMode()) {
      const legacyId = uuidv4();
      const status = computeStatus(item.quantity || 0, item.reorderLevel || 0);
      const doc = await InventoryRepository.create({
        legacyId,
        businessId: businessId || 'biz-001',
        sku: legacyId,
        name: item.name,
        category: item.category,
        quantity: item.quantity || 0,
        unit: item.unit,
        reorderLevel: item.reorderLevel || 0,
        unitCost: item.unitCost || 0,
        salePrice: item.salePrice || 0,
        status,
        lastRestocked: item.lastRestocked,
        currency: 'INR',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: legacyId, businessId, ...item, status };
    }
    const newItem = { id: uuidv4(), businessId, ...item };
    this.updateStatusSync(newItem);
    DataStore.inventory.push(newItem);
    DataStore.saveInventory();
    return newItem;
  }

  static async updateItem(itemId: string, updates: any): Promise<any> {
    if (isMongoMode()) {
      const existing = await InventoryRepository.findById(itemId);
      if (!existing) return null;
      const quantity = updates.quantity !== undefined ? updates.quantity : existing.quantity;
      const reorderLevel = updates.reorderLevel !== undefined ? updates.reorderLevel : existing.reorderLevel;
      const status = computeStatus(quantity, reorderLevel);
      const doc = await InventoryRepository.update(itemId, { ...updates, status });
      if (!doc) return null;
      return {
        id: doc.legacyId || doc._id?.toString(),
        businessId: doc.businessId,
        name: doc.name,
        category: doc.category,
        quantity: doc.quantity,
        unit: doc.unit,
        reorderLevel: doc.reorderLevel,
        unitCost: doc.unitCost,
        salePrice: doc.salePrice,
        status: doc.status,
        lastRestocked: doc.lastRestocked
      };
    }
    const item = DataStore.inventory.find((i: any) => i.id === itemId);
    if (item) {
      Object.assign(item, updates);
      this.updateStatusSync(item);
      DataStore.saveInventory();
    }
    return item;
  }

  static async deleteItem(itemId: string): Promise<boolean> {
    if (isMongoMode()) {
      return InventoryRepository.softDelete(itemId);
    }
    DataStore.inventory = DataStore.inventory.filter((i: any) => i.id !== itemId);
    DataStore.saveInventory();
    return true;
  }

  private static updateStatusSync(item: any) {
    if (item.quantity === 0) item.status = 'out_of_stock';
    else if (item.quantity <= item.reorderLevel) item.status = 'low_stock';
    else item.status = 'in_stock';
  }
}
