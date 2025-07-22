// 导入扩展expect断言
import '@testing-library/jest-dom';

// 模拟Next.js路由
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

// 模拟next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
  useParams: () => ({}),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// 模拟fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  })
);

// 清除每次测试后的所有模拟
afterEach(() => {
  jest.clearAllMocks();
});

// 设置测试环境变量
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

// 移除控制台错误（可选，在需要时取消注释）
// console.error = jest.fn(); 