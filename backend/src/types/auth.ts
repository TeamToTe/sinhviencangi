export type UserRole = 'admin' | 'surveyor';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AuthTokenPayload {
  userId: number;
  username: string;
  fullName: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: string;
}
