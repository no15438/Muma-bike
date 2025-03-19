import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/products/[id] - Get a specific product by ID
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Parse JSON strings back to arrays
    const processedProduct = {
      ...product,
      images: tryParseJson(product.images, []),
      features: tryParseJson(product.features, [])
    };
    
    return NextResponse.json(processedProduct);
  } catch (error) {
    console.error(`Error fetching product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const data = await req.json();
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Process arrays if present
    const updateData = {
      ...data,
      ...(data.images && {
        images: Array.isArray(data.images) ? JSON.stringify(data.images) : data.images
      }),
      ...(data.features && {
        features: Array.isArray(data.features) ? JSON.stringify(data.features) : data.features
      })
    };
    
    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        brand: true
      }
    });
    
    // Parse JSON strings back to arrays
    const processedProduct = {
      ...updatedProduct,
      images: tryParseJson(updatedProduct.images, []),
      features: tryParseJson(updatedProduct.features, [])
    };
    
    return NextResponse.json(processedProduct);
  } catch (error) {
    console.error(`Error updating product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if product has related orders or cart items
    const relatedItems = await Promise.all([
      prisma.orderItem.findFirst({ where: { productId: id } }),
      prisma.cartItem.findFirst({ where: { productId: id } })
    ]);
    
    if (relatedItems.some(item => item !== null)) {
      return NextResponse.json(
        { error: 'Cannot delete product with related orders or cart items' },
        { status: 400 }
      );
    }
    
    // Delete the product
    await prisma.product.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
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