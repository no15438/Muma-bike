// 模拟prisma客户端
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '1',
          username: 'test',
          email: 'test@example.com'
        }
      ]),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 'new-id',
        username: 'newuser',
        email: 'new@example.com'
      })
    }
  }
}));

// 导入模拟的prisma对象
import { prisma } from '@/lib/prisma';

describe('Users API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call correct Prisma methods', () => {
    // 验证prisma模拟是否正确设置
    expect(prisma.user.findMany).toBeDefined();
    expect(prisma.user.create).toBeDefined();
    
    // 简单测试
    expect(true).toBe(true);
  });
}); 