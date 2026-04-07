import { getUserByEmail, getUserByUsername } from '@/src/models/User';
import { ApiError, jsonResponse, optionsResponse, parseJsonBody, withErrorHandling } from '@/src/lib/api';
import { sanitizeUser } from '@/src/lib/auth';
import { generateToken } from '@/src/lib/jwt';
import { verifyPassword } from '@/src/lib/password';

type LoginBody = {
  identifier?: unknown;
  password?: unknown;
};

function validateLoginInput(body: LoginBody) {
  const identifier =
    typeof body.identifier === 'string' ? body.identifier.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!identifier) {
    throw new ApiError(400, 'Username atau email wajib diisi.');
  }

  if (!password) {
    throw new ApiError(400, 'Password wajib diisi.');
  }

  return { identifier, password };
}

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    const body = (await parseJsonBody(request)) as LoginBody;
    const { identifier, password } = validateLoginInput(body);
    const normalizedEmail = identifier.toLowerCase();

    const user = identifier.includes('@')
      ? await getUserByEmail(normalizedEmail)
      : await getUserByUsername(identifier);

    if (!user || !verifyPassword(password, user.password)) {
      throw new ApiError(401, 'Kredensial login tidak valid.');
    }

    const token = generateToken({
      sub: String(user.id),
      username: user.username,
      email: user.email,
    });

    return jsonResponse({
      ok: true,
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  });
}

export function OPTIONS() {
  return optionsResponse();
}
