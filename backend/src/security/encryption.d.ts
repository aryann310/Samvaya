export declare const ENCRYPTION_ALGORITHM = "aes-256-gcm";
export declare const IV_LENGTH_BYTES = 12;
export declare const AUTH_TAG_LENGTH_BYTES = 16;
export declare const ENVELOPE_PREFIX = "enc:v1:";
export declare class FieldEncryption {
    /**
     * Encrypts plaintext string using AES-256-GCM.
     * Returns an envelope: enc:v1:<iv_hex>:<authTag_hex>:<ciphertext_hex>
     */
    static encrypt(plaintext: string | null | undefined, key: Buffer): string | null | undefined;
    /**
     * Decrypts an AES-256-GCM encrypted envelope.
     * Verifies the 128-bit authentication tag before returning decrypted plaintext.
     */
    static decrypt(ciphertextPayload: string | null | undefined, key: Buffer): string | null | undefined;
}
//# sourceMappingURL=encryption.d.ts.map