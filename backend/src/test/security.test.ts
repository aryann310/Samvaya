import assert from 'assert';
import crypto from 'crypto';
import { FieldEncryption, ENVELOPE_PREFIX } from '../security/encryption.js';
import { SecretsManagerProvider, secretsManager } from '../security/secretsManager.js';
import {
  maskPAN,
  maskAadhaar,
  maskPhone,
  maskBankAccount,
  maskIFSC,
  redactSensitiveData,
  redactString,
} from '../security/redact.js';
import { BusinessDAL } from '../dal/businessDal.js';
import { enforceHttpsAndTls, hstsMiddleware } from '../middleware/security.middleware.js';

console.log('--- STARTING COMPREHENSIVE SECURITY TEST SUITE ---');

// 1. Secrets Manager Tests
console.log('\n[TEST 1] Secrets Manager Key Handling');
const testKey = secretsManager.getFieldEncryptionKeySync();
assert(Buffer.isBuffer(testKey), 'Key must be a Buffer');
assert.strictEqual(testKey.length, 32, 'Key must be exactly 32 bytes (256 bits)');
console.log('✔ Secrets Manager correctly resolved 256-bit key');

// Test invalid key length rejected
assert.throws(() => {
  SecretsManagerProvider.setExplicitKey(Buffer.from('too-short'));
}, /must be exactly 32 bytes/);
SecretsManagerProvider.setExplicitKey(testKey); // reset
console.log('✔ Invalid key length properly rejected');

// 2. Field Encryption / Decryption Tests (AES-256-GCM)
console.log('\n[TEST 2] AES-256-GCM Field-Level Encryption & Decryption');
const plaintextPAN = 'ABCDE1234F';
const encryptedPAN1 = FieldEncryption.encrypt(plaintextPAN, testKey);
const encryptedPAN2 = FieldEncryption.encrypt(plaintextPAN, testKey);

assert(typeof encryptedPAN1 === 'string', 'Encrypted output must be string');
assert(encryptedPAN1.startsWith(ENVELOPE_PREFIX), `Must start with ${ENVELOPE_PREFIX}`);
assert.notStrictEqual(encryptedPAN1, encryptedPAN2, 'Random IV ensures ciphertext differs each time');

const decryptedPAN = FieldEncryption.decrypt(encryptedPAN1, testKey);
assert.strictEqual(decryptedPAN, plaintextPAN, 'Decrypted text must match plaintext exactly');

// Idempotency: encrypting already encrypted payload should be no-op
const reEncrypted = FieldEncryption.encrypt(encryptedPAN1, testKey);
assert.strictEqual(reEncrypted, encryptedPAN1, 'Encrypting already encrypted text must be idempotent');

// Tamper resistance: GCM Authentication tag check
const parts = encryptedPAN1.slice(ENVELOPE_PREFIX.length).split(':');
const tamperedPayload = `${ENVELOPE_PREFIX}${parts[0]}:${parts[1]}:deadbeef${parts[2]!.slice(8)}`;
assert.throws(() => {
  FieldEncryption.decrypt(tamperedPayload, testKey);
}, 'Tampered ciphertext must fail authentication and throw');
console.log('✔ Tamper resistance verified: GCM auth tag prevents modified ciphertext');

// Null and undefined safety
assert.strictEqual(FieldEncryption.encrypt(null, testKey), null);
assert.strictEqual(FieldEncryption.encrypt(undefined, testKey), undefined);
assert.strictEqual(FieldEncryption.decrypt(null, testKey), null);
console.log('✔ Null & undefined values handled gracefully');

// 3. PII Redaction and Masking Tests
console.log('\n[TEST 3] PII Redaction & Masking Rules');

// PAN Masking
assert.strictEqual(maskPAN('ABCDE1234F'), 'XXXXX1234F');
console.log('✔ PAN masked as: XXXXX1234F');

// Aadhaar Masking
assert.strictEqual(maskAadhaar('123456789012'), 'XXXXXXXX9012');
console.log('✔ Aadhaar masked as: XXXXXXXX9012');

// Phone Masking
assert.strictEqual(maskPhone('9876543210'), 'XXXXXX3210');
console.log('✔ Phone masked as: XXXXXX3210');

// Bank Account Masking
assert.strictEqual(maskBankAccount('50100234567890'), 'XXXXXXXXXX7890');
console.log('✔ Bank Account masked properly');

// IFSC Masking
assert.strictEqual(maskIFSC('HDFC0001234'), 'HDFCXXXX234');
console.log('✔ IFSC masked properly');

// Deep Object Redaction
const sensitivePayload = {
  businessName: 'Patel Kirana',
  owner: {
    name: 'Ramesh',
    panCard: 'ABCDE1234F',
    aadhaar: '123456789012',
    phone: '9876543210',
    bankAccount: {
      accountNumber: '50100234567890',
      ifscCode: 'HDFC0001234',
    },
  },
  notes: 'Customer with Aadhaar 123456789012 and phone 9876543210 called',
};

