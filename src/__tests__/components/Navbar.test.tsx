import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/lib/cart/CartContext';
import { UserProvider } from '@/lib/auth/UserContext';

// 模拟next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/'
  }),
  usePathname: () => '/'
}));

// 模拟next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// 创建一个测试包装组件
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </UserProvider>
);

describe('Navbar Component', () => {
  it('renders logo and navigation links', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    // 检查logo是否存在
    expect(screen.getByText(/牧马单车/i)).toBeInTheDocument();
    
    // 检查主要导航链接，使用更具体的选择器
    const navButtons = screen.getAllByRole('button');
    expect(navButtons.some(button => button.textContent?.includes('商品'))).toBeTruthy();
    expect(navButtons.some(button => button.textContent?.includes('服务'))).toBeTruthy();
    
    // 检查其他链接
    expect(screen.getByRole('link', { name: /关于我们/i })).toBeInTheDocument();
  });

  it('shows mobile menu when menu button is clicked', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    // 找到移动端菜单按钮并点击
    const menuButtons = screen.getAllByRole('button');
    const menuButton = menuButtons[menuButtons.length - 1]; // 最后一个按钮是移动菜单按钮
    
    // 初始状态下移动菜单应该是隐藏的
    const mobileMenu = screen.getByRole('navigation').querySelector('.md\\:hidden');
    expect(mobileMenu).toHaveClass('hidden');
    
    // 点击菜单按钮
    fireEvent.click(menuButton);
    
    // 检查移动菜单是否显示
    expect(mobileMenu).not.toHaveClass('hidden');
  });

  it('highlights active link based on current path', () => {
    // 修改模拟以返回特定路径
    jest.spyOn(require('next/navigation'), 'usePathname').mockReturnValue('/products');
    
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    // 获取"产品"按钮并检查其是否具有活动状态的类
    const navButtons = screen.getAllByRole('button');
    const productsButton = navButtons.find(button => button.textContent?.includes('商品'));
    expect(productsButton).toHaveClass('text-primary');
  });
  
  it('renders shopping cart icon', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    // 检查购物车图标存在
    const cartLinks = screen.getAllByRole('link', { name: '' });
    expect(cartLinks.some(link => link.getAttribute('href') === '/cart')).toBeTruthy();
  });
}); 