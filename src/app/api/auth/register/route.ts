import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as crypto from 'crypto';

// Helper function to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// POST /api/auth/register - Register a new user
export async function POST(req: NextRequest) {
  try {
    const { username, email, phone, password } = await req.json();
    
    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already in use' },
        { status: 400 }
      );
    }
    
    // Hash the password
    const passwordHash = hashPassword(password);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        phone,
        passwordHash,
        points: 100, // Give 100 points to new users as welcome bonus
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        joinDate: true,
        points: true,
        isStaff: true
      }
    });
    
    // Create a point history record for the welcome bonus
    await prisma.pointHistory.create({
      data: {
        userId: user.id,
        change: 100,
        reason: '注册欢迎礼包'
      }
    });
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
} 