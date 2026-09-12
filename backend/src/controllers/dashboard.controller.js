import { DashboardService } from '../services/dashboard.service.js';
import { DataStore } from '../services/dataStore.js';
export const getDashboard = (req, res) => {
    const data = DashboardService.getDashboard(req.params.businessId);
    res.json({ success: true, data });
};
export const completePriority = (req, res) => {
    const p = DataStore.priorities.find((x) => x.id === req.params.id);
    if (p) {
        p.completed = true;
        DataStore.savePriorities();
    }
    res.json({ success: true, data: p });
};
//# sourceMappingURL=dashboard.controller.js.map