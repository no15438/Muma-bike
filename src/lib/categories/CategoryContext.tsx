'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { categories as initialCategories } from '../data';
import { Category } from '../data';

interface CategoryContextType {
  categories: Category[];
  updateCategory: (id: string, data: Partial<Category>) => void;
  toggleHomepageVisibility: (id: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  
  // 初始化数据，从localStorage或初始数据加载
  useEffect(() => {
    // 尝试从localStorage加载
    try {
      const savedCategories = localStorage.getItem('categories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      } else {
        setCategories(initialCategories);
      }
    } catch (error) {
      console.error('加载分类数据失败:', error);
      setCategories(initialCategories);
    }
  }, []);
  
  // 当categories变化时保存到localStorage
  useEffect(() => {
    if (categories.length > 0) {
      try {
        localStorage.setItem('categories', JSON.stringify(categories));
      } catch (error) {
        console.error('保存分类数据失败:', error);
      }
    }
  }, [categories]);
  
  // 更新分类数据
  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === id ? { ...category, ...data } : category
      )
    );
  };
  
  // 切换首页显示状态
  const toggleHomepageVisibility = (id: string) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === id 
          ? { ...category, showOnHomepage: !category.showOnHomepage } 
          : category
      )
    );
  };
  
  return (
    <CategoryContext.Provider value={{ categories, updateCategory, toggleHomepageVisibility }}>
      {children}
    </CategoryContext.Provider>
  );
}

// 使用钩子
export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
} 