import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth/auth-utils';

interface Params {
  params: {
    id: string;
  };
}

// POST /api/events/[id]/register - user register for event
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.maxParticipants && event.maxParticipants > 0) {
      const count = await prisma.eventRegistration.count({ where: { eventId: id, paymentStatus: { not: 'cancelled' } } });
      if (count >= event.maxParticipants) {
        return NextResponse.json({ error: 'Event is full' }, { status: 400 });
      }
    }

    const existing = await prisma.eventRegistration.findUnique({ where: { eventId_userId: { eventId: id, userId } } });
    if (existing) {
      return NextResponse.json({ error: 'Already registered' }, { status: 400 });
    }

    const additionalInfo = (await req.json()).additionalInfo || null;

    const reg = await prisma.eventRegistration.create({
      data: {
        eventId: id,
        userId,
        additionalInfo,
        paymentStatus: event.fee && event.fee.toNumber() > 0 ? 'unpaid' : 'paid'
      }
    });

    return NextResponse.json(reg, { status: 201 });
  } catch (error) {
    console.error(`Error registering for event ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
