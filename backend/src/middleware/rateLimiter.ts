import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
}

interface ClientRecord {
  count: number;
  resetTime: number;
}

export function createRateLimiter(options: RateLimitOptions) {
  const clients = new Map<string, ClientRecord>();

  // Periodically clean up expired entries every 5 minutes to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of clients.entries()) {
      if (now > record.resetTime) {
        clients.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    // In test environment, skip rate limiting to avoid breaking automated test suites
    if (process.env.NODE_ENV === 'test') {
      next();
      return;
    }

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    let record = clients.get(ip);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + options.windowMs,
      };
      clients.set(ip, record);
      next();
      return;
    }

    record.count++;

    if (record.count > options.max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      res.status(429).json({
        error: 'Too Many Requests',
        message: options.message,
        retryAfter: retryAfterSeconds,
      });
      return;
    }

    next();
  };
}

// 1. Auth Login: Max 10 attempts per 15 minutes per IP
export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 15 phút.',
});

// 2. Proposal / Pinning: Max 15 proposals per 10 minutes per IP
export const placeProposalRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 15,
  message: 'Bạn gửi đề xuất địa điểm quá nhanh. Vui lòng thử lại sau ít phút.',
});

// 3. Reviews: Max 15 reviews per 10 minutes per IP
export const reviewRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 15,
  message: 'Bạn gửi đánh giá quá nhanh. Vui lòng thử lại sau ít phút.',
});

// 4. Reports: Max 10 reports per 10 minutes per IP
export const reportRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: 'Bạn gửi báo cáo quá nhanh. Vui lòng thử lại sau ít phút.',
});
