import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth/auth-utils';

interface Params {
  params: {
    id: string;
  };
}

// POST /api/events/[id]/cancel - cancel registration
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const registration = await prisma.eventRegistration.findUnique({ where: { eventId_userId: { eventId: id, userId } } });
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const updated = await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { paymentStatus: 'cancelled' }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(`Error cancelling registration for event ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to cancel registration' }, { status: 500 });
  }
}
