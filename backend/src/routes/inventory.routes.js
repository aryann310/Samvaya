import { Router } from 'express';
import * as ctrl from '../controllers/inventory.controller.js';
const router = Router();
router.get('/:businessId', ctrl.getInventory);
router.post('/:businessId', ctrl.addItem);
router.put('/item/:itemId', ctrl.updateItem);
router.delete('/item/:itemId', ctrl.deleteItem);
export default router;
//# sourceMappingURL=inventory.routes.js.map