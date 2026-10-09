import { Router, Response } from 'express';
import { authService } from '../services/authService.js';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({
      error: 'Authentication Error',
      message: err.message || 'Đăng nhập thất bại.',
    });
  }
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized', message: 'Chưa đăng nhập.' });
      return;
    }
    const user = await authService.getUserById(req.user.userId);
    if (!user) {
      res.status(404).json({ error: 'Not Found', message: 'Người dùng không tồn tại.' });
      return;
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// GET /api/auth/users (Danh sách 6 thành viên & Admin - Chỉ Admin)
authRouter.get('/users', requireAdmin, async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// POST /api/auth/change-password
authRouter.post('/change-password', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await authService.changePassword(req.user.userId, oldPassword, newPassword);
    res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err: any) {
    res.status(400).json({ error: 'Bad Request', message: err.message });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Đăng xuất thành công.' });
  return Promise.resolve();
});
