import rateLimit from 'express-rate-limit';

// In-memory store for rate limiting (suitable for single-server development)
// For production with multiple servers, use Redis
const store = new Map<string, { count: number; resetTime: number }>();

export function createRateLimiter(
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  maxRequests: number = 5
) {
  return (request: Request): { allowed: boolean; remaining: number; retryAfter?: number } => {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const now = Date.now();
    const key = ip;

    let record = store.get(key);

    if (!record || record.resetTime < now) {
      // Create new record or reset existing one
      record = {
        count: 0,
        resetTime: now + windowMs,
      };
      store.set(key, record);
    }

    record.count++;

    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfter,
      };
    }

    return {
      allowed: true,
      remaining: maxRequests - record.count,
    };
  };
}

// Cleanup old records every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetTime < now) {
      store.delete(key);
    }
  }
}, 60 * 60 * 1000);

export const loginLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5 // 5 attempts
);

export const registerLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3 // 3 attempts
);
