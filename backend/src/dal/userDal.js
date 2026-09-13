import bcrypt from 'bcryptjs';
import { FieldEncryption } from '../security/encryption.js';
import { secretsManager } from '../security/secretsManager.js';
export class UserDAL {
    static BCRYPT_SALT_ROUNDS = 12;
    /**
     * Hashes a plaintext password using bcrypt with 12 salt rounds.
     */
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(this.BCRYPT_SALT_ROUNDS);
        return bcrypt.hash(password, salt);
    }
    /**
     * Compares a plaintext password with the stored bcrypt hash.
     */
    static async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    /**
     * Encrypts user sensitive PII (phone number) using AES-256-GCM before saving to disk.
     */
    static encryptUser(user) {
        const key = secretsManager.getFieldEncryptionKeySync();
        return {
            ...user,
            phone: FieldEncryption.encrypt(user.phone, key) || user.phone,
        };
    }
    /**
     * Decrypts user sensitive PII (phone number) after reading from disk.
     */
    static decryptUser(user) {
        const key = secretsManager.getFieldEncryptionKeySync();
        return {
            ...user,
            phone: FieldEncryption.decrypt(user.phone, key) || user.phone,
        };
    }
    /**
     * Sanitizes a user record to omit passwordHash before returning to clients or handlers.
     */
    static sanitize(user) {
        const { passwordHash, ...sanitized } = user;
        return sanitized;
    }
}
//# sourceMappingURL=userDal.js.map