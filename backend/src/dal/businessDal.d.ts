import type { Business } from '../models/index.js';
/**
 * Data Access Layer (DAL) for Business entity.
 * Transparently encrypts sensitive fields (Aadhaar, PAN, phone, bank account)
 * before persisting to storage/database, and decrypts them upon retrieval.
 */
export declare class BusinessDAL {
    /**
     * Pre-write transformation (async):
     * Encrypts Aadhaar, PAN, Phone, and Bank Account details using AES-256-GCM.
     */
    static encryptRecord(business: Business): Promise<Business>;
    /**
     * Pre-write transformation (sync):
     * Encrypts Aadhaar, PAN, Phone, and Bank Account details using AES-256-GCM.
     */
    static encryptRecordSync(business: Business): Business;
    /**
     * Post-read transformation (async):
     * Authenticates and decrypts sensitive fields from storage into plaintext.
     */
    static decryptRecord(business: Business): Promise<Business>;
    /**
     * Post-read transformation (sync):
     * Authenticates and decrypts sensitive fields from storage into plaintext.
     */
    static decryptRecordSync(business: Business): Business;
    private static _encryptWithKey;
    private static _decryptWithKey;
}
//# sourceMappingURL=businessDal.d.ts.map