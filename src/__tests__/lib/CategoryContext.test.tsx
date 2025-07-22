import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { CategoryProvider, useCategories } from '@/lib/categories/CategoryContext';

// 模拟fetch API
global.fetch = jest.fn();

// 模拟类别数据
const mockCategories = [
  { id: '1', name: '山地车' },
  { id: '2', name: '公路车' },
  { id: '3', name: '电动车' }
];

// 创建一个测试组件使用useCategories hook
function TestComponent() {
  const { categories, loading, error } = useCategories();
  
  if (loading) return <div data-testid="loading">加载中...</div>;
  if (error) return <div data-testid="error">错误: {error}</div>;
  
  return (
    <div>
      <h1>类别列表</h1>
      <ul>
        {categories.map(category => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
}

describe('CategoryContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should have initial loading state', () => {
    // 模拟未解析的Promise
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(() => {
        // 不调用resolve，保持Promise一直处于pending状态
      })
    );
    
    render(
      <CategoryProvider>
        <TestComponent />
      </CategoryProvider>
    );
    
    // 检查加载状态
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
  
  it('should fetch and display categories', async () => {
    // 模拟成功的API响应
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCategories)
      })
    );
    
    render(
      <CategoryProvider>
        <TestComponent />
      </CategoryProvider>
    );
    
    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    // 检查类别是否显示
    expect(screen.getByText('山地车')).toBeInTheDocument();
    expect(screen.getByText('公路车')).toBeInTheDocument();
    expect(screen.getByText('电动车')).toBeInTheDocument();
  });
  
  it('should handle API errors', async () => {
    // 模拟API错误
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })
    );
    
    render(
      <CategoryProvider>
        <TestComponent />
      </CategoryProvider>
    );
    
    // 等待错误消息显示
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });
}); 