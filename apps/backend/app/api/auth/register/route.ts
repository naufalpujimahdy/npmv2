import { createUser, getUserByEmail, getUserByUsername, getUserCount } from '@/src/models/User';
import { ApiError, jsonResponse, optionsResponse, parseJsonBody, requireAdminRequest, withErrorHandling } from '@/src/lib/api';
import { sanitizeUser } from '@/src/lib/auth';
import { hashPassword } from '@/src/lib/password';

type RegisterBody = {
  username?: unknown;
  email?: unknown;
  password?: unknown;
};

function validateRegisterInput(body: RegisterBody) {
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (username.length < 3) {
    throw new ApiError(400, 'Username minimal 3 karakter.');
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    throw new ApiError(400, 'Username hanya boleh berisi huruf, angka, titik, strip, atau underscore.');
  }

  if (!email.includes('@')) {
    throw new ApiError(400, 'Email tidak valid.');
  }

  if (password.length < 8) {
    throw new ApiError(400, 'Password minimal 8 karakter.');
  }

  return { username, email, password };
}

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    const existingUsers = await getUserCount();

    if (existingUsers > 0) {
      requireAdminRequest(request);
    }

    const body = (await parseJsonBody(request)) as RegisterBody;
    const { username, email, password } = validateRegisterInput(body);

    const [existingUsername, existingEmail] = await Promise.all([
      getUserByUsername(username),
      getUserByEmail(email),
    ]);

    if (existingUsername) {
      throw new ApiError(409, 'Username sudah digunakan.');
    }

    if (existingEmail) {
      throw new ApiError(409, 'Email sudah digunakan.');
    }

    const user = await createUser({
      username,
      email,
      password: hashPassword(password),
    });

    return jsonResponse(
      {
        ok: true,
        data: sanitizeUser(user),
        meta: {
          bootstrap: existingUsers === 0,
        },
      },
      { status: 201 }
    );
  });
}

export function OPTIONS() {
  return optionsResponse();
}
