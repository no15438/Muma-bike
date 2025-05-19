import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest, isAdmin } from '@/lib/auth/auth-utils';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/events/[id] - get event details
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error(`Error fetching event ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// PUT /api/events/[id] - update event (admin only)
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const data = await req.json();

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = await prisma.event.update({ where: { id }, data });
    return NextResponse.json(event);
  } catch (error) {
    console.error(`Error updating event ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}
