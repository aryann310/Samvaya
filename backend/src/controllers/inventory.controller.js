import { InventoryService } from '../services/inventory.service.js';
export const getInventory = (req, res) => {
    const data = InventoryService.getAll(req.params.businessId);
    res.json({ success: true, data });
};
export const addItem = (req, res) => {
    const data = InventoryService.addItem(req.params.businessId, req.body);
    res.json({ success: true, data });
};
export const updateItem = (req, res) => {
    const data = InventoryService.updateItem(req.params.itemId, req.body);
    res.json({ success: true, data });
};
export const deleteItem = (req, res) => {
    InventoryService.deleteItem(req.params.itemId);
    res.json({ success: true, data: { deleted: true } });
};
//# sourceMappingURL=inventory.controller.js.map