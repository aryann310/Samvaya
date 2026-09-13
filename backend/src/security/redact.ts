/**
 * Redaction utility for masking sensitive data before logging or error handling.
 * Never logs sensitive PII (PAN, Aadhaar, Phone, Bank Account) in plaintext.
 */

// Regex patterns for sensitive data in text/strings
const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;
const AADHAAR_REGEX = /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g;
const PHONE_REGEX = /\b(?:\+91|91)?[6-9]\d{9}\b/g;
const BANK_ACCOUNT_REGEX = /\b\d{9,18}\b/g;

/**
 * Mask PAN: e.g. ABCDE1234F -> XXXXX1234F
 */
export function maskPAN(val: string): string {
  if (!val) return val;
  const clean = val.trim();
  if (clean.length === 10) {
    return 'XXXXX' + clean.slice(5);
  }
  return 'XXXXX' + clean.slice(Math.max(0, clean.length - 4));
}

/**
 * Mask Aadhaar: e.g. 123456789012 -> XXXXXXXX9012
 */
export function maskAadhaar(val: string): string {
  if (!val) return val;
  const digits = val.replace(/\D/g, '');
  if (digits.length >= 4) {
    const last4 = digits.slice(-4);
    return 'XXXXXXXX' + last4;
  }
  return 'XXXXXXXXXXXX';
}

/**
 * Mask Phone: e.g. 9876543210 -> XXXXXX3210
 */
export function maskPhone(val: string): string {
  if (!val) return val;
  const digits = val.replace(/\D/g, '');
  if (digits.length >= 4) {
    const last4 = digits.slice(-4);
    return 'XXXXXX' + last4;
  }
  return 'XXXXXXXXXX';
}

/**
 * Mask Bank Account Number: e.g. 50100234567890 -> XXXXXXXXXX7890
 */
export function maskBankAccount(val: string): string {
  if (!val) return val;
  const clean = val.replace(/\s/g, '');
  if (clean.length > 4) {
    const last4 = clean.slice(-4);
    return 'X'.repeat(clean.length - 4) + last4;
  }
  return 'XXXX';
}

/**
 * Mask IFSC Code: e.g. HDFC0001234 -> HDFCXXXX234
 */
export function maskIFSC(val: string): string {
  if (!val) return val;
  const clean = val.trim();
  if (clean.length === 11) {
    return clean.slice(0, 4) + 'XXXX' + clean.slice(8);
  }
  return 'XXXXXXX';
}

/**
 * Redacts a raw string (e.g. log message, error message, stack trace)
 */
export function redactString(str: string): string {
  if (!str || typeof str !== 'string') return str;

  let redacted = str;

  // Mask PAN
  redacted = redacted.replace(PAN_REGEX, (match) => maskPAN(match));

  // Mask Aadhaar (12 digits with optional spaces/hyphens)
  redacted = redacted.replace(AADHAAR_REGEX, (match) => maskAadhaar(match));

  // Mask Indian Mobile Numbers (10 digits starting with 6-9)
  redacted = redacted.replace(PHONE_REGEX, (match) => maskPhone(match));

  return redacted;
}

const SENSITIVE_KEY_PATTERNS = [
  'aadhaar',
  'pan',
  'pancard',
  'phone',
  'mobile',
  'bankaccount',
  'accountnumber',
  'account_no',
  'accountno',
  'ifsc',
  'ifsccode',
  'secret',
  'password',
  'key',
  'authorization',
  'token',
  'jwt',
  'bearer',
  'accesstoken',
  'refreshtoken'
];


function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_KEY_PATTERNS.some((pattern) => lower.includes(pattern));
}

function maskByFieldName(key: string, value: any): any {
  if (value === null || value === undefined) return value;
  const lower = key.toLowerCase();

  if (typeof value === 'string') {
    if (lower.includes('pan')) return maskPAN(value);
    if (lower.includes('aadhaar')) return maskAadhaar(value);
    if (lower.includes('phone') || lower.includes('mobile')) return maskPhone(value);
    if (lower.includes('account') || lower.includes('bank')) return maskBankAccount(value);
    if (lower.includes('ifsc')) return maskIFSC(value);
    return '[REDACTED]';
  }

  if (typeof value === 'number') {
    const str = String(value);
    if (lower.includes('phone') || lower.includes('mobile')) return maskPhone(str);
    if (lower.includes('aadhaar')) return maskAadhaar(str);
    if (lower.includes('account')) return maskBankAccount(str);
    return '[REDACTED]';
  }

  return '[REDACTED]';
}

/**
 * Recursively redacts sensitive keys and values in any object/array/primitive.
 * Handles circular references safely.
 */
export function redactSensitiveData<T = any>(input: T, seen = new WeakSet()): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    return redactString(input) as unknown as T;
  }

  if (typeof input !== 'object') {
    return input;
  }

  if (seen.has(input as object)) {
    return '[Circular]' as unknown as T;
  }
  seen.add(input as object);

  // Handle Error instances specially
  if (input instanceof Error) {
    const sanitizedError: Record<string, any> = {
      name: input.name,
      message: redactString(input.message),
      stack: input.stack ? redactString(input.stack) : undefined,
    };
    for (const [key, value] of Object.entries(input)) {
      if (isSensitiveKey(key)) {
        sanitizedError[key] = maskByFieldName(key, value);
      } else {
        sanitizedError[key] = redactSensitiveData(value, seen);
      }
    }
    return sanitizedError as unknown as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => redactSensitiveData(item, seen)) as unknown as T;
  }

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value && typeof value === 'object') {
      result[key] = redactSensitiveData(value, seen);
    } else if (isSensitiveKey(key)) {
      result[key] = maskByFieldName(key, value);
    } else {
      result[key] = redactSensitiveData(value, seen);
    }
  }

  return result as T;
}
