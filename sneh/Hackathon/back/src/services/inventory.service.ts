import { DataStore } from './dataStore';
import { v4 as uuidv4 } from 'uuid';

export class InventoryService {
  static getAll(businessId: string) {
    return DataStore.inventory.filter((i: any) => i.businessId === businessId);
  }
  static addItem(businessId: string, item: any) {
    const newItem = { id: uuidv4(), businessId, ...item };
    this.updateStatus(newItem);
    DataStore.inventory.push(newItem);
    DataStore.saveInventory();
    return newItem;
  }
  static updateItem(itemId: string, updates: any) {
    const item = DataStore.inventory.find((i: any) => i.id === itemId);
    if (item) {
      Object.assign(item, updates);
      this.updateStatus(item);
      DataStore.saveInventory();
    }
    return item;
  }
  static deleteItem(itemId: string) {
    DataStore.inventory = DataStore.inventory.filter((i: any) => i.id !== itemId);
    DataStore.saveInventory();
    return true;
  }
  static updateStatus(item: any) {
    if (item.quantity === 0) item.status = 'out_of_stock';
    else if (item.quantity <= item.reorderLevel) item.status = 'low_stock';
    else item.status = 'in_stock';
  }
}
