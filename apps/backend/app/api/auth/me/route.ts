import { getUserById } from '@/src/models/User';
import { errorResponse, jsonResponse, optionsResponse, withErrorHandling } from '@/src/lib/api';
import { requireAuthToken, sanitizeUser } from '@/src/lib/auth';

export async function GET(request: Request) {
  return withErrorHandling(async () => {
    const payload = requireAuthToken(request);
    const user = await getUserById(payload.sub);

    if (!user) {
      return errorResponse(404, 'User tidak ditemukan.');
    }

    return jsonResponse({
      ok: true,
      data: sanitizeUser(user),
    });
  });
}

export function OPTIONS() {
  return optionsResponse();
}
