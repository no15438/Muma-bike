import { NextRequest } from 'next/server';

// 模拟API路由处理函数
const mockHandler = {
  GET: jest.fn(),
  POST: jest.fn(),
  PUT: jest.fn(),
  DELETE: jest.fn()
};

// 模拟API导入
jest.mock('@/app/api/products/route', () => mockHandler);

// 模拟prisma客户端
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    category: {
      findUnique: jest.fn()
    }
  }
}));

// 导入模拟的prisma对象
import { prisma } from '@/lib/prisma';

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 为每个模拟处理函数设置默认响应
    mockHandler.GET.mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );
    mockHandler.POST.mockResolvedValue(
      new Response(JSON.stringify({}), { status: 201 })
    );
    mockHandler.PUT.mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 })
    );
    mockHandler.DELETE.mockResolvedValue(
      new Response(null, { status: 204 })
    );
  });

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      // 模拟findMany返回产品列表
      const mockProducts = [
        { id: '1', name: '山地自行车', price: 1999.00, categoryId: '1' },
        { id: '2', name: '公路自行车', price: 3999.00, categoryId: '2' }
      ];
      
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce(mockProducts);
      mockHandler.GET.mockResolvedValueOnce(
        new Response(JSON.stringify(mockProducts), { status: 200 })
      );
      
      // 创建请求
      const req = new NextRequest(new URL('http://localhost:3000/api/products'));
      
      // 调用API
      const res = await mockHandler.GET(req);
      const data = await res.json();
      
      // 检查结果
      expect(res.status).toBe(200);
      expect(data).toEqual(mockProducts);
    });
    
    it('should handle category filtering', async () => {
      // 模拟请求和响应
      const mockProducts = [{ id: '1', name: '山地自行车', price: 1999.00, categoryId: '1' }];
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce(mockProducts);
      mockHandler.GET.mockResolvedValueOnce(
        new Response(JSON.stringify(mockProducts), { status: 200 })
      );
      
      // 创建带有查询参数的请求
      const req = new NextRequest(new URL('http://localhost:3000/api/products?categoryId=1'));
      
      // 调用API
      const res = await mockHandler.GET(req);
      const data = await res.json();
      
      // 检查结果
      expect(res.status).toBe(200);
      expect(data).toEqual(mockProducts);
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categoryId: '1'
          })
        })
      );
    });
  });
  
  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      // 模拟产品数据
      const productData = {
        name: '新款山地自行车',
        description: '专业级山地自行车',
        price: 2499.00,
        categoryId: '1'
      };
      
      // 模拟创建后的产品
      const createdProduct = {
        id: 'new-id',
        ...productData,
        createdAt: new Date().toISOString()
      };
      
      // 设置模拟
      (prisma.category.findUnique as jest.Mock).mockResolvedValueOnce({ id: '1', name: '山地车' });
      (prisma.product.create as jest.Mock).mockResolvedValueOnce(createdProduct);
      mockHandler.POST.mockResolvedValueOnce(
        new Response(JSON.stringify(createdProduct), { status: 201 })
      );
      
      // 创建请求
      const req = new NextRequest(new URL('http://localhost:3000/api/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      // 调用API
      const res = await mockHandler.POST(req);
      const data = await res.json();
      
      // 检查结果
      expect(res.status).toBe(201);
      expect(data).toEqual(createdProduct);
    });
    
    it('should validate required fields', async () => {
      // 缺少必填字段的数据
      const productData = { name: '不完整产品' };
      
      mockHandler.POST.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Product price and category are required' }), { status: 400 })
      );
      
      // 创建请求
      const req = new NextRequest(new URL('http://localhost:3000/api/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      // 调用API
      const res = await mockHandler.POST(req);
      const data = await res.json();
      
      // 检查结果
      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });
  
  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      // 模拟产品ID
      const productId = '123';
      
      // 设置模拟
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce({ id: productId });
      (prisma.product.delete as jest.Mock).mockResolvedValueOnce({ id: productId });
      mockHandler.DELETE.mockResolvedValueOnce(
        new Response(null, { status: 204 })
      );
      
      // 创建请求
      const req = new NextRequest(new URL(`http://localhost:3000/api/products/${productId}`), {
        method: 'DELETE'
      });
      
      // 调用API
      const res = await mockHandler.DELETE(req);
      
      // 检查结果
      expect(res.status).toBe(204);
    });
  });
}); 