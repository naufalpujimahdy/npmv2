import { sign, verify } from 'jsonwebtoken';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { User } from '@prisma/client';
import { ApiError } from '../../lib/api';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// ── Types ─────────────────────────────────────────────────────────────────────

export type TokenPayload = {
  sub: string;
  username: string;
  email: string;
  type: 'access' | 'refresh';
};

export type DecodedToken = TokenPayload & {
  iat: number;
  exp: number;
};

// ── JWT ───────────────────────────────────────────────────────────────────────

export function generateAccessToken(payload: Omit<TokenPayload, 'type'>) {
  return sign({ ...payload, type: 'access' }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(userId: string) {
  return sign({ sub: userId, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function generateTokenPair(payload: Omit<TokenPayload, 'type'>) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload.sub),
  };
}

export function verifyAccessToken(token: string): DecodedToken | null {
  try {
    const decoded = verify(token, JWT_SECRET) as DecodedToken;
    return decoded.type === 'access' ? decoded : null;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): DecodedToken | null {
  try {
    const decoded = verify(token, JWT_SECRET) as DecodedToken;
    return decoded.type === 'refresh' ? decoded : null;
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

// ── Password ──────────────────────────────────────────────────────────────────

const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedPassword: string) {
  const [salt, originalHash] = storedPassword.split(':');
  if (!salt || !originalHash) return false;
  const derivedHash = scryptSync(password, salt, KEY_LENGTH);
  const originalBuffer = Buffer.from(originalHash, 'hex');
  if (derivedHash.length !== originalBuffer.length) return false;
  return timingSafeEqual(derivedHash, originalBuffer);
}

// ── User helpers ──────────────────────────────────────────────────────────────

export function sanitizeUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function getBearerToken(request: Request) {
  const authorization = request.headers.get('authorization');
  return authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : null;
}

export function requireAuthToken(request: Request) {
  const token = getBearerToken(request);
  if (!token) throw new ApiError(401, 'Authorization Bearer token wajib disertakan.');
  const payload = verifyAccessToken(token);
  if (!payload) throw new ApiError(401, 'Token login tidak valid atau sudah kedaluwarsa.');
  return payload;
}
