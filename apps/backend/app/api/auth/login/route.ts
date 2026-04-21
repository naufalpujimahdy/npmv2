import { getUserByEmail, getUserByUsername } from '@/src/models/User';
import { withErrorHandling, ApiError } from '@/src/lib/error-handler';
import { sanitizeUser } from '@/src/lib/auth';
import { generateTokenPair } from '@/src/lib/jwt-refresh';
import { verifyPassword } from '@/src/lib/password';
import { loginLimiter } from '@/src/lib/rate-limiter';
import { loginSchema } from '@/src/lib/validation';
import { parseJsonBody, optionsResponse } from '@/src/lib/api';
import { handleCorsPreFlight } from '@/src/lib/cors';

export async function POST(request: Request) {
  // Handle CORS preflight
  const corsPreFlight = handleCorsPreFlight(request);
  if (corsPreFlight) return corsPreFlight;

  return withErrorHandling(request, async () => {
    // Check rate limit
    const rateLimit = loginLimiter(request);
    if (!rateLimit.allowed) {
      throw new ApiError(
        429,
        'Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit.',
        'RATE_LIMITED',
        {
          'Retry-After': String(rateLimit.retryAfter ?? 60),
        }
      );
    }

    const body = await parseJsonBody(request);
    const validated = loginSchema.parse(body);

    const normalizedEmail = validated.identifier.toLowerCase();
    const user = validated.identifier.includes('@')
      ? await getUserByEmail(normalizedEmail)
      : await getUserByUsername(validated.identifier);

    if (!user || !verifyPassword(validated.password, user.password)) {
      throw new ApiError(401, 'Kredensial login tidak valid.', 'INVALID_CREDENTIALS');
    }

    const { accessToken, refreshToken } = generateTokenPair({
      sub: String(user.id),
      username: user.username,
      email: user.email,
    });

    return [
      {
        accessToken,
        refreshToken,
        user: sanitizeUser(user),
      },
      { status: 200 },
    ];
  });
}

export function OPTIONS(request: Request) {
  const corsPreFlight = handleCorsPreFlight(request);
  if (corsPreFlight) return corsPreFlight;
  return optionsResponse();
}
