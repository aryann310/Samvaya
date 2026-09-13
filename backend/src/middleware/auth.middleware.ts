import type { Request, Response, NextFunction } from 'express';
import { JwtService } from '../security/jwtService.js';
import type { JwtTokenPayload, UserRole } from '../models/user.model.js';

// Extend Express Request interface to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JwtTokenPayload;
    }
  }
}

/**
 * Middleware that authenticates incoming requests using JWT.
 * Expects header format: Authorization: Bearer <token>
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication token required',
      code: 'AUTH_TOKEN_REQUIRED',
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid Authorization header format. Expected "Bearer <token>"',
      code: 'INVALID_AUTH_FORMAT',
    });
  }

  const token = parts[1];

  try {
    const payload = JwtService.verifyToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized: Token has expired',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(403).json({
      error: 'Forbidden: Invalid token signature or corrupted payload',
      code: 'INVALID_TOKEN',
    });
  }
}

/**
 * Role-Based Access Control middleware.
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]`,
        code: 'INSUFFICIENT_ROLE',
      });
    }

    next();
  };
}
