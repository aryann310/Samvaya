import type { Request, Response, NextFunction } from 'express';
import type { JwtTokenPayload, UserRole } from '../models/user.model.js';
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
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Role-Based Access Control middleware.
 */
export declare function requireRole(...allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map