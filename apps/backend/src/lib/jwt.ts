import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Function to generate a token
export const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

// Function to verify a token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid token');
    }
};
