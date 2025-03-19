import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// PATCH /api/products/[id]/toggle-featured - Toggle featured status
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    // Find the product first
    const product = await prisma.product.findUnique({
      where: { id },
      select: { isFeatured: true }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Toggle the isFeatured value
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        isFeatured: !product.isFeatured
      }
    });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`Error toggling featured status for product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to toggle featured status' },
      { status: 500 }
    );
  }
} 