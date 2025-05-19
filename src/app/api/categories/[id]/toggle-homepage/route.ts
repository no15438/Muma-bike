import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest, isAdmin } from '@/lib/auth/auth-utils';

interface Params {
  params: {
    id: string;
  };
}

// PATCH /api/categories/[id]/toggle-homepage - Toggle homepage visibility
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json(
        { error: 'Forbidden. Admins only.' },
        { status: 403 }
      );
    }

    const { id } = params;
    
    // Find the category first
    const category = await prisma.category.findUnique({
      where: { id },
      select: { showOnHomepage: true }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Toggle the showOnHomepage value
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        showOnHomepage: !category.showOnHomepage
      }
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(`Error toggling homepage visibility for category ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to toggle homepage visibility' },
      { status: 500 }
    );
  }
} 