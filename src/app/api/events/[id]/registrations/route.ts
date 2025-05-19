import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest, isAdmin } from '@/lib/auth/auth-utils';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/events/[id]/registrations - list event registrations (admin only)
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: id },
      include: { user: { select: { id: true, username: true, email: true } } },
      orderBy: { registerTime: 'desc' }
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error(`Error fetching registrations for event ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}
