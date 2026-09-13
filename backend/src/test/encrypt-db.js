import { DataStore } from '../services/dataStore.js';
console.log('Original owner in memory (decrypted):', DataStore.business.owner);
DataStore.saveBusiness();
console.log('Saved to business.json using DataStore.saveBusiness().');
//# sourceMappingURL=encrypt-db.js.map