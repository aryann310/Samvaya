export type UserRole = 'entrepreneur' | 'admin' | 'advisor' | 'collaborator';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string; // PII: Encrypted with AES-256-GCM at rest
  passwordHash: string; // Hashed with bcrypt (12 rounds)
  role: UserRole;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export type SanitizedUser = Omit<User, 'passwordHash'>;

export interface SignupDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  businessName?: string | undefined;
  role?: UserRole | undefined;
}


export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: SanitizedUser;
  token: string;
}

export interface JwtTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  businessId: string;
  name: string;
  iat?: number;
  exp?: number;
}
