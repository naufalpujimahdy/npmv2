/**
 * CORS configuration.
 * The actual CORS enforcement is handled by middleware.ts.
 * This file only exports the allowed-origins logic so it can be reused if needed.
 */
export function getAllowedOrigins(): string[] {
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
