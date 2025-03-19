import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/categories/[id] - Get a specific category by ID
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: { 
        products: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error(`Error fetching category ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const { name, description, showOnHomepage } = await req.json();
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        showOnHomepage
      }
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(`Error updating category ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: { select: { id: true } } }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check if category has products
    if (category.products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with associated products' },
        { status: 400 }
      );
    }
    
    // Delete the category
    await prisma.category.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting category ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 