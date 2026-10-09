import { request } from './apiClient';
import type { LoginResponse, User } from '../types/auth';

export const authService = {
  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(): Promise<User> {
    return request<User>('/auth/me');
  },

  /**
   * List all seeded team accounts (Admin only)
   */
  async getAllUsers(): Promise<User[]> {
    return request<User[]>('/auth/users');
  },

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
  },
};
