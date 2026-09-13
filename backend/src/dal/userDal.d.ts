import type { User, SanitizedUser } from '../models/user.model.js';
export declare class UserDAL {
    private static readonly BCRYPT_SALT_ROUNDS;
    /**
     * Hashes a plaintext password using bcrypt with 12 salt rounds.
     */
    static hashPassword(password: string): Promise<string>;
    /**
     * Compares a plaintext password with the stored bcrypt hash.
     */
    static verifyPassword(password: string, hash: string): Promise<boolean>;
    /**
     * Encrypts user sensitive PII (phone number) using AES-256-GCM before saving to disk.
     */
    static encryptUser(user: User): User;
    /**
     * Decrypts user sensitive PII (phone number) after reading from disk.
     */
    static decryptUser(user: User): User;
    /**
     * Sanitizes a user record to omit passwordHash before returning to clients or handlers.
     */
    static sanitize(user: User): SanitizedUser;
}
//# sourceMappingURL=userDal.d.ts.map