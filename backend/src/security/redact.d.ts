/**
 * Redaction utility for masking sensitive data before logging or error handling.
 * Never logs sensitive PII (PAN, Aadhaar, Phone, Bank Account) in plaintext.
 */
/**
 * Mask PAN: e.g. ABCDE1234F -> XXXXX1234F
 */
export declare function maskPAN(val: string): string;
/**
 * Mask Aadhaar: e.g. 123456789012 -> XXXXXXXX9012
 */
export declare function maskAadhaar(val: string): string;
/**
 * Mask Phone: e.g. 9876543210 -> XXXXXX3210
 */
export declare function maskPhone(val: string): string;
/**
 * Mask Bank Account Number: e.g. 50100234567890 -> XXXXXXXXXX7890
 */
export declare function maskBankAccount(val: string): string;
/**
 * Mask IFSC Code: e.g. HDFC0001234 -> HDFCXXXX234
 */
export declare function maskIFSC(val: string): string;
/**
 * Redacts a raw string (e.g. log message, error message, stack trace)
 */
export declare function redactString(str: string): string;
/**
 * Recursively redacts sensitive keys and values in any object/array/primitive.
 * Handles circular references safely.
 */
export declare function redactSensitiveData<T = any>(input: T, seen?: WeakSet<WeakKey>): T;
//# sourceMappingURL=redact.d.ts.map