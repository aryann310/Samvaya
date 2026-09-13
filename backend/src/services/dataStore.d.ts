export declare const DataStore: {
    business: import("../models/index.js").Business;
    financials: any;
    inventory: any;
    cashflow: any;
    competitors: any;
    hyperlocal: any;
    loans: any;
    schemes: any;
    insights: any;
    priorities: any;
    advisorResponses: any;
    saveInventory(): void;
    savePriorities(): void;
    /**
     * Persists business entity to storage volume.
     * Runs through BusinessDAL to encrypt sensitive fields (Aadhaar, PAN, phone, bank details) with AES-256-GCM.
     */
    saveBusiness(): void;
    saveBusinessAsync(): Promise<void>;
};
//# sourceMappingURL=dataStore.d.ts.map