'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { products as initialProducts } from '../data';
import { Product } from '../data';

interface ProductContextType {
  products: Product[];
  updateProduct: (id: string, data: Partial<Product>) => void;
  toggleFeatured: (id: string) => void;
  getFeaturedProducts: () => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  
  // 初始化数据，从localStorage或初始数据加载
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(initialProducts);
      }
    } catch (error) {
      console.error('加载产品数据失败:', error);
      setProducts(initialProducts);
    }
  }, []);
  
  // 当products变化时保存到localStorage
  useEffect(() => {
    if (products.length > 0) {
      try {
        localStorage.setItem('products', JSON.stringify(products));
      } catch (error) {
        console.error('保存产品数据失败:', error);
      }
    }
  }, [products]);
  
  // 更新产品数据
  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { ...product, ...data } : product
      )
    );
  };
  
  // 切换产品特色状态
  const toggleFeatured = (id: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id 
          ? { ...product, isFeatured: !product.isFeatured } 
          : product
      )
    );
  };
  
  // 获取特色产品
  const getFeaturedProducts = () => {
    return products.filter(product => product.isFeatured);
  };
  
  return (
    <ProductContext.Provider value={{ products, updateProduct, toggleFeatured, getFeaturedProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

// 使用钩子
export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
} 