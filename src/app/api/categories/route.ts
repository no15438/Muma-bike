import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/categories - Get all categories
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const showOnHomepage = url.searchParams.get('showOnHomepage');
    
    const whereClause = showOnHomepage === 'true' 
      ? { showOnHomepage: true } 
      : {};
    
    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(req: NextRequest) {
  try {
    const { name, description, showOnHomepage } = await req.json();

    // Validate input
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        showOnHomepage: showOnHomepage || false,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PATCH method is used for bulk operations
export async function PATCH(req: NextRequest) {
  try {
    const { categories } = await req.json();
    
    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Categories array is required' },
        { status: 400 }
      );
    }
    
    const updatePromises = categories.map(category => 
      prisma.category.update({
        where: { id: category.id },
        data: {
          showOnHomepage: category.showOnHomepage,
          // Only update name/description if provided
          ...(category.name && { name: category.name }),
          ...(category.description && { description: category.description })
        }
      })
    );
    
    await Promise.all(updatePromises);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating categories:', error);
    return NextResponse.json(
      { error: 'Failed to update categories' },
      { status: 500 }
    );
  }
} 