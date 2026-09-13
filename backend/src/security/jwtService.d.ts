import type { SanitizedUser, JwtTokenPayload } from '../models/user.model.js';
export declare class JwtService {
    private static readonly DEFAULT_EXPIRY;
    /**
     * Generates a signed JWT token containing the user identity claims.
     * Key is securely retrieved from the Secrets Manager.
     */
    static generateToken(user: SanitizedUser, expiresIn?: string): string;
    /**
     * Verifies the JWT signature and returns the decoded payload.
     * Throws if token has expired, signature is invalid, or payload is malformed.
     */
    static verifyToken(token: string): JwtTokenPayload;
}
//# sourceMappingURL=jwtService.d.ts.map