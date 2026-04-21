import { getUserById } from '@/src/models/User';
import { withErrorHandling, ApiError } from '@/src/lib/error-handler';
import { sanitizeUser } from '@/src/lib/auth';
import { verifyAccessToken, extractTokenFromHeader } from '@/src/lib/jwt-refresh';
import { optionsResponse } from '@/src/lib/api';
import { corsHeaders, handleCorsPreFlight } from '@/src/lib/cors';

export async function GET(request: Request) {
  const corsPreFlight = handleCorsPreFlight(request);
  if (corsPreFlight) return corsPreFlight;

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

    return [
      sanitizeUser(user),
      { status: 200 },
    ];
  });
}

export function OPTIONS(request: Request) {
  const corsPreFlight = handleCorsPreFlight(request);
  if (corsPreFlight) return corsPreFlight;
  return optionsResponse();
}
