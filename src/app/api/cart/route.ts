import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth/auth-utils';

// GET /api/cart - Get the current user's cart
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }
    
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            brand: true
          }
        }
      }
    });
    
    // Process the cart items to include proper JSON arrays for images/features
    const processedCartItems = cartItems.map(item => ({
      ...item,
      product: {
        ...item.product,
        images: tryParseJson(item.product.images, []),
        features: tryParseJson(item.product.features, [])
      }
    }));
    
    return NextResponse.json(processedCartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add a product to cart
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }
    
    const { productId, quantity } = await req.json();
    
    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Product ID and positive quantity are required' },
        { status: 400 }
      );
    }
    
    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Not enough stock available' },
        { status: 400 }
      );
    }
    
    // Check if the item already exists in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId
      }
    });
    
    let cartItem;
    
    if (existingCartItem) {
      // Update the quantity if item exists
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity
        },
        include: {
          product: {
            include: {
              category: true,
              brand: true
            }
          }
        }
      });
    } else {
      // Create a new cart item if it doesn't exist
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity
        },
        include: {
          product: {
            include: {
              category: true,
              brand: true
            }
          }
        }
      });
    }
    
    // Process the product fields for proper JSON
    const processedCartItem = {
      ...cartItem,
      product: {
        ...cartItem.product,
        images: tryParseJson(cartItem.product.images, []),
        features: tryParseJson(cartItem.product.features, [])
      }
    };
    
    return NextResponse.json(processedCartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
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