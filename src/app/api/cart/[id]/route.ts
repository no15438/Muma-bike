import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth/auth-utils';

interface Params {
  params: {
    id: string;
  };
}

// PUT /api/cart/[id] - Update a cart item (quantity)
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const userId = await getUserIdFromRequest(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }
    
    const { quantity } = await req.json();
    
    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Positive quantity is required' },
        { status: 400 }
      );
    }
    
    // Check if cart item exists and belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId
      },
      include: {
        product: true
      }
    });
    
    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }
    
    // Check if product has enough stock
    if (cartItem.product.stock < quantity) {
      return NextResponse.json(
        { error: 'Not enough stock available' },
        { status: 400 }
      );
    }
    
    // Update the cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true,
            brand: true
          }
        }
      }
    });
    
    // Process JSON fields
    const processedCartItem = {
      ...updatedCartItem,
      product: {
        ...updatedCartItem.product,
        images: tryParseJson(updatedCartItem.product.images, []),
        features: tryParseJson(updatedCartItem.product.features, [])
      }
    };
    
    return NextResponse.json(processedCartItem);
  } catch (error) {
    console.error(`Error updating cart item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[id] - Remove an item from cart
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const userId = await getUserIdFromRequest(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }
    
    // Check if cart item exists and belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId
      }
    });
    
    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }
    
    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting cart item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete cart item' },
      { status: 500 }
    );
  }
}

// Helper function to parse JSON strings
function tryParseJson(jsonString: string, defaultValue: any = null) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return defaultValue;
  }
} 