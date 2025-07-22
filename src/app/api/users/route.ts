import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as crypto from 'crypto';

// Helper function to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// GET /api/users - Get all users
export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        joinDate: true,
        isStaff: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        isStaff: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(req: NextRequest) {
  try {
    const { username, email, phone, password, role, isStaff = true } = await req.json();
    
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
        isStaff,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        joinDate: true,
        isStaff: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 