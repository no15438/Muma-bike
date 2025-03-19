import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as crypto from 'crypto';
import { cookies } from 'next/headers';

// Helper function to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper function to generate a simple token
function generateToken(userId: string): string {
  const timestamp = new Date().getTime();
  const tokenData = `${userId}:${timestamp}:${process.env.JWT_SECRET || 'fallback_secret'}`;
  return crypto.createHash('sha256').update(tokenData).digest('hex');
}

// POST /api/auth/login - User login
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user exists and password is correct
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username } // Allow login with email too
        ]
      }
    });
    
    if (!user || user.passwordHash !== hashPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Generate a token
    const token = generateToken(user.id);
    
    // Set the token in a cookie
    const cookieStore = cookies();
    cookieStore.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400, // 1 day
      path: '/'
    });
    
    // Return user info (without password)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      joinDate: user.joinDate,
      points: user.points,
      isStaff: user.isStaff
    };
    
    return NextResponse.json({
      user: userData,
      token // Include token in response for non-cookie based auth if needed
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
} 