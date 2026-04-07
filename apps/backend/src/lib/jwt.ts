import jwt from 'jsonwebtoken';

type JwtPayload = string | Buffer | object;

function getSecretKey() {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey || secretKey.includes('<your_jwt_secret>')) {
    throw new Error('JWT_SECRET belum dikonfigurasi dengan benar.');
  }

  return secretKey;
}

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, getSecretKey(), { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, getSecretKey());
  } catch {
    throw new Error('Invalid token');
  }
};
