import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = fs.existsSync(path.join(__dirname, '../data'))
  ? path.join(__dirname, '../data')
  : path.resolve(__dirname, '../../src/data');

function loadJSON(filename: string) {
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
  kycVerifications: loadJSON('kyc-verifications.json'),
  
  saveInventory() {
    fs.writeFileSync(path.join(dataPath, 'inventory.json'), JSON.stringify(this.inventory, null, 2));
  },
  savePriorities() {
    fs.writeFileSync(path.join(dataPath, 'priorities.json'), JSON.stringify(this.priorities, null, 2));
  },
  saveBusiness() {
    fs.writeFileSync(path.join(dataPath, 'business.json'), JSON.stringify(this.business, null, 2));
  },
  saveKycVerifications() {
    fs.writeFileSync(path.join(dataPath, 'kyc-verifications.json'), JSON.stringify(this.kycVerifications, null, 2));
  }
};
