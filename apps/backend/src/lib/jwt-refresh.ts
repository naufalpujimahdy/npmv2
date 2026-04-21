import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRY = '15m'; // Short-lived access token
const REFRESH_TOKEN_EXPIRY = '7d'; // Long-lived refresh token

export type TokenPayload = {
  sub: string; // user ID
  username: string;
  email: string;
  type: 'access' | 'refresh';
};

export type DecodedToken = TokenPayload & {
  iat: number;
  exp: number;
};

export function generateAccessToken(payload: Omit<TokenPayload, 'type'>) {
  return sign(
    { ...payload, type: 'access' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

export function generateRefreshToken(userId: string) {
  return sign(
    { sub: userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
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
    if (decoded.type !== 'access') {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): DecodedToken | null {
  try {
    const decoded = verify(token, JWT_SECRET) as DecodedToken;
    if (decoded.type !== 'refresh') {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7); // Remove "Bearer " prefix
}
