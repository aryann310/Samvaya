import crypto from 'node:crypto';

// Default 32-byte key fallback if not configured
const RAW_KEY = process.env.DIGILOCKER_ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Returns a 32-byte Buffer key derived from the configuration.
 */
function getKeyBuffer(): Buffer {
  if (RAW_KEY.length === 64) {
    return Buffer.from(RAW_KEY, 'hex');
  }
  return crypto.createHash('sha256').update(RAW_KEY).digest();
}

/**
 * Encrypts sensitive PII string using AES-256-GCM at rest.
 * Output format: iv:authTag:encryptedData (hex encoded)
 */
export function encryptPII(text: string): string {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKeyBuffer(), iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts AES-256-GCM encrypted PII string.
 */
export function decryptPII(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) return encryptedText;

    const ivHex = parts[0];
    const authTagHex = parts[1];
    const encryptedData = parts[2];

    if (!ivHex || !authTagHex || !encryptedData) {
      return encryptedText;
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, getKeyBuffer(), iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);

    const decrypted1 = decipher.update(encryptedData, 'hex', 'utf8');
    const decrypted2 = decipher.final('utf8');
    return decrypted1 + decrypted2;
  } catch (error) {
    console.error('[Crypto] Decryption failed for PII field');
    return '[Decryption Error]';
  }
}

/**
 * Strict PAN Number Masking Rule (Step 3 & Compliance Guardrails):
 * Shows only the last 4 characters, masks the rest.
 * e.g., "ABCDE1234F" -> "XXXXXX234F"
 */
export function maskPanNumber(pan: string): string {
  if (!pan) return '';
  const cleaned = pan.trim().toUpperCase();
  if (cleaned.length < 4) return 'XXXX';
  return 'X'.repeat(cleaned.length - 4) + cleaned.slice(-4);
}

/**
 * Strict Aadhaar Number Masking Rule:
 * Shows only the last 4 digits.
 * e.g., "123456789012" -> "XXXXXXXX9012"
 */
export function maskAadhaarNumber(aadhaar: string): string {
  if (!aadhaar) return '';
  const cleaned = aadhaar.replace(/\D/g, '');
  if (cleaned.length < 4) return 'XXXX';
  return 'X'.repeat(cleaned.length - 4) + cleaned.slice(-4);
}

/**
 * Sanitizes and generates a secure random state token to prevent CSRF attacks in OAuth callback.
 */
export function generateSecureStateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
