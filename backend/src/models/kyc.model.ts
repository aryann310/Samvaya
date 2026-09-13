// ==============================================================================
// DigiLocker / KYC Verification Data Models & Audit Trail
// Complies with DPDP Act 2023 & RBI KYC Data Minimization Guidelines
// ==============================================================================

export type KycVerificationStatus = 
  | 'initiated' 
  | 'authenticated' 
  | 'denied' 
  | 'expired' 
  | 'failed';

export type SupportedDocumentType = 
  | 'PAN' 
  | 'AADHAAR' 
  | 'DRIVING_LICENSE' 
  | 'VOTER_ID';

export interface ConsentAuditTrail {
  consentId: string;
  userId: string;
  requestId: string;
  consentTimestamp: string;
  consentScope: string[];
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
  status: 'granted' | 'revoked' | 'denied';
}

export interface KycVerification {
  requestId: string;
  /** Setu DigiLocker request UUID when running in live mode */
  setuRequestId?: string | undefined;
  userId: string;
  documentType: SupportedDocumentType;
  verificationStatus: KycVerificationStatus;
  
  // Encrypted PII Fields (Stored as AES-256-GCM ciphertexts)
  verifiedNameEncrypted: string;
  verifiedDOBEncrypted: string;
  
  // Strict Masking (Never store full PAN or Aadhaar numbers)
  panNumberMasked?: string | undefined;
  aadhaarNumberMasked?: string | undefined;
  
  // Verification Validity Flag
  digitalSignatureValid: boolean;
  
  // Audit and Lifecycle Tracking
  consentTimestamp?: string | undefined;
  consentScope: string[];
  platform: 'web' | 'mobile';
  stateToken: string;
  redirectUrl: string;
  errorMessage?: string | undefined;
  tokenRevoked: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface VerifiedDocumentResponse {
  requestId: string;
  userId: string;
  documentType: SupportedDocumentType;
  verificationStatus: KycVerificationStatus;
  verifiedName: string;
  verifiedDOB?: string | undefined;
  panNumberMasked?: string | undefined;
  digitalSignatureValid: boolean;
  consentTimestamp?: string | undefined;
  consentScope: string[];
  tokenRevoked: boolean;
}
