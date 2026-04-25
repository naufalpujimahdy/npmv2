import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Parses allowed origins from env.
 * Production: ALLOWED_ORIGINS (comma-separated) or FRONTEND_URL.
 * Development: adds localhost variants automatically.
 */
function getAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS ?? process.env.FRONTEND_URL ?? '';
  const configured = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV === 'production') {
    return configured;
  }

  return [
    ...new Set([
      ...configured,
      'http://localhost:3001',
      'http://localhost:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000',
    ]),
  ];
}

const ALLOW_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
const ALLOW_HEADERS = 'Content-Type, Authorization, X-Requested-With';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');

  // Non-browser request (curl, server-to-server) — no Origin header, pass through
  if (!origin) {
    return NextResponse.next();
  }

  const allowed = getAllowedOrigins();
  const isAllowed = allowed.includes(origin);

  // ── Preflight ────────────────────────────────────────
  if (request.method === 'OPTIONS') {
    const headers: Record<string, string> = {
      'Access-Control-Allow-Methods': ALLOW_METHODS,
      'Access-Control-Allow-Headers': ALLOW_HEADERS,
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };

    if (isAllowed) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Credentials'] = 'true';
    }

    return new NextResponse(null, { status: 204, headers });
  }

  // ── Actual request — inject CORS headers into response ─
  const response = NextResponse.next();

  response.headers.set('Vary', 'Origin');

  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
