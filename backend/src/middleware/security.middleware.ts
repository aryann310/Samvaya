import type { Request, Response, NextFunction } from 'express';
import { redactSensitiveData, redactString } from '../security/redact.js';

/**
 * Sanitized Logger: Guarantees that any log call automatically masks PII
 * (PAN, Aadhaar, Phone, Bank Account) and never leaks plaintext or sensitive variables.
 */
export const sanitizedLogger = {
  log: (...args: any[]) => {
    const sanitized = args.map((arg) => redactSensitiveData(arg));
    console.log(...sanitized);
  },
  info: (...args: any[]) => {
    const sanitized = args.map((arg) => redactSensitiveData(arg));
    console.info(...sanitized);
  },
  warn: (...args: any[]) => {
    const sanitized = args.map((arg) => redactSensitiveData(arg));
    console.warn(...sanitized);
  },
  error: (...args: any[]) => {
    const sanitized = args.map((arg) => redactSensitiveData(arg));
    console.error(...sanitized);
  },
};

/**
 * Enforce HTTPS in production. Reject any non-HTTPS request.
 */
export function enforceHttpsAndTls(req: Request, res: Response, next: NextFunction) {
  const isProduction = process.env.NODE_ENV === 'production';
  const forwardedProto = req.headers['x-forwarded-proto'];
  const isSocketEncrypted = Boolean((req.socket as any)?.encrypted);
  const isHttps = Boolean(req.secure || forwardedProto === 'https' || isSocketEncrypted);

  if (isProduction && !isHttps) {
    sanitizedLogger.warn(`[SECURITY] Rejected non-HTTPS request from IP: ${req.ip} to ${req.originalUrl}`);
    return res.status(403).json({
      success: false,
      error: 'HTTPS Required: Plaintext HTTP connections are strictly rejected in production. Enforcing TLS 1.2+.',
    });
  }

  next();
}

/**
 * HTTP Strict Transport Security (HSTS) and modern transport security headers.
 */
export function hstsMiddleware(req: Request, res: Response, next: NextFunction) {
  // HSTS: 1 year, including subdomains and preload list
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
}

/**
 * Redaction logging middleware:
 * Intercepts incoming requests and response bodies, redacting PAN, Aadhaar, Phone, and Bank Account details.
 */
export function redactedLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const originalSend = res.send;

  // Mask incoming request body, query, and params before logging
  const safeBody = req.body ? redactSensitiveData(req.body) : undefined;
  const safeQuery = Object.keys(req.query).length > 0 ? redactSensitiveData(req.query) : undefined;

  sanitizedLogger.info(`[HTTP REQUEST] ${req.method} ${req.originalUrl}`, {
    query: safeQuery,
    body: safeBody,
  });

  // Intercept response to sanitize any outgoing logs
  res.send = function (body?: any): Response {
    const duration = Date.now() - start;
    let safeResponse: any;
    try {
      if (typeof body === 'string') {
        safeResponse = redactString(body);
      } else {
        safeResponse = redactSensitiveData(body);
      }
    } catch {
      safeResponse = '[Redaction Error: Unparseable payload]';
    }

    sanitizedLogger.info(`[HTTP RESPONSE] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
    return originalSend.call(this, body);
  };

  next();
}

/**
 * Redacted Global Error Handler:
 * Guarantees error messages and stack traces never leak plaintext Aadhaar, PAN, phone, or bank details.
 */
export function redactedErrorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const sanitizedErr = redactSensitiveData(err);

  sanitizedLogger.error(`[UNHANDLED ERROR] on ${req.method} ${req.originalUrl}:`, sanitizedErr);

  const statusCode = err.status || err.statusCode || 500;
  const safeMessage = typeof err.message === 'string' ? redactString(err.message) : 'An internal server error occurred';

  res.status(statusCode).json({
    success: false,
    error: safeMessage,
    // Only include sanitized stack trace in development
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack ? redactString(err.stack) : undefined,
    }),
  });
}
