import type { Request, Response, NextFunction } from 'express';
/**
 * Sanitized Logger: Guarantees that any log call automatically masks PII
 * (PAN, Aadhaar, Phone, Bank Account) and never leaks plaintext or sensitive variables.
 */
export declare const sanitizedLogger: {
    log: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
};
/**
 * Enforce HTTPS in production. Reject any non-HTTPS request.
 */
export declare function enforceHttpsAndTls(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * HTTP Strict Transport Security (HSTS) and modern transport security headers.
 */
export declare function hstsMiddleware(req: Request, res: Response, next: NextFunction): void;
/**
 * Redaction logging middleware:
 * Intercepts incoming requests and response bodies, redacting PAN, Aadhaar, Phone, and Bank Account details.
 */
export declare function redactedLoggingMiddleware(req: Request, res: Response, next: NextFunction): void;
/**
 * Redacted Global Error Handler:
 * Guarantees error messages and stack traces never leak plaintext Aadhaar, PAN, phone, or bank details.
 */
export declare function redactedErrorHandler(err: any, req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=security.middleware.d.ts.map