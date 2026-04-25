import { getUserById } from '@/src/modules/auth/model';
import { withErrorHandling, ApiError } from '@/src/lib/error-handler';
import { sanitizeUser, generateAccessToken, verifyRefreshToken } from '@/src/modules/auth/service';
import { parseJsonBody } from '@/src/lib/api';

export async function POST(request: Request) {
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

    return [{ accessToken: newAccessToken, user: sanitizeUser(user) }, { status: 200 }];
  });
}
