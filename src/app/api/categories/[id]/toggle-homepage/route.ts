import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// PATCH /api/categories/[id]/toggle-homepage - Toggle homepage visibility
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
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