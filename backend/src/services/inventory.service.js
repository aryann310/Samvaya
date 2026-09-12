import { DataStore } from './dataStore.js';
import { v4 as uuidv4 } from 'uuid';
export class InventoryService {
    static getAll(businessId) {
        return DataStore.inventory.filter((i) => i.businessId === businessId);
    }
    static addItem(businessId, item) {
        const newItem = { id: uuidv4(), businessId, ...item };
        this.updateStatus(newItem);
        DataStore.inventory.push(newItem);
        DataStore.saveInventory();
        return newItem;
    }
    static updateItem(itemId, updates) {
        const item = DataStore.inventory.find((i) => i.id === itemId);
        if (item) {
            Object.assign(item, updates);
            this.updateStatus(item);
            DataStore.saveInventory();
        }
        return item;
    }
    static deleteItem(itemId) {
        DataStore.inventory = DataStore.inventory.filter((i) => i.id !== itemId);
        DataStore.saveInventory();
        return true;
    }
    static updateStatus(item) {
        if (item.quantity === 0)
            item.status = 'out_of_stock';
        else if (item.quantity <= item.reorderLevel)
            item.status = 'low_stock';
        else
            item.status = 'in_stock';
    }
}
//# sourceMappingURL=inventory.service.js.map