import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/auth/logout - User logout
export async function POST(req: NextRequest) {
  try {
    // Clear the auth cookie
    const cookieStore = cookies();
    cookieStore.delete('authToken');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'Failed to log out' },
      { status: 500 }
    );
  }
} 