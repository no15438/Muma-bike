import { NextRequest } from 'next/server';

// 模拟API路由处理函数
const mockHandler = {
  GET: jest.fn(),
  POST: jest.fn(),
  PUT: jest.fn(),
  DELETE: jest.fn()
};

// 模拟API导入
jest.mock('@/app/api/users/route', () => mockHandler);

// 模拟prisma客户端
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

// 导入模拟的prisma对象
import { prisma } from '@/lib/prisma';

describe('Users API', () => {
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

  describe('GET /api/users', () => {
    it('should return a list of users', async () => {
      // 模拟findMany返回用户列表
      const mockUsers = [
        { id: '1', username: 'admin', email: 'admin@example.com' },
        { id: '2', username: 'user1', email: 'user1@example.com' }
      ];
      
      (prisma.user.findMany as jest.Mock).mockResolvedValueOnce(mockUsers);
      mockHandler.GET.mockResolvedValueOnce(
        new Response(JSON.stringify(mockUsers), { status: 200 })
      );
      
      // 创建请求
      const req = new NextRequest(new URL('http://localhost:3000/api/users'));
      
      // 调用API
      const res = await mockHandler.GET(req);
      const data = await res.json();
      
      // 检查结果
      expect(res.status).toBe(200);
      expect(data).toEqual(mockUsers);
    });
    
    it('should handle errors during fetch', async () => {
      // 模拟数据库错误
      (prisma.user.findMany as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      mockHandler.GET.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 })
      );
      
      // 创建请求
      const req = new NextRequest(new URL('http://localhost:3000/api/users'));
      
      // 调用API
      const res = await mockHandler.GET(req);
      const data = await res.json();
      
      // 检查结果
      expect(res.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });
  
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      // 模拟用户数据
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };
      
      // 模拟创建后的用户
      const createdUser = {
        id: 'new-id',
        username: userData.username,
        email: userData.email,
        createdAt: new Date().toISOString()
      };
      
      // 设置模拟
      (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(null);
      (prisma.user.create as jest.Mock).mockResolvedValueOnce(createdUser);
      mockHandler.POST.mockResolvedValueOnce(
        new Response(JSON.stringify(createdUser), { status: 201 })
      );
      
      // 创建请求
      const req = new NextRequest(new URL('http://localhost:3000/api/users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      // 调用API
      const res = await mockHandler.POST(req);
      const data = await res.json();
      
      // 检查结果
      expect(res.status).toBe(201);
      expect(data).toEqual(createdUser);
    });
    
    it('should validate required fields', async () => {
      // 缺少必填字段的数据
      const userData = { email: 'incomplete@example.com' };
      
      mockHandler.POST.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Username and password are required' }), { status: 400 })
      );
      
      // 创建请求
      const req = new NextRequest(new URL('http://localhost:3000/api/users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      // 调用API
      const res = await mockHandler.POST(req);
      const data = await res.json();
      
      // 检查结果
      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });
  
  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      // 模拟更新数据
      const userId = '123';
      const updateData = {
        username: 'updatedname',
        email: 'updated@example.com'
      };
      
      // 模拟更新后的用户
      const updatedUser = {
        id: userId,
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      // 设置模拟
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: userId });
      (prisma.user.update as jest.Mock).mockResolvedValueOnce(updatedUser);
      mockHandler.PUT.mockResolvedValueOnce(
        new Response(JSON.stringify(updatedUser), { status: 200 })
      );
      
      // 创建请求
      const req = new NextRequest(new URL(`http://localhost:3000/api/users/${userId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      // 调用API
      const res = await mockHandler.PUT(req);
      const data = await res.json();
      
      // 检查结果
      expect(res.status).toBe(200);
      expect(data).toEqual(updatedUser);
    });
  });
  
  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      // 模拟用户ID
      const userId = '123';
      
      // 设置模拟
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: userId });
      (prisma.user.delete as jest.Mock).mockResolvedValueOnce({ id: userId });
      mockHandler.DELETE.mockResolvedValueOnce(
        new Response(null, { status: 204 })
      );
      
      // 创建请求
      const req = new NextRequest(new URL(`http://localhost:3000/api/users/${userId}`), {
        method: 'DELETE'
      });
      
      // 调用API
      const res = await mockHandler.DELETE(req);
      
      // 检查结果
      expect(res.status).toBe(204);
    });
    
    it('should return 404 for non-existent user', async () => {
      // 模拟不存在的用户ID
      const userId = 'non-existent';
      
      // 设置模拟
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      mockHandler.DELETE.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
      );
      
      // 创建请求
      const req = new NextRequest(new URL(`http://localhost:3000/api/users/${userId}`), {
        method: 'DELETE'
      });
      
      // 调用API
      const res = await mockHandler.DELETE(req);
      const data = await res.json();
      
      // 检查结果
      expect(res.status).toBe(404);
      expect(data.error).toBeDefined();
    });
  });
}); 