import { getUserByEmail, getUserByUsername } from '@/src/modules/auth/model';
import { withErrorHandling, ApiError } from '@/src/lib/error-handler';
import { sanitizeUser, generateTokenPair, verifyPassword } from '@/src/modules/auth/service';
import { loginLimiter } from '@/src/lib/rate-limiter';
import { loginSchema } from '@/src/lib/validation';
import { parseJsonBody } from '@/src/lib/api';

export async function POST(request: Request) {
  return withErrorHandling(request, async () => {
    const rateLimit = loginLimiter(request);
    if (!rateLimit.allowed) {
      throw new ApiError(
        429,
        'Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit.',
        'RATE_LIMITED',
        { 'Retry-After': String(rateLimit.retryAfter ?? 60) }
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

    return [{ accessToken, refreshToken, user: sanitizeUser(user) }, { status: 200 }];
  });
}
