import { getUserById } from '@/src/models/User';
import { withErrorHandling, ApiError } from '@/src/lib/error-handler';
import { sanitizeUser } from '@/src/lib/auth';
import { generateAccessToken, verifyRefreshToken, extractTokenFromHeader } from '@/src/lib/jwt-refresh';
import { parseJsonBody, optionsResponse } from '@/src/lib/api';
import { corsHeaders, handleCorsPreFlight } from '@/src/lib/cors';

export async function POST(request: Request) {
  const corsPreFlight = handleCorsPreFlight(request);
  if (corsPreFlight) return corsPreFlight;

  return withErrorHandling(request, async () => {
    const body = await parseJsonBody(request);
    const refreshToken = typeof body.refreshToken === 'string' ? body.refreshToken : null;

    if (!refreshToken) {
      throw new ApiError(400, 'Refresh token wajib diisi.', 'MISSING_REFRESH_TOKEN');
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new ApiError(401, 'Refresh token tidak valid atau sudah expired.', 'INVALID_REFRESH_TOKEN');
    }

    const user = await getUserById(decoded.sub);
    if (!user) {
      throw new ApiError(401, 'User tidak ditemukan.', 'USER_NOT_FOUND');
    }

    const newAccessToken = generateAccessToken({
      sub: String(user.id),
      username: user.username,
      email: user.email,
    });

    return [
      {
        accessToken: newAccessToken,
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
