export type UserRole = 'admin' | 'surveyor';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  studentId?: string;
  phone?: string;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoginModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
}
