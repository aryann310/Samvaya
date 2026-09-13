import crypto from 'crypto';

export const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
export const IV_LENGTH_BYTES = 12; // 96 bits for GCM recommended by NIST
export const AUTH_TAG_LENGTH_BYTES = 16; // 128 bits
export const ENVELOPE_PREFIX = 'enc:v1:';

export class FieldEncryption {
  /**
   * Encrypts plaintext string using AES-256-GCM.
   * Returns an envelope: enc:v1:<iv_hex>:<authTag_hex>:<ciphertext_hex>
   */
  static encrypt(plaintext: string | null | undefined, key: Buffer): string | null | undefined {
    if (plaintext === null || plaintext === undefined) {
      return plaintext;
    }

    const valueStr = typeof plaintext === 'string' ? plaintext : String(plaintext);

    // Idempotency: avoid double-encrypting already encrypted values
    if (valueStr.startsWith(ENVELOPE_PREFIX)) {
      return valueStr;
    }

    if (!Buffer.isBuffer(key) || key.length !== 32) {
      throw new Error('Encryption key must be a 32-byte (256-bit) Buffer');
    }

    // Cryptographically secure random 12-byte IV for every encryption operation
    const iv = crypto.randomBytes(IV_LENGTH_BYTES);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH_BYTES,
    });

    let ciphertext = cipher.update(valueStr, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return `${ENVELOPE_PREFIX}${iv.toString('hex')}:${authTag.toString('hex')}:${ciphertext}`;
  }

  /**
   * Decrypts an AES-256-GCM encrypted envelope.
   * Verifies the 128-bit authentication tag before returning decrypted plaintext.
   */
  static decrypt(ciphertextPayload: string | null | undefined, key: Buffer): string | null | undefined {
    if (ciphertextPayload === null || ciphertextPayload === undefined) {
      return ciphertextPayload;
    }

    if (typeof ciphertextPayload !== 'string') {
      return ciphertextPayload;
    }

    // If not encrypted, return as is
    if (!ciphertextPayload.startsWith(ENVELOPE_PREFIX)) {
      return ciphertextPayload;
    }

    if (!Buffer.isBuffer(key) || key.length !== 32) {
      throw new Error('Encryption key must be a 32-byte (256-bit) Buffer');
    }

    const payloadBody = ciphertextPayload.slice(ENVELOPE_PREFIX.length);
    const parts = payloadBody.split(':');
    const [ivHex, authTagHex, ciphertextHex] = parts;
    if (!ivHex || !authTagHex || !ciphertextHex || parts.length !== 3) {
      throw new Error('Malformed encrypted payload format: expected <iv>:<authTag>:<ciphertext>');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    if (iv.length !== IV_LENGTH_BYTES) {
      throw new Error(`Invalid IV length: expected ${IV_LENGTH_BYTES} bytes, got ${iv.length}`);
    }

    if (authTag.length !== AUTH_TAG_LENGTH_BYTES) {
      throw new Error(`Invalid auth tag length: expected ${AUTH_TAG_LENGTH_BYTES} bytes, got ${authTag.length}`);
    }

    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH_BYTES,
    });
    decipher.setAuthTag(authTag);

    const chunk1 = decipher.update(ciphertextHex, 'hex', 'utf8');
    const chunk2 = decipher.final('utf8');

    return `${chunk1}${chunk2}`;
  }
}
