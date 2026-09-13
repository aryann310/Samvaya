import assert from 'assert';
import { UserDAL } from '../dal/userDal.js';
import { JwtService } from '../security/jwtService.js';
import { UserService } from '../services/userService.js';
import { secretsManager } from '../security/secretsManager.js';
import { FieldEncryption } from '../security/encryption.js';
import { redactSensitiveData } from '../security/redact.js';

async function runAuthTests() {
  console.log('--- STARTING COMPREHENSIVE AUTHENTICATION & JWT TEST SUITE ---\n');

  // TEST 1: Password Hashing & Salt Verification
  console.log('1. Testing Bcrypt Password Hashing & Verification:');
  const password = 'SuperKiranaPassword!@#123';
  const hash1 = await UserDAL.hashPassword(password);
  const hash2 = await UserDAL.hashPassword(password);

  assert.notStrictEqual(hash1, hash2, 'Salting must ensure identical passwords yield different hashes');
  assert.strictEqual(await UserDAL.verifyPassword(password, hash1), true, 'Valid password must verify');
  assert.strictEqual(await UserDAL.verifyPassword('WrongPassword123', hash1), false, 'Wrong password must be rejected');
  console.log('   ✔ Password hashing with salt verified successfully.');

  // TEST 2: JWT Token Generation, Verification, & Tamper Resistance
  console.log('\n2. Testing JWT Token Signing & Tamper Verification:');
  const testUser = {
    id: 'usr-test-999',
    name: 'Test Entrepreneur',
    email: 'test.owner@samvaya.in',
    phone: '+91 98765 11111',
    role: 'entrepreneur' as const,
    businessId: 'biz-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const token = JwtService.generateToken(testUser);
  assert.ok(typeof token === 'string' && token.split('.').length === 3, 'JWT must be a valid 3-segment string');

  const payload = JwtService.verifyToken(token);
  assert.strictEqual(payload.userId, testUser.id, 'Decoded token must match user id');
  assert.strictEqual(payload.email, testUser.email, 'Decoded token must match email');
  assert.strictEqual(payload.role, 'entrepreneur', 'Decoded token must match role');

  // Tamper resistance: modify the token payload or signature
  const parts = token.split('.');
  const tamperedToken = `${parts[0]}.${parts[1]}.tamperedSignature`;
  assert.throws(() => {
    JwtService.verifyToken(tamperedToken);
  }, 'Tampered JWT signature must be rejected and throw');
  console.log('   ✔ JWT signing and cryptographic tamper verification confirmed.');

  // TEST 3: User Authentication via Service
  console.log('\n3. Testing User Authentication Service:');
  const authSuccess = await UserService.authenticate({
    email: 'patel@samvaya.in',
    password: 'kirana123',
  });
  assert.ok(authSuccess, 'Seeded user patel@samvaya.in must authenticate successfully');
  assert.strictEqual(authSuccess.email, 'patel@samvaya.in', 'Authenticated user email matches');
  assert.strictEqual((authSuccess as any).passwordHash, undefined, 'Sanitized user must NOT contain passwordHash');

  const authWrongPass = await UserService.authenticate({
    email: 'patel@samvaya.in',
    password: 'incorrectPassword',
  });
  assert.strictEqual(authWrongPass, null, 'Authentication with wrong password must return null');

  const authNonExistent = await UserService.authenticate({
    email: 'nonexistent@samvaya.in',
    password: 'anyPassword',
  });
  assert.strictEqual(authNonExistent, null, 'Authentication with nonexistent email must return null');
  console.log('   ✔ User authentication service credentials checks verified.');

  // TEST 4: Registration, Duplicate Rejection, and Field-Level Encryption
  console.log('\n4. Testing User Registration & PII Field-Level Encryption:');
  const uniqueSuffix = Date.now().toString().slice(-4);
  const newEmail = `user_${uniqueSuffix}@samvaya.in`;
  const rawPhone = '+91 91234 56789';

  const newUser = await UserService.createUser({
    name: 'New Trader',
    email: newEmail,
    phone: rawPhone,
    password: 'passwordSecret789',
    businessName: 'New Trading Hub',
  });

  assert.ok(newUser.id, 'New user receives unique user id');
  assert.strictEqual(newUser.email, newEmail, 'New user email recorded');
  assert.strictEqual(newUser.phone, rawPhone, 'Phone number returned in plaintext to caller after write');

  // Duplicate email prevention
  await assert.rejects(async () => {
    await UserService.createUser({
      name: 'Duplicate Trader',
      email: newEmail,
      phone: rawPhone,
      password: 'passwordSecret789',
    });
  }, /User already exists/, 'Duplicate email must be rejected with conflict error');

  // Verify Phone Encryption at rest on disk
  const fs = await import('fs');
  const path = await import('path');
  const usersPath = path.resolve('src/data/users.json');
  const storedJson = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  const storedUser = storedJson.find((u: any) => u.email === newEmail);

  assert.ok(storedUser, 'User must be persisted in users.json');
  assert.ok(storedUser.phone.startsWith('enc:v1:'), 'Phone number in storage must be encrypted with enc:v1: prefix');
  assert.notStrictEqual(storedUser.phone, rawPhone, 'Phone number must NOT be stored in plaintext');

  // Verify decryption using master key
  const key = secretsManager.getFieldEncryptionKeySync();
  const decryptedPhone = FieldEncryption.decrypt(storedUser.phone, key);
  assert.strictEqual(decryptedPhone, rawPhone, 'Decrypted stored phone must match original plaintext');
  console.log('   ✔ Registration and field-level AES-256-GCM encryption verified.');

  // TEST 5: Redaction of Sensitive Auth Payloads in Logs
  console.log('\n5. Testing Redaction of Auth Credentials and Tokens:');
  const sensitiveAuthPayload = {
    email: 'trader@samvaya.in',
    password: 'secret_plain_password_123',
    token: token,
    authorization: `Bearer ${token}`,
    phone: '+91 98765 43210',
  };

  const redacted = redactSensitiveData(sensitiveAuthPayload);
  assert.strictEqual(redacted.password, '[REDACTED]', 'Password must be masked in logs');

  assert.strictEqual(redacted.token, '[REDACTED]', 'Token must be masked in logs');
  assert.strictEqual(redacted.authorization, '[REDACTED]', 'Authorization header must be masked in logs');
  assert.strictEqual(redacted.phone, 'XXXXXX3210', 'Phone number must be masked in logs');
  console.log('   ✔ Sensitive auth credentials and tokens properly redacted from logging.');

  console.log('\n======================================================');
  console.log('🎉 ALL AUTHENTICATION & JWT SECURITY TESTS PASSED (5/5)');
  console.log('======================================================\n');
}

runAuthTests().catch((err) => {
  console.error('❌ Auth test failure:', err);
  process.exit(1);
});
