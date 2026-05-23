
import { SignJWT, jwtVerify } from 'jose';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length === 0) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const secret = new TextEncoder().encode(jwtSecret);
const EXPIRES_IN = '7d';

export async function signToken(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(secret);
  return token;
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}