const redactedPayload = redactSensitiveData(sensitivePayload);
assert.strictEqual(redactedPayload.owner.panCard, 'XXXXX1234F');
assert.strictEqual(redactedPayload.owner.aadhaar, 'XXXXXXXX9012');
assert.strictEqual(redactedPayload.owner.phone, 'XXXXXX3210');
assert.strictEqual(redactedPayload.owner.bankAccount.accountNumber, 'XXXXXXXXXX7890');
assert(!redactedPayload.notes.includes('123456789012'), 'String Aadhaar must be masked');
assert(redactedPayload.notes.includes('XXXXXXXX9012'), 'String Aadhaar masked with last 4');
assert(!redactedPayload.notes.includes('9876543210'), 'String phone must be masked');
assert(redactedPayload.notes.includes('XXXXXX3210'), 'String phone masked with last 4');
console.log('✔ Deep object redaction successfully sanitized nested PII and free-text notes');

// Error Stack Trace Redaction
const simulatedError = new Error('Failed processing request for PAN ABCDE1234F and phone 9876543210');
const sanitizedError = redactSensitiveData(simulatedError);
assert(!sanitizedError.message.includes('ABCDE1234F'), 'Error message must not contain raw PAN');
assert(sanitizedError.message.includes('XXXXX1234F'), 'Error message must contain masked PAN');
assert(!sanitizedError.message.includes('9876543210'), 'Error message must not contain raw phone');
console.log('✔ Error stack trace and message redaction verified');

// 4. Data Access Layer (DAL) Tests
console.log('\n[TEST 4] Data Access Layer (DAL) Hooks');
const mockBusinessRecord: any = {
  id: 'biz-test-01',
  name: 'Test Store',
  owner: {
    name: 'Test Owner',
    phone: '9876543210',
    email: 'test@example.com',
    aadhaar: '123456789012',
    panCard: 'ABCDE1234F',
    bankAccount: {
      accountNumber: '50100234567890',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
    },
  },
};

// Test pre-write DAL encryption
const encryptedRecord = BusinessDAL.encryptRecordSync(mockBusinessRecord);
assert(encryptedRecord.owner.aadhaar.startsWith(ENVELOPE_PREFIX), 'Aadhaar must be encrypted in DAL');
assert(encryptedRecord.owner.panCard.startsWith(ENVELOPE_PREFIX), 'PAN must be encrypted in DAL');
assert(encryptedRecord.owner.phone.startsWith(ENVELOPE_PREFIX), 'Phone must be encrypted in DAL');
assert(
  encryptedRecord.owner.bankAccount!.accountNumber.startsWith(ENVELOPE_PREFIX),
  'Account number must be encrypted in DAL'
);
assert.notStrictEqual(encryptedRecord.owner.panCard, 'ABCDE1234F');
assert.notStrictEqual(encryptedRecord.owner.aadhaar, '123456789012');
console.log('✔ DAL encryptRecordSync successfully transformed sensitive fields to ciphertext');

// Test post-read DAL decryption
const decryptedRecord = BusinessDAL.decryptRecordSync(encryptedRecord);
assert.strictEqual(decryptedRecord.owner.aadhaar, '123456789012');
assert.strictEqual(decryptedRecord.owner.panCard, 'ABCDE1234F');
assert.strictEqual(decryptedRecord.owner.phone, '9876543210');
assert.strictEqual(decryptedRecord.owner.bankAccount!.accountNumber, '50100234567890');
console.log('✔ DAL decryptRecordSync successfully restored plaintext for application use');

// 5. In-Transit TLS & HSTS Tests
console.log('\n[TEST 5] In-Transit TLS 1.2+ Enforcement & HSTS Headers');

// Test HSTS Header
const mockRes: any = {
  headers: {},
  setHeader(name: string, value: string) {
    this.headers[name] = value;
  },
};
hstsMiddleware({} as any, mockRes, () => {});
assert.strictEqual(
  mockRes.headers['Strict-Transport-Security'],
  'max-age=31536000; includeSubDomains; preload',
  'HSTS header must be set with 1 year max-age and preload'
);
assert.strictEqual(mockRes.headers['X-Content-Type-Options'], 'nosniff');
console.log('✔ HSTS and transport security headers verified');

// Test Non-HTTPS Rejection in Production
process.env.NODE_ENV = 'production';
let rejected = false;
let statusCode = 0;
const mockHttpReq: any = {
  secure: false,
  headers: { 'x-forwarded-proto': 'http' },
  socket: { encrypted: false },
  ip: '127.0.0.1',
  originalUrl: '/api/v2/business/biz-001',
};
const mockRejectRes: any = {
  status(code: number) {
    statusCode = code;
    return this;
  },
  json(body: any) {
    rejected = true;
    return this;
  },
};

enforceHttpsAndTls(mockHttpReq, mockRejectRes, () => {
  assert.fail('Next() should not be called for non-HTTPS request in production');
});
assert.strictEqual(rejected, true, 'Non-HTTPS request must be rejected');
assert.strictEqual(statusCode, 403, 'Non-HTTPS request must return HTTP 403 Forbidden');
console.log('✔ Non-HTTPS request strictly rejected with HTTP 403 in production');

// Clean up
process.env.NODE_ENV = 'test';

console.log('\n========================================');
console.log('✔ ALL SECURITY TESTS PASSED SUCCESSFULLY');
console.log('========================================\n');
