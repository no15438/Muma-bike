import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest, isAdmin } from '@/lib/auth/auth-utils';

// GET /api/events - list events with optional status filter
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where: whereClause,
        orderBy: { startTime: 'desc' },
        skip,
        take: limit
      }),
      prisma.event.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events - create a new event (admin only)
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const requiredFields = ['title', 'description', 'type', 'startTime', 'endTime', 'location'];
    if (!requiredFields.every(f => data[f])) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = await prisma.event.create({ data });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
