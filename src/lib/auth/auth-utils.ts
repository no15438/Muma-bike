import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import * as crypto from 'crypto';
import { prisma } from '../prisma';

// JWT utility functions
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

function base64url(input: Buffer) {
  return input
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function signJwt(userId: string, expiresIn = 60 * 60 * 24) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + expiresIn
  };
  const encodedHeader = base64url(Buffer.from(JSON.stringify(header)));
  const encodedPayload = base64url(Buffer.from(JSON.stringify(payload)));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${data}.${signature}`;
}

export function verifyJwt(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  if (signature !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());
    if (typeof payload.exp !== 'number' || payload.exp < Date.now() / 1000) {
      return null;
    }
    return payload.userId as string;
  } catch {
    return null;
  }
}

// Extract user ID from token
export async function getUserIdFromToken(token: string): Promise<string | null> {
  try {
    return verifyJwt(token);
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
}

// Get user ID from request (cookies or Authorization header)
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  try {
    // Try to get token from cookie
    const cookieStore = cookies();
    const tokenFromCookie = cookieStore.get('authToken')?.value;
    
    // Try to get token from Authorization header
    const authHeader = req.headers.get('Authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    const token = tokenFromCookie || tokenFromHeader;
    
    if (!token) {
      return null;
    }
    
    return await getUserIdFromToken(token);
  } catch (error) {
    console.error('Error getting user ID from request:', error);
    return null;
  }
}

// Verify if user is admin
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isStaff: true }
    });
    
    return user?.isStaff || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
} 