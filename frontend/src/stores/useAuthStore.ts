import { create } from 'zustand';
import type { User } from '../types/auth';
import { authService } from '../services/authService';

interface AuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoginModalOpen: boolean;
  isLoading: boolean;
  error: string | null;

  setLoginModalOpen: (open: boolean) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const TOKEN_KEY = 'connecthub_auth_token';
const USER_KEY = 'connecthub_auth_user';

const getInitialToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const getInitialUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialToken = getInitialToken();
const initialUser = getInitialUser();

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken && !!initialUser,
  isAdmin: initialUser?.role === 'admin',
  isLoginModalOpen: false,
  isLoading: false,
  error: null,

  setLoginModalOpen: (open: boolean) => {
    set({ isLoginModalOpen: open, error: null });
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.login(username, password);
      
      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));

      set({
        token: result.token,
        user: result.user,
        isAuthenticated: true,
        isAdmin: result.user.role === 'admin',
        isLoading: false,
        error: null,
        isLoginModalOpen: false,
      });

      return true;
    } catch (err: any) {
      console.error('[AuthStore] Login failed:', err);
      set({
        isLoading: false,
        error: err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.',
      });
      return false;
    }
  },

  logout: () => {
    try {
      authService.logout();
    } catch {
      // ignore
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      error: null,
    });
  },

  checkAuth: async () => {
    const currentToken = get().token;
    if (!currentToken) return;

    try {
      const user = await authService.getMe();
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
      });
    } catch {
      // Token might be expired or invalid
      get().logout();
    }
  },
}));
