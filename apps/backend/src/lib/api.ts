import { NextResponse } from 'next/server';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function jsonResponse(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function errorResponse(status: number, message: string) {
  return jsonResponse({ ok: false, error: message }, { status });
}

/** Simple 204 No Content for OPTIONS — middleware adds CORS headers. */
export function optionsResponse() {
  return new NextResponse(null, { status: 204 });
}

export async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, 'Request body harus berupa JSON yang valid.');
  }
}

export function getAdminApiKeyFromRequest(request: Request) {
  return request.headers.get('x-admin-api-key');
}

export function isAdminRequest(request: Request) {
  const configuredApiKey = process.env.ADMIN_API_KEY;
  if (!configuredApiKey) return false;
  return getAdminApiKeyFromRequest(request) === configuredApiKey;
}

export function requireAdminRequest(request: Request) {
  if (!process.env.ADMIN_API_KEY) {
    throw new ApiError(500, 'ADMIN_API_KEY belum dikonfigurasi di environment backend.');
  }
  if (!isAdminRequest(request)) {
    throw new ApiError(401, 'Akses ditolak. Sertakan header x-admin-api-key yang valid.');
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
