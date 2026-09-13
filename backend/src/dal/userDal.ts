import bcrypt from 'bcryptjs';
import { FieldEncryption } from '../security/encryption.js';
import { secretsManager } from '../security/secretsManager.js';
import type { User, SanitizedUser } from '../models/user.model.js';

export class UserDAL {
  private static readonly BCRYPT_SALT_ROUNDS = 12;

  /**
   * Hashes a plaintext password using bcrypt with 12 salt rounds.
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.BCRYPT_SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares a plaintext password with the stored bcrypt hash.
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Encrypts user sensitive PII (phone number) using AES-256-GCM before saving to disk.
   */
  static encryptUser(user: User): User {
    const key = secretsManager.getFieldEncryptionKeySync();
    return {
      ...user,
      phone: (FieldEncryption.encrypt(user.phone, key) as string) || user.phone,
    };
  }

  /**
   * Decrypts user sensitive PII (phone number) after reading from disk.
   */
  static decryptUser(user: User): User {
    const key = secretsManager.getFieldEncryptionKeySync();
    return {
      ...user,
      phone: (FieldEncryption.decrypt(user.phone, key) as string) || user.phone,
    };
  }

  /**
   * Sanitizes a user record to omit passwordHash before returning to clients or handlers.
   */
  static sanitize(user: User): SanitizedUser {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
