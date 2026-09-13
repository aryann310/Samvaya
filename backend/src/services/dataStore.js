import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BusinessDAL } from '../dal/businessDal.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data');
function loadJSON(filename) {
    return JSON.parse(fs.readFileSync(path.join(dataPath, filename), 'utf-8'));
}
// Load raw business data and decrypt sensitive fields (Aadhaar, PAN, phone, bank details)
const rawBusiness = loadJSON('business.json');
const decryptedBusiness = BusinessDAL.decryptRecordSync(rawBusiness);
export const DataStore = {
    business: decryptedBusiness,
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
    /**
     * Persists business entity to storage volume.
     * Runs through BusinessDAL to encrypt sensitive fields (Aadhaar, PAN, phone, bank details) with AES-256-GCM.
     */
    saveBusiness() {
        const encryptedPayload = BusinessDAL.encryptRecordSync(this.business);
        fs.writeFileSync(path.join(dataPath, 'business.json'), JSON.stringify(encryptedPayload, null, 2));
    },
    async saveBusinessAsync() {
        const encryptedPayload = await BusinessDAL.encryptRecord(this.business);
        await fs.promises.writeFile(path.join(dataPath, 'business.json'), JSON.stringify(encryptedPayload, null, 2));
    }
};
//# sourceMappingURL=dataStore.js.map