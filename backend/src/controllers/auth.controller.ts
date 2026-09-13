import type { Request, Response } from 'express';
import { getDatabase } from '../db/connection.js';
import { isMongoMode } from '../db/config.js';
import crypto from 'crypto';

// Simple token generation (no heavy JWT library needed for hackathon)
function generateToken(payload: Record<string, string>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 86400000 })).toString('base64url');
  const secret = process.env.JWT_SECRET || 'samvaya-hackathon-secret-2024';
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): Record<string, any> | null {
  try {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) return null;
    const secret = process.env.JWT_SECRET || 'samvaya-hackathon-secret-2024';
    const expectedSig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ success: false, error: 'Email or phone is required' });
  }
  if (!password) {
    return res.status(400).json({ success: false, error: 'Password is required' });
  }

  try {
    let business: any = null;

    if (isMongoMode()) {
      const db = getDatabase();
      // Look up business by owner email or phone
      business = await db.collection('businesses').findOne({
        $or: [
          { 'owner.email': email },
          { 'owner.phone': phone }
        ]
      });
    }

    // Fallback: if not found in Mongo or in demo mode, use seeded demo data
    if (!business) {
      // Accept the seeded demo credentials
      const demoEmail = 'arvind.patel@example.com';
      const demoPhone = '9876543210';
      const demoPassword = 'samvaya123';

      const emailMatch = email && email.toLowerCase() === demoEmail;
      const phoneMatch = phone && phone === demoPhone;

      if ((emailMatch || phoneMatch) && password === demoPassword) {
        business = {
          _id: 'biz-001',
          legacyId: 'biz-001',
          name: 'Shree Ganesh Kirana Store',
          owner: {
            name: 'Arvindbhai Patel',
            email: demoEmail,
            phone: demoPhone,
          }
        };
      }
    }

    if (!business) {
      return res.status(401).json({ success: false, error: 'Invalid credentials. Please check your email/phone and password.' });
    }

    // For hackathon, we accept any password for Mongo-found users
    // In production, you'd hash & compare passwords

    const businessId = business.legacyId || business._id?.toString() || 'biz-001';
    const token = generateToken({
      businessId,
      email: business.owner?.email || email,
      name: business.owner?.name || 'User'
    });

    res.json({
      success: true,
      data: {
        token,
        businessId,
        user: {
          name: business.owner?.name || 'User',
          email: business.owner?.email || email,
          phone: business.owner?.phone || phone,
          businessName: business.name || 'Business',
        }
      }
    });
  } catch (err: any) {
    console.error('[Auth] Login error:', err.message);
    res.status(500).json({ success: false, error: 'Authentication service error' });
  }
};

export const verifySession = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Malformed token' });
  }
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }

  res.json({
    success: true,
    data: {
      businessId: payload.businessId,
      email: payload.email,
      name: payload.name,
    }
  });
};
