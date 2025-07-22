import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { UserProvider, useUser } from '@/lib/auth/UserContext';

// 创建测试组件使用useUser hook
const TestAuthComponent = () => {
  const { user, login, logout, register, isAuthenticated } = useUser();
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <div data-testid="user-info">
            <p>当前用户: {user?.name}</p>
            <p>邮箱: {user?.email}</p>
          </div>
          <button onClick={logout}>退出登录</button>
        </>
      ) : (
        <>
          <h2>未登录</h2>
          <button 
            onClick={() => login('zhangsan@example.com', 'password123')}
            data-testid="login-btn"
          >
            登录
          </button>
          <button 
            onClick={() => register('李四', 'lisi@example.com', 'password123')}
            data-testid="register-btn"
          >
            注册
          </button>
        </>
      )}
    </div>
  );
};

describe('Authentication Flow', () => {
  beforeEach(() => {
    // 清除localStorage
    localStorage.clear();
    
    // 为localStorage.getItem和setItem添加监视函数
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    jest.spyOn(window.localStorage.__proto__, 'removeItem');
  });
  
  afterEach(() => {
    // 恢复所有监视函数
    jest.restoreAllMocks();
  });
  
  it('should show unauthenticated state initially', () => {
    render(
      <UserProvider>
        <TestAuthComponent />
      </UserProvider>
    );
    
    expect(screen.getByText('未登录')).toBeInTheDocument();
    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
    expect(screen.getByTestId('register-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
  });
  
  it('should authenticate user on successful login', async () => {
    render(
      <UserProvider>
        <TestAuthComponent />
      </UserProvider>
    );
    
    // 点击登录按钮
    fireEvent.click(screen.getByTestId('login-btn'));
    
    // 等待登录完成
    await waitFor(() => {
      expect(screen.getByText(/当前用户:/)).toBeInTheDocument();
    });
    
    // 检查用户信息是否显示
    expect(screen.getByText(/张三/)).toBeInTheDocument();
    expect(screen.getByText(/zhangsan@example.com/)).toBeInTheDocument();
    
    // 检查localStorage是否被正确设置
    expect(localStorage.setItem).toHaveBeenCalled();
  });
  
  it('should log user out successfully', async () => {
    render(
      <UserProvider>
        <TestAuthComponent />
      </UserProvider>
    );
    
    // 先登录
    fireEvent.click(screen.getByTestId('login-btn'));
    
    // 等待登录完成
    await waitFor(() => {
      expect(screen.getByText(/当前用户:/)).toBeInTheDocument();
    });
    
    // 点击登出按钮
    fireEvent.click(screen.getByText('退出登录'));
    
    // 等待登出完成
    await waitFor(() => {
      expect(screen.getByText('未登录')).toBeInTheDocument();
    });
    
    // 检查localStorage是否被清除
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });
  
  it('should register and authenticate a new user', async () => {
    render(
      <UserProvider>
        <TestAuthComponent />
      </UserProvider>
    );
    
    // 点击注册按钮
    fireEvent.click(screen.getByTestId('register-btn'));
    
    // 等待注册完成
    await waitFor(() => {
      expect(screen.getByText(/当前用户:/)).toBeInTheDocument();
    });
    
    // 检查新用户信息是否显示
    expect(screen.getByText(/李四/)).toBeInTheDocument();
    expect(screen.getByText(/lisi@example.com/)).toBeInTheDocument();
    
    // 检查localStorage是否被正确设置
    expect(localStorage.setItem).toHaveBeenCalled();
  });
}); 