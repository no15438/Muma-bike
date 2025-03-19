'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import { Category, getAllCategories, sampleCategories } from '@/lib/inventory/inventory-model';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function NewCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    parentId: '',
    description: '',
    showOnHomepage: false,
  });
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load parent categories
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const categories = await getAllCategories();
        // Only top-level categories can be parents
        const topLevelCategories = categories.filter(c => !c.parentId);
        setParentCategories(topLevelCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = '分类名称不能为空';
    }
    
    // Check if category name already exists at the same level
    const sameNameExists = sampleCategories.some(cat => 
      cat.name.toLowerCase() === formData.name?.toLowerCase() && 
      cat.parentId === formData.parentId
    );
    
    if (sameNameExists) {
      newErrors.name = '同一级别下已存在相同名称的分类';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to create category
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a new ID (in a real app, this would come from the backend)
      const lastId = Math.max(...sampleCategories
        .map(cat => parseInt(cat.id.replace(/^cat/, '').split('-')[0]))
        .filter(id => !isNaN(id))
      );
      
      let newId: string;
      
      if (formData.parentId) {
        // For subcategories, use the format parent-n
        const parent = sampleCategories.find(cat => cat.id === formData.parentId);
        if (!parent) throw new Error('Parent category not found');
        
        const parentSubcategories = sampleCategories
          .filter(cat => cat.parentId === formData.parentId)
          .map(cat => parseInt(cat.id.split('-')[1]))
          .filter(id => !isNaN(id));
        
        const lastSubId = parentSubcategories.length ? Math.max(...parentSubcategories) : 0;
        newId = `${formData.parentId}-${lastSubId + 1}`;
      } else {
        // For top-level categories, use the format catn
        newId = `cat${lastId + 1}`;
      }
      
      // Create a new category object
      const newCategory: Category = {
        id: newId,
        name: formData.name!,
        parentId: formData.parentId || undefined,
        description: formData.description || undefined,
      };
      
      // In a real app, this would be an API call to create the category
      console.log('Creating category:', newCategory);
      
      // Success message
      alert('分类创建成功！');
      
      // Navigate back to category list
      router.push('/admin/categories');
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('创建分类失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link 
          href="/admin/categories"
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">添加分类</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* 分类名称 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                分类名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.name ? 'border-red-300' : ''
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* 父级分类 */}
            <div>
              <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
                父级分类
              </label>
              <select
                id="parentId"
                name="parentId"
                value={formData.parentId || ''}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">无 (顶级分类)</option>
                {parentCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                选择一个父级分类将使当前分类成为其子分类
              </p>
            </div>

            {/* 分类描述 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                分类描述
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            {/* 显示在主页 */}
            <div className="flex items-center">
              <div className="flex h-5 items-center">
                <input
                  id="showOnHomepage"
                  name="showOnHomepage"
                  type="checkbox"
                  checked={formData.showOnHomepage || false}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      showOnHomepage: e.target.checked
                    });
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="showOnHomepage" className="font-medium text-gray-700">显示在主页</label>
                <p className="text-gray-500">选中后，该分类将显示在网站首页的分类导航中</p>
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="mt-6 flex justify-end space-x-3">
            <Link
              href="/admin/categories"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? '保存中...' : '保存分类'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(NewCategoryPage, Permission.MANAGE_CONTENT); 