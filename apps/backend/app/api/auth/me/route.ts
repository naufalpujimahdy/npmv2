import { getUserById } from '@/src/modules/auth/model';
import { withErrorHandling, ApiError } from '@/src/lib/error-handler';
import { sanitizeUser, verifyAccessToken, extractTokenFromHeader } from '@/src/modules/auth/service';

export async function GET(request: Request) {
  return withErrorHandling(request, async () => {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      throw new ApiError(401, 'Token wajib dikirimkan.', 'MISSING_TOKEN');
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      throw new ApiError(401, 'Token tidak valid atau sudah expired.', 'INVALID_TOKEN');
    }

    const user = await getUserById(payload.sub);
    if (!user) {
      throw new ApiError(404, 'User tidak ditemukan.', 'USER_NOT_FOUND');
    }

    return [sanitizeUser(user), { status: 200 }];
  });
}
