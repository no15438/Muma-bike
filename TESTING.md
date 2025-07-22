# 沐马自行车管理系统测试指南

本文档提供了牧马自行车管理系统的测试策略和执行方法。

## 测试架构

项目使用以下测试框架和工具：

- **Jest**: JavaScript测试框架
- **React Testing Library**: 用于测试React组件
- **node-mocks-http**: 用于模拟Next.js API路由请求
- **Playwright/Cypress**: 用于端到端测试(可选)

## 测试类型

项目包含以下类型的测试：

1. **单元测试**: 测试独立的功能单元
   - 组件测试
   - 工具函数测试
   - Hook测试

2. **集成测试**: 测试多个单元如何一起工作
   - API路由测试
   - 数据流测试

3. **端到端测试**: 测试完整的用户流程
   - 用户登录流程
   - 用户注册流程
   - 维修单创建流程

## 测试文件结构

测试文件按以下结构组织：

```
src/
├── __tests__/
│   ├── components/    # 组件测试
│   ├── lib/           # 工具函数测试
│   ├── api/           # API路由测试
│   ├── e2e/           # 端到端测试
│   └── utils/         # 测试工具
```

## 运行测试

### 运行所有测试

```bash
npm test
```

### 监视模式

```bash
npm run test:watch
```

### 生成测试覆盖报告

```bash
npm run test:coverage
```

覆盖率报告将在 `coverage` 目录中生成。

## 编写测试

### 组件测试示例

```tsx
import { render, screen } from '@testing-library/react';
import UserCard from '@/components/UserCard';

test('renders user information correctly', () => {
  const user = {
    name: '测试用户',
    email: 'test@example.com',
    role: 'admin'
  };
  
  render(<UserCard user={user} />);
  
  expect(screen.getByText('测试用户')).toBeInTheDocument();
  expect(screen.getByText('test@example.com')).toBeInTheDocument();
  expect(screen.getByText('管理员')).toBeInTheDocument();
});
```

### API测试示例

```ts
import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/users/route';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn().mockResolvedValue([
        { id: '1', name: '测试用户' }
      ])
    }
  }
}));

test('GET /api/users returns users', async () => {
  const req = new NextRequest(new Request('http://localhost:3000/api/users'));
  const res = await GET(req);
  const data = await res.json();
  
  expect(res.status).toBe(200);
  expect(data).toEqual([{ id: '1', name: '测试用户' }]);
});
```

## 模拟策略

### 模拟API请求

使用Jest的模拟功能来模拟fetch请求：

```ts
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mocked data' }),
    ok: true
  })
);
```

### 模拟Prisma

模拟Prisma客户端避免测试时访问数据库：

```ts
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }
}));
```

### 模拟认证状态

模拟不同用户角色的登录状态：

```tsx
jest.mock('@/lib/auth/auth-context', () => ({
  useAuth: () => ({
    currentUser: {
      id: 'test-id',
      name: '测试用户',
      role: 'admin'
    },
    isAuthenticated: true
  })
}));
```

## 端到端测试

端到端测试需要安装额外的工具：

### Playwright (推荐)

```bash
npm install @playwright/test --save-dev
npx playwright install
```

运行端到端测试：

```bash
npx playwright test
```

### Cypress (替代选项)

```bash
npm install cypress --save-dev
```

运行Cypress测试：

```bash
npx cypress open
```

## 持续集成

测试可以集成到CI/CD流程中，例如GitHub Actions。在每次推送和PR时自动运行测试：

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
      - run: npm test
```

## 测试最佳实践

1. **测试行为，而非实现**: 关注组件和功能的行为，而不是内部实现细节
2. **使用数据测试属性**: 使用 `data-testid` 属性来选择测试中的元素
3. **隔离测试**: 每个测试应该独立运行，不依赖其他测试的状态
4. **模拟外部依赖**: 模拟API调用、数据库操作等外部依赖
5. **清理模拟**: 在每个测试后重置所有模拟
6. **遵循AAA模式**: Arrange(准备) - Act(执行) - Assert(断言) 