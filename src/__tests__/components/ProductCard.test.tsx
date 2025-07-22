import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';
import { CartProvider } from '@/lib/cart/CartContext';
import { UserProvider } from '@/lib/auth/UserContext';

// 模拟产品数据
const mockProduct = {
  id: 'test-product-1',
  name: '山地自行车',
  price: 1999.00,
  originalPrice: 2399.00,
  images: ['https://example.com/bike1.jpg'],
  rating: 4.5,
  reviews: 36,
  category: { name: '山地车' },
  isNew: true,
  isFeatured: true,
  discount: 20,
  stock: 0  // 添加库存信息
};

// 模块内部模拟
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

// 模拟Next.js的Image组件
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src || '/placeholder.jpg'} />
  },
}));

// 创建一个测试包装组件
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </UserProvider>
);

describe('ProductCard Component', () => {
  it('renders product information correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );
    
    // 检查产品名称
    expect(screen.getByText('山地自行车')).toBeInTheDocument();
    
    // 检查产品价格
    expect(screen.getByText(/¥1,999/)).toBeInTheDocument();
    
    // 检查原价
    expect(screen.getByText(/¥2,399/)).toBeInTheDocument();
    
    // 检查折扣标签
    expect(screen.getByText('-20%')).toBeInTheDocument();
    
    // 检查新品标签
    expect(screen.getByText('新品')).toBeInTheDocument();
  });

  it('renders image with correct alt text', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );
    
    // 检查图片alt文本
    const imgElement = screen.getByAltText('山地自行车');
    expect(imgElement).toBeInTheDocument();
  });

  it('shows stock status correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );
    
    // 检查库存状态 (mockProduct中stock为0)
    expect(screen.getByText('缺货')).toBeInTheDocument();
    
    // 检查评论数
    expect(screen.getByText('(36)')).toBeInTheDocument();
  });
}); 