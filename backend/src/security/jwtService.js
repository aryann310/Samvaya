import jwt from 'jsonwebtoken';
import { secretsManager } from './secretsManager.js';
export class JwtService {
    static DEFAULT_EXPIRY = '24h';
    /**
     * Generates a signed JWT token containing the user identity claims.
     * Key is securely retrieved from the Secrets Manager.
     */
    static generateToken(user, expiresIn = this.DEFAULT_EXPIRY) {
        const secret = secretsManager.getJwtSecretSync();
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            businessId: user.businessId,
            name: user.name,
        };
        return jwt.sign(payload, secret, {
            algorithm: 'HS256',
            expiresIn: expiresIn,
        });
    }
    /**
     * Verifies the JWT signature and returns the decoded payload.
     * Throws if token has expired, signature is invalid, or payload is malformed.
     */
    static verifyToken(token) {
        const secret = secretsManager.getJwtSecretSync();
        const decoded = jwt.verify(token, secret, {
            algorithms: ['HS256'],
        });
        if (typeof decoded !== 'object' || !decoded || !('userId' in decoded)) {
            throw new Error('Invalid token payload structure');
        }
        return decoded;
    }
}
//# sourceMappingURL=jwtService.js.map