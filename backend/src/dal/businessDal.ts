import type { Business } from '../models/index.js';
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
  static async encryptRecord(business: Business): Promise<Business> {
    const key = await secretsManager.getFieldEncryptionKey();
    return this._encryptWithKey(business, key);
  }

  /**
   * Pre-write transformation (sync):
   * Encrypts Aadhaar, PAN, Phone, and Bank Account details using AES-256-GCM.
   */
  static encryptRecordSync(business: Business): Business {
    const key = secretsManager.getFieldEncryptionKeySync();
    return this._encryptWithKey(business, key);
  }

  /**
   * Post-read transformation (async):
   * Authenticates and decrypts sensitive fields from storage into plaintext.
   */
  static async decryptRecord(business: Business): Promise<Business> {
    const key = await secretsManager.getFieldEncryptionKey();
    return this._decryptWithKey(business, key);
  }

  /**
   * Post-read transformation (sync):
   * Authenticates and decrypts sensitive fields from storage into plaintext.
   */
  static decryptRecordSync(business: Business): Business {
    const key = secretsManager.getFieldEncryptionKeySync();
    return this._decryptWithKey(business, key);
  }

  private static _encryptWithKey(business: Business, key: Buffer): Business {
    if (!business) return business;
    const cloned: Business = JSON.parse(JSON.stringify(business));

    if (cloned.owner) {
      if (cloned.owner.aadhaar) {
        cloned.owner.aadhaar = FieldEncryption.encrypt(cloned.owner.aadhaar, key) as string;
      }
      if (cloned.owner.panCard) {
        cloned.owner.panCard = FieldEncryption.encrypt(cloned.owner.panCard, key) as string;
      }
      if (cloned.owner.phone) {
        cloned.owner.phone = FieldEncryption.encrypt(cloned.owner.phone, key) as string;
      }
      if (cloned.owner.bankAccount) {
        if (cloned.owner.bankAccount.accountNumber) {
          cloned.owner.bankAccount.accountNumber = FieldEncryption.encrypt(
            cloned.owner.bankAccount.accountNumber,
            key
          ) as string;
        }
        if (cloned.owner.bankAccount.ifscCode) {
          cloned.owner.bankAccount.ifscCode = FieldEncryption.encrypt(
            cloned.owner.bankAccount.ifscCode,
            key
          ) as string;
        }
      }
    }

    return cloned;
  }

  private static _decryptWithKey(business: Business, key: Buffer): Business {
    if (!business) return business;
    const cloned: Business = JSON.parse(JSON.stringify(business));

    if (cloned.owner) {
      if (cloned.owner.aadhaar) {
        cloned.owner.aadhaar = FieldEncryption.decrypt(cloned.owner.aadhaar, key) as string;
      }
      if (cloned.owner.panCard) {
        cloned.owner.panCard = FieldEncryption.decrypt(cloned.owner.panCard, key) as string;
      }
      if (cloned.owner.phone) {
        cloned.owner.phone = FieldEncryption.decrypt(cloned.owner.phone, key) as string;
      }
      if (cloned.owner.bankAccount) {
        if (cloned.owner.bankAccount.accountNumber) {
          cloned.owner.bankAccount.accountNumber = FieldEncryption.decrypt(
            cloned.owner.bankAccount.accountNumber,
            key
          ) as string;
        }
        if (cloned.owner.bankAccount.ifscCode) {
          cloned.owner.bankAccount.ifscCode = FieldEncryption.decrypt(
            cloned.owner.bankAccount.ifscCode,
            key
          ) as string;
        }
      }
    }

    return cloned;
  }
}
