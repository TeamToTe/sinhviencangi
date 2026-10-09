import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { config } from '../config.js';
import type { User, AuthTokenPayload, LoginResponse, UserRole } from '../types/auth.js';

export function mapRowToUser(row: any): User {
  return {
    id: Number(row.id),
    username: row.username,
    fullName: row.full_name,
    role: (row.role || 'surveyor') as UserRole,
    email: row.email || undefined,
    avatar: row.avatar || undefined,
    isActive: Boolean(row.is_active),
    lastLogin: row.last_login ? new Date(row.last_login).toISOString() : undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export const authService = {
  /**
   * Authenticate user with bcrypt hash comparison & generate signed JWT
   */
  async login(usernameInput: string, passwordInput: string): Promise<LoginResponse> {
    const username = (usernameInput || '').trim().toLowerCase();
    const password = passwordInput || '';

    if (!username || !password) {
      throw new Error('Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.');
    }

    const res = await db.query(
      'SELECT * FROM users WHERE LOWER(username) = $1',
      [username]
    );

    if (res.rows.length === 0) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
    }

    const userRow = res.rows[0];

    if (!userRow.is_active) {
      throw new Error('Tài khoản này hiện đang bị khóa. Vui lòng liên hệ Admin.');
    }

    const isMatch = await bcrypt.compare(password, userRow.password_hash);
    if (!isMatch) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
    }

    // Update last_login
    await db.query(
      db.isPostgres
        ? 'UPDATE users SET last_login = NOW() WHERE id = $1'
        : "UPDATE users SET last_login = datetime('now') WHERE id = $1",
      [userRow.id]
    );

    const user = mapRowToUser(userRow);

    const payload: AuthTokenPayload = {
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });

    return {
      token,
      user,
      expiresIn: '7d',
    };
  },

  /**
   * Verify JWT Token and decode payload
   */
  verifyToken(token: string): AuthTokenPayload | null {
    try {
      return jwt.verify(token, config.jwtSecret) as AuthTokenPayload;
    } catch {
      return null;
    }
  },

  /**
   * Get user profile by ID
   */
  async getUserById(id: number): Promise<User | null> {
    const res = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return mapRowToUser(res.rows[0]);
  },

  /**
   * Get list of all registered team members & admins
   */
  async getAllUsers(): Promise<User[]> {
    const res = await db.query('SELECT * FROM users ORDER BY id ASC');
    return res.rows.map(mapRowToUser);
  },

  /**
   * Change user password securely
   */
  async changePassword(userId: number, oldPass: string, newPass: string): Promise<boolean> {
    if (!newPass || newPass.length < 6) {
      throw new Error('Mật khẩu mới phải có tối thiểu 6 ký tự.');
    }

    const res = await db.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (res.rows.length === 0) {
      throw new Error('Người dùng không tồn tại.');
    }

    const currentHash = res.rows[0].password_hash;
    const isMatch = await bcrypt.compare(oldPass, currentHash);
    if (!isMatch) {
      throw new Error('Mật khẩu hiện tại không chính xác.');
    }

    const newHash = await bcrypt.hash(newPass, 10);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, userId]);
    return true;
  },
};
