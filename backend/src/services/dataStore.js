import fs from 'fs';
import path from 'path';
const dataPath = path.join(__dirname, '../data');
function loadJSON(filename) {
    return JSON.parse(fs.readFileSync(path.join(dataPath, filename), 'utf-8'));
}
export const DataStore = {
    business: loadJSON('business.json'),
    financials: loadJSON('financial-records.json'),
    inventory: loadJSON('inventory.json'),
    cashflow: loadJSON('cashflow.json'),
    competitors: loadJSON('competitors.json'),
    hyperlocal: loadJSON('hyperlocal.json'),
    loans: loadJSON('loan-products.json'),
    schemes: loadJSON('schemes.json'),
    insights: loadJSON('insights.json'),
    priorities: loadJSON('priorities.json'),
    advisorResponses: loadJSON('advisor-responses.json'),
    saveInventory() {
        fs.writeFileSync(path.join(dataPath, 'inventory.json'), JSON.stringify(this.inventory, null, 2));
    },
    savePriorities() {
        fs.writeFileSync(path.join(dataPath, 'priorities.json'), JSON.stringify(this.priorities, null, 2));
    },
    saveBusiness() {
        fs.writeFileSync(path.join(dataPath, 'business.json'), JSON.stringify(this.business, null, 2));
    }
};
//# sourceMappingURL=dataStore.js.map