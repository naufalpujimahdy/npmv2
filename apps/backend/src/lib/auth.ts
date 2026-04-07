import type { User } from '@prisma/client';

import { ApiError } from './api';
import { verifyToken } from './jwt';

type AuthTokenPayload = {
  sub: string;
  username: string;
  email: string;
  iat?: number;
  exp?: number;
};

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

  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length).trim();
}

export function requireAuthToken(request: Request) {
  const token = getBearerToken(request);

  if (!token) {
    throw new ApiError(401, 'Authorization Bearer token wajib disertakan.');
  }

  try {
    return verifyToken(token) as AuthTokenPayload;
  } catch {
    throw new ApiError(401, 'Token login tidak valid atau sudah kedaluwarsa.');
  }
}
