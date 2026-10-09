import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import type { AuthTokenPayload } from '../types/auth.js';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.substring(7).trim();
  const payload = authService.verifyToken(token);
  if (payload) {
    req.user = payload;
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Bạn chưa đăng nhập. Vui lòng cung cấp JWT Bearer Token hợp lệ.',
    });
    return;
  }

  const token = authHeader.substring(7).trim();
  const payload = authService.verifyToken(token);

  if (!payload) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Phiên đăng nhập đã hết hạn hoặc token không hợp lệ.',
    });
    return;
  }

  req.user = payload;
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Bạn không có quyền quản trị viên (Admin) để thực hiện thao tác này.',
      });
      return;
    }
    next();
  });
}
