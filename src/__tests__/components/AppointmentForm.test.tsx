import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppointmentForm from '@/components/AppointmentForm';
import { UserProvider } from '@/lib/auth/UserContext';
import { CartProvider } from '@/lib/cart/CartContext';

// 创建测试包装组件
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </UserProvider>
);

// 模拟提交函数
const mockOnSubmit = jest.fn();

describe('AppointmentForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with correct sections', () => {
    render(
      <TestWrapper>
        <AppointmentForm
          serviceType="repair"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>
    );

    // 检查基本表单部分是否存在
    expect(screen.getByText('选择服务项目')).toBeInTheDocument();
    expect(screen.getByText('选择服务点')).toBeInTheDocument();
    expect(screen.getByText('选择日期和时间')).toBeInTheDocument();
    expect(screen.getByText('个人信息')).toBeInTheDocument();
    expect(screen.getByText('自行车信息（选填）')).toBeInTheDocument();
  });

  it('allows filling personal information', () => {
    render(
      <TestWrapper>
        <AppointmentForm
          serviceType="repair"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>
    );

    // 填写基本信息
    const nameInput = screen.getByLabelText('姓名');
    const phoneInput = screen.getByLabelText('电话');
    const emailInput = screen.getByLabelText('邮箱（选填）');

    fireEvent.change(nameInput, { target: { value: '张三' } });
    fireEvent.change(phoneInput, { target: { value: '13800138000' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(nameInput).toHaveValue('张三');
    expect(phoneInput).toHaveValue('13800138000');
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('displays bike information fields', () => {
    render(
      <TestWrapper>
        <AppointmentForm
          serviceType="repair"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>
    );

    // 检查自行车信息字段
    expect(screen.getByLabelText('品牌')).toBeInTheDocument();
    expect(screen.getByLabelText('型号')).toBeInTheDocument();
    expect(screen.getByLabelText('类型')).toBeInTheDocument();
  });

  it('shows fitting-specific fields when serviceType is fitting', () => {
    render(
      <TestWrapper>
        <AppointmentForm
          serviceType="fitting"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>
    );

    // 检查Bike Fitting特定字段
    expect(screen.getByText('Bike Fitting 信息（选填）')).toBeInTheDocument();
    expect(screen.getByLabelText('身高 (cm)')).toBeInTheDocument();
    expect(screen.getByLabelText('体重 (kg)')).toBeInTheDocument();
    expect(screen.getByLabelText('骑行经验')).toBeInTheDocument();
  });

  it('shows submit button with correct text', () => {
    render(
      <TestWrapper>
        <AppointmentForm
          serviceType="repair"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>
    );

    // 检查提交按钮
    const submitButton = screen.getByRole('button', { name: '确认预约' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('shows total price section', () => {
    render(
      <TestWrapper>
        <AppointmentForm
          serviceType="repair"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>
    );

    // 检查总价部分
    expect(screen.getByText('总价')).toBeInTheDocument();
    expect(screen.getByText('¥0')).toBeInTheDocument(); // 初始价格为0
  });
}); 