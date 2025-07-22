import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/LoginForm';

// 模拟登录相关的回调函数
const mockOnLogin = jest.fn();
const mockSetError = jest.fn();

// 测试套件
describe('LoginForm Component', () => {
  // 每个测试前重置所有模拟函数
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // 测试渲染
  it('renders correctly with all required elements', () => {
    render(<LoginForm onLogin={mockOnLogin} setError={mockSetError} />);
    
    // 检查标题
    expect(screen.getByRole('heading', { name: /登录/i })).toBeInTheDocument();
    
    // 检查输入框
    expect(screen.getByLabelText(/邮箱/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
    
    // 检查按钮
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
  });

  // 测试验证功能
  it('validates required fields', async () => {
    render(<LoginForm onLogin={mockOnLogin} setError={mockSetError} />);
    
    // 点击登录按钮但不填写任何内容
    fireEvent.click(screen.getByRole('button', { name: /登录/i }));
    
    // 验证是否显示必填字段错误
    await waitFor(() => {
      expect(screen.getByText(/邮箱不能为空/i)).toBeInTheDocument();
      expect(screen.getByText(/密码不能为空/i)).toBeInTheDocument();
    });
    
    // 确保没有调用登录函数
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  // 测试表单提交
  it('submits the form with valid input', async () => {
    render(<LoginForm onLogin={mockOnLogin} setError={mockSetError} />);
    
    // 模拟用户输入
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/邮箱/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    
    await user.type(emailInput, 'test@mumabike.com');
    await user.type(passwordInput, 'password123');
    
    // 提交表单
    const submitButton = screen.getByRole('button', { name: /登录/i });
    await user.click(submitButton);
    
    // 验证onLogin被调用，且参数正确
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('test@mumabike.com', 'password123');
    });
  });

  // 测试邮箱格式验证（简化版）
  it('prevents submission with invalid email', async () => {
    render(<LoginForm onLogin={mockOnLogin} setError={mockSetError} />);
    
    // 输入无效的邮箱
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/邮箱/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    
    // 提交表单
    const submitButton = screen.getByRole('button', { name: /登录/i });
    await user.click(submitButton);
    
    // 简单检查登录函数未被调用，不检查具体的错误消息
    expect(mockOnLogin).not.toHaveBeenCalled();
  });
}); 