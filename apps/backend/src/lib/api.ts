import { NextResponse } from 'next/server';

const ADMIN_API_KEY_HEADER = 'x-admin-api-key';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, x-admin-api-key',
    Vary: 'Origin',
  };
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function jsonResponse(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...getCorsHeaders(),
      ...(init?.headers ?? {}),
    },
  });
}

export function errorResponse(status: number, message: string) {
  return jsonResponse(
    {
      ok: false,
      error: message,
    },
    { status }
  );
}

export function optionsResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

export async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, 'Request body harus berupa JSON yang valid.');
  }
}

export function getAdminApiKeyFromRequest(request: Request) {
  return request.headers.get(ADMIN_API_KEY_HEADER);
}

export function isAdminRequest(request: Request) {
  const configuredApiKey = process.env.ADMIN_API_KEY;

  if (!configuredApiKey) {
    return false;
  }

  return getAdminApiKeyFromRequest(request) === configuredApiKey;
}

export function requireAdminRequest(request: Request) {
  if (!process.env.ADMIN_API_KEY) {
    throw new ApiError(
      500,
      'ADMIN_API_KEY belum dikonfigurasi di environment backend.'
    );
  }

  if (!isAdminRequest(request)) {
    throw new ApiError(
      401,
      'Akses ditolak. Sertakan header x-admin-api-key yang valid.'
    );
  }
}

export async function withErrorHandling<T>(
  handler: () => Promise<T> | T
): Promise<T | NextResponse> {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.status, error.message);
    }

    console.error(error);

    return errorResponse(500, 'Terjadi kesalahan internal pada server.');
  }
}
