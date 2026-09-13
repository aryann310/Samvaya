export interface ISecretsManager {
    getFieldEncryptionKey(): Promise<Buffer>;
}
export type SecretProviderType = 'cloud-secrets-manager' | 'vault' | 'environment-vault';
export declare class SecretsManagerProvider implements ISecretsManager {
    private static cachedKey;
    private providerType;
    constructor(providerType?: SecretProviderType);
    /**
     * Retrieves the 256-bit (32 bytes) master key from the secrets manager asynchronously.
     */
    getFieldEncryptionKey(): Promise<Buffer>;
    /**
     * Synchronously retrieves the 256-bit master key once resolved/injected in the runtime environment.
     */
    getFieldEncryptionKeySync(): Buffer;
    private static cachedJwtSecret;
    /**
     * Retrieves the JWT signing secret from the Secrets Manager or environment vault.
     */
    getJwtSecret(): Promise<string>;
    /**
     * Synchronously retrieves the JWT signing secret.
     */
    getJwtSecretSync(): string;
    /**
     * Explicitly sets or overrides key for testing or rotation
     */
    static setExplicitKey(key: Buffer | null): void;
    static setExplicitJwtSecret(secret: string | null): void;
    /**
     * Helper utility to generate a new cryptographically secure 256-bit key for provisioning in Secrets Manager
     */
    static generateNew256BitKeyHex(): string;
}
export declare const secretsManager: SecretsManagerProvider;
//# sourceMappingURL=secretsManager.d.ts.map