// ==============================================================================
// DigiLocker Integration Tests
// Tests Sandbox API flow, CSRF state validation, consent decline, PII encryption,
// and token revocation.
// ==============================================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { DigiLockerService } from '../src/services/digilocker.service.js';
import { encryptPII, decryptPII, maskPanNumber, maskAadhaarNumber, generateSecureStateToken } from '../src/utils/crypto.utils.js';
test('DigiLocker Integration Test Suite', async (t) => {
    await t.test('1. Security & Crypto: AES-256-GCM encryption at rest & decryption', () => {
        const originalName = 'Rameshbhai Patel';
        const encrypted = encryptPII(originalName);
        assert.notEqual(encrypted, originalName, 'Encrypted string must not match plaintext');
        assert.match(encrypted, /^[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/, 'Format must be iv:authTag:ciphertext');
        const decrypted = decryptPII(encrypted);
        assert.equal(decrypted, originalName, 'Decrypted string must match original plaintext');
    });
    await t.test('2. Compliance Guardrails: PAN and Aadhaar number masking', () => {
        const fullPan = 'ABCDE1234F';
        const maskedPan = maskPanNumber(fullPan);
        assert.equal(maskedPan, 'XXXXXX234F', 'PAN must only expose last 4 characters');
        assert.ok(!maskedPan.includes('ABCDE'), 'Must never leak initial PAN characters');
        const fullAadhaar = '123456789012';
        const maskedAadhaar = maskAadhaarNumber(fullAadhaar);
        assert.equal(maskedAadhaar, 'XXXXXXXX9012', 'Aadhaar must only expose last 4 digits');
        assert.ok(!maskedAadhaar.includes('12345678'), 'Must never leak initial Aadhaar digits');
    });
    await t.test('3. Step 2.1: Initiate DigiLocker verification request', async () => {
        const result = await DigiLockerService.initiateVerification({
            userId: 'test-user-001',
            documentType: 'PAN',
            platform: 'web',
        });
        assert.ok(result.requestId.startsWith('req_'), 'Must return valid requestId');
        assert.ok(result.consentUrl.includes('dg-sandbox.setu.co'), 'Must point to sandbox consent URL');
        assert.ok(result.stateToken.length >= 32, 'Must generate secure CSRF state token');
        assert.ok(new Date(result.expiresAt) > new Date(), 'Expiry must be in the future');
        const record = DigiLockerService.getVerificationStatus(result.requestId);
        assert.ok(record, 'Pending record must be persisted in database');
        assert.equal(record?.verificationStatus, 'initiated');
        assert.equal(record?.tokenRevoked, false);
    });
    await t.test('4. Step 2.2: Callback CSRF validation (Security Test)', async () => {
        // Initiate request
        const init = await DigiLockerService.initiateVerification({
            userId: 'test-user-002',
            documentType: 'PAN',
        });
        // Try to trigger callback with WRONG state token (CSRF attempt)
        const attackerState = generateSecureStateToken();
        await assert.rejects(async () => {
            await DigiLockerService.handleCallback({
                requestId: init.requestId,
                state: attackerState, // Invalid state
                status: 'success',
            });
        }, /Security Error: Invalid or mismatched state token/, 'Must reject forged state token with CSRF security error');
        const record = DigiLockerService.getVerificationStatus(init.requestId);
        assert.equal(record?.verificationStatus, 'failed', 'Record status must become failed upon CSRF attack');
    });
    await t.test('5. Step 2.2: Callback handling when user declines consent', async () => {
        const init = await DigiLockerService.initiateVerification({
            userId: 'test-user-003',
            documentType: 'PAN',
            platform: 'mobile',
        });
        const callbackRes = await DigiLockerService.handleCallback({
            requestId: init.requestId,
            state: init.stateToken, // Valid state
            status: 'denied',
            errorReason: 'user_declined',
        });
        assert.equal(callbackRes.verification.verificationStatus, 'denied');
        assert.ok(callbackRes.redirectTarget.includes('status=denied'), 'Mobile redirect must convey denied status');
    });
    await t.test('6. Step 2.2 - 2.4: Successful verification, document retrieval & automatic token revocation', async () => {
        const init = await DigiLockerService.initiateVerification({
            userId: 'test-user-004',
            documentType: 'PAN',
            platform: 'web',
        });
        // Valid callback
        const callbackRes = await DigiLockerService.handleCallback({
            requestId: init.requestId,
            state: init.stateToken,
            status: 'success',
        });
        assert.equal(callbackRes.verification.verificationStatus, 'authenticated');
        assert.ok(callbackRes.redirectTarget.includes('kyc=success'));
        // Step 2.3: Server-to-server pull
        const docData = await DigiLockerService.fetchVerifiedDocuments(init.requestId);
        assert.equal(docData.documentType, 'PAN');
        assert.equal(docData.verifiedName, 'Rameshbhai Patel');
        assert.equal(docData.panNumberMasked, 'XXXXXX234F', 'Must return masked PAN only');
        assert.equal(docData.digitalSignatureValid, true);
        assert.equal(docData.tokenRevoked, true, 'Token must be revoked immediately after document pull');
        // Verify storage in DataStore: full PAN or tokens must NOT be stored
        const storedRecord = DigiLockerService.getVerificationStatus(init.requestId);
        assert.ok(storedRecord?.verifiedNameEncrypted, 'PII must be encrypted in storage');
        assert.notEqual(storedRecord?.verifiedNameEncrypted, 'Rameshbhai Patel', 'Plaintext PII must not be in storage');
        assert.equal(storedRecord?.panNumberMasked, 'XXXXXX234F');
        assert.equal(storedRecord?.accessToken, undefined, 'Access token must never be in storage');
    });
    await t.test('7. Step 2.4: Explicit token revocation endpoint', async () => {
        const revokeRes = await DigiLockerService.revokeToken('req_test_123');
        assert.equal(revokeRes.success, true);
    });
});
//# sourceMappingURL=digilocker.test.js.map