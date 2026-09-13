export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'entrepreneur' | 'admin' | 'advisor' | 'collaborator';
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  phone: string;
  password: string;
  businessName?: string;
  role?: 'entrepreneur' | 'admin' | 'advisor';
}

export interface AuthResponse {
  message?: string;
  user: User;
  token: string;
}
