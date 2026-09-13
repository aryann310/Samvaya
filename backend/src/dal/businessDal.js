import { FieldEncryption } from '../security/encryption.js';
import { secretsManager } from '../security/secretsManager.js';
/**
 * Data Access Layer (DAL) for Business entity.
 * Transparently encrypts sensitive fields (Aadhaar, PAN, phone, bank account)
 * before persisting to storage/database, and decrypts them upon retrieval.
 */
export class BusinessDAL {
    /**
     * Pre-write transformation (async):
     * Encrypts Aadhaar, PAN, Phone, and Bank Account details using AES-256-GCM.
     */
    static async encryptRecord(business) {
        const key = await secretsManager.getFieldEncryptionKey();
        return this._encryptWithKey(business, key);
    }
    /**
     * Pre-write transformation (sync):
     * Encrypts Aadhaar, PAN, Phone, and Bank Account details using AES-256-GCM.
     */
    static encryptRecordSync(business) {
        const key = secretsManager.getFieldEncryptionKeySync();
        return this._encryptWithKey(business, key);
    }
    /**
     * Post-read transformation (async):
     * Authenticates and decrypts sensitive fields from storage into plaintext.
     */
    static async decryptRecord(business) {
        const key = await secretsManager.getFieldEncryptionKey();
        return this._decryptWithKey(business, key);
    }
    /**
     * Post-read transformation (sync):
     * Authenticates and decrypts sensitive fields from storage into plaintext.
     */
    static decryptRecordSync(business) {
        const key = secretsManager.getFieldEncryptionKeySync();
        return this._decryptWithKey(business, key);
    }
    static _encryptWithKey(business, key) {
        if (!business)
            return business;
        const cloned = JSON.parse(JSON.stringify(business));
        if (cloned.owner) {
            if (cloned.owner.aadhaar) {
                cloned.owner.aadhaar = FieldEncryption.encrypt(cloned.owner.aadhaar, key);
            }
            if (cloned.owner.panCard) {
                cloned.owner.panCard = FieldEncryption.encrypt(cloned.owner.panCard, key);
            }
            if (cloned.owner.phone) {
                cloned.owner.phone = FieldEncryption.encrypt(cloned.owner.phone, key);
            }
            if (cloned.owner.bankAccount) {
                if (cloned.owner.bankAccount.accountNumber) {
                    cloned.owner.bankAccount.accountNumber = FieldEncryption.encrypt(cloned.owner.bankAccount.accountNumber, key);
                }
                if (cloned.owner.bankAccount.ifscCode) {
                    cloned.owner.bankAccount.ifscCode = FieldEncryption.encrypt(cloned.owner.bankAccount.ifscCode, key);
                }
            }
        }
        return cloned;
    }
    static _decryptWithKey(business, key) {
        if (!business)
            return business;
        const cloned = JSON.parse(JSON.stringify(business));
        if (cloned.owner) {
            if (cloned.owner.aadhaar) {
                cloned.owner.aadhaar = FieldEncryption.decrypt(cloned.owner.aadhaar, key);
            }
            if (cloned.owner.panCard) {
                cloned.owner.panCard = FieldEncryption.decrypt(cloned.owner.panCard, key);
            }
            if (cloned.owner.phone) {
                cloned.owner.phone = FieldEncryption.decrypt(cloned.owner.phone, key);
            }
            if (cloned.owner.bankAccount) {
                if (cloned.owner.bankAccount.accountNumber) {
                    cloned.owner.bankAccount.accountNumber = FieldEncryption.decrypt(cloned.owner.bankAccount.accountNumber, key);
                }
                if (cloned.owner.bankAccount.ifscCode) {
                    cloned.owner.bankAccount.ifscCode = FieldEncryption.decrypt(cloned.owner.bankAccount.ifscCode, key);
                }
            }
        }
        return cloned;
    }
}
//# sourceMappingURL=businessDal.js.map