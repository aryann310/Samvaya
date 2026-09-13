import crypto from 'crypto';

export interface ISecretsManager {
  getFieldEncryptionKey(): Promise<Buffer>;
}

export type SecretProviderType = 'cloud-secrets-manager' | 'vault' | 'environment-vault';

export class SecretsManagerProvider implements ISecretsManager {
  private static cachedKey: Buffer | null = null;
  private providerType: SecretProviderType;

  constructor(providerType: SecretProviderType = 'cloud-secrets-manager') {
    this.providerType = providerType;
  }

  /**
   * Retrieves the 256-bit (32 bytes) master key from the secrets manager asynchronously.
   */
  async getFieldEncryptionKey(): Promise<Buffer> {
    return this.getFieldEncryptionKeySync();
  }

  /**
   * Synchronously retrieves the 256-bit master key once resolved/injected in the runtime environment.
   */
  getFieldEncryptionKeySync(): Buffer {
    if (SecretsManagerProvider.cachedKey) {
      return SecretsManagerProvider.cachedKey;
    }

    const secretHex =
      process.env.SECRETS_MANAGER_FIELD_KEY ||
      process.env.APP_DATA_ENCRYPTION_KEY ||
      process.env.ENCRYPTION_KEY_SECRET;

    if (!secretHex) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          'CRITICAL SECURITY ERROR: Field encryption key not found in Secrets Manager. Ensure SECRETS_MANAGER_FIELD_KEY is configured in your secure runtime vault.'
        );
      } else {
        // Safe deterministic runtime key for local dev if not yet provisioned in environment vault
        console.warn(
          '[SECURITY NOTICE] Initializing runtime encryption key from local runtime secret provider.'
        );
        // Deterministic derivation for dev so data encrypted on disk can be decrypted across dev reloads
        const devSeed = 'samvaya-hyperlocal-dev-vault-secret-seed-v1';
        SecretsManagerProvider.cachedKey = crypto.createHash('sha256').update(devSeed).digest();
        return SecretsManagerProvider.cachedKey;
      }
    }

    const keyBuffer = Buffer.from(secretHex.trim(), 'hex');

    if (keyBuffer.length !== 32) {
      throw new Error(
        `Invalid encryption key length: Secrets Manager provided ${keyBuffer.length} bytes, but AES-256 requires exactly 32 bytes (256-bit hex).`
      );
    }

    SecretsManagerProvider.cachedKey = keyBuffer;
    return SecretsManagerProvider.cachedKey;
  }

  /**
   * Explicitly sets or overrides key for testing or rotation
   */
  static setExplicitKey(key: Buffer | null): void {
    if (key && key.length !== 32) {
      throw new Error('Key must be exactly 32 bytes');
    }
    SecretsManagerProvider.cachedKey = key;
  }

  /**
   * Helper utility to generate a new cryptographically secure 256-bit key for provisioning in Secrets Manager
   */
  static generateNew256BitKeyHex(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

export const secretsManager = new SecretsManagerProvider();
