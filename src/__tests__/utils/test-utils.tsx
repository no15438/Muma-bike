import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// 简单的渲染函数，不包含任何Provider
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return render(ui, options);
};

// 模拟一个登录用户
const mockLoggedInUser = {
  id: 'test-user-id',
  name: '测试用户',
  email: 'test@mumabike.com',
  role: 'admin',
};

// 模拟API响应
const mockApiResponse = (status: number, data: any) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
};

// 添加一个简单的测试
describe('Test Utils', () => {
  it('should have render function defined', () => {
    expect(typeof customRender).toBe('function');
  });
});

// 重新导出所有testing-library的函数
export * from '@testing-library/react';

// 导出自定义函数
export { customRender as render, mockLoggedInUser, mockApiResponse }; 