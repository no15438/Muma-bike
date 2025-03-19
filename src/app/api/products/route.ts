import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products - Get all products with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    
    // Parse query parameters
    const category = url.searchParams.get('category');
    const brand = url.searchParams.get('brand');
    const search = url.searchParams.get('search');
    const isFeatured = url.searchParams.get('featured') === 'true';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    const whereClause: any = {};
    
    if (category) {
      whereClause.categoryId = category;
    }
    
    if (brand) {
      whereClause.brandId = brand;
    }
    
    if (isFeatured) {
      whereClause.isFeatured = true;
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          brand: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where: whereClause })
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.description || !data.price || !data.categoryId || !data.brandId) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }
    
    // Parse images and features arrays to JSON strings if needed
    const productData = {
      ...data,
      images: Array.isArray(data.images) ? JSON.stringify(data.images) : data.images,
      features: Array.isArray(data.features) ? JSON.stringify(data.features) : data.features
    };
    
    const product = await prisma.product.create({
      data: productData,
      include: {
        category: true,
        brand: true
      }
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 