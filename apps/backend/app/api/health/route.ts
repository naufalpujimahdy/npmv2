import { NextResponse } from 'next/server';

const hasDatabaseUrl =
  !!process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes('<your_database_url>');

const hasJwtSecret =
  !!process.env.JWT_SECRET &&
  !process.env.JWT_SECRET.includes('<your_jwt_secret>');

export function GET() {
  return NextResponse.json({
    ok: true,
    service: 'backend',
    env: {
      databaseUrlConfigured: hasDatabaseUrl,
      jwtSecretConfigured: hasJwtSecret,
    },
    timestamp: new Date().toISOString(),
  });
}

