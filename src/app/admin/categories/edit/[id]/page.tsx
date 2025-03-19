'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import { Category, getAllCategories, getCategoryById, sampleCategories } from '@/lib/inventory/inventory-model';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    parentId: '',
    description: '',
  });
  const [originalParentId, setOriginalParentId] = useState<string | undefined>();
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [childCategories, setChildCategories] = useState<Category[]>([]);

  // Load category data and parent categories
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [category, allCategories] = await Promise.all([
          getCategoryById(categoryId),
          getAllCategories()
        ]);
        
        if (category) {
          setFormData({
            name: category.name,
            parentId: category.parentId || '',
            description: category.description || '',
          });
          setOriginalParentId(category.parentId);
          
          // Find any child categories
          const children = allCategories.filter(c => c.parentId === categoryId);
          setChildCategories(children);
          
          // Only top-level categories and categories that are not children of this category can be parents
          // And a category cannot be its own parent
          const validParents = allCategories.filter(c => 
            !c.parentId && 
            c.id !== categoryId && 
            !isDescendantOf(allCategories, c.id, categoryId)
          );
          setParentCategories(validParents);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to load category data:', error);
        alert('加载分类数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryId) {
      loadData();
    }
  }, [categoryId]);

  // Check if a category is a descendant of another category
  const isDescendantOf = (categories: Category[], potentialParentId: string, childId: string): boolean => {
    const directChildren = categories.filter(c => c.parentId === potentialParentId);
    return directChildren.some(child => 
      child.id === childId || isDescendantOf(categories, child.id, childId)
    );
  };

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
    
    // Check if category name already exists at the same level (excluding this category)
    const sameNameExists = sampleCategories.some(cat => 
      cat.id !== categoryId &&
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
    
    // If category has children and we're changing its parent, warn user
    if (childCategories.length > 0 && formData.parentId !== originalParentId) {
      const confirm = window.confirm(
        '此分类有子分类，更改其父级分类会影响其所有子分类。确定要继续吗？'
      );
      if (!confirm) return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to update category
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create an updated category object
      const updatedCategory: Category = {
        id: categoryId,
        name: formData.name!,
        parentId: formData.parentId || undefined,
        description: formData.description || undefined,
      };
      
      // In a real app, this would be an API call to update the category
      console.log('Updating category:', updatedCategory);
      
      // Success message
      alert('分类更新成功！');
      
      // Navigate back to category list
      router.push('/admin/categories');
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('更新分类失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">加载中...</div>;
  }

  if (notFound) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">分类不存在</h1>
        <p className="text-gray-500 mb-6">找不到ID为 {categoryId} 的分类</p>
        <button
          type="button"
          onClick={() => router.push('/admin/categories')}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          返回分类列表
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link 
          href="/admin/categories"
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">编辑分类</h1>
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
              {childCategories.length > 0 && (
                <p className="mt-1 text-xs text-yellow-600">
                  注意：更改父级分类将影响此分类下的所有子分类
                </p>
              )}
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

            {/* 子分类信息 */}
            {childCategories.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700">子分类</h3>
                <ul className="mt-2 divide-y divide-gray-200">
                  {childCategories.map(child => (
                    <li key={child.id} className="py-2">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">{child.name}</span>
                        <Link 
                          href={`/admin/categories/edit/${child.id}`}
                          className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                        >
                          编辑
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? '保存中...' : '保存更改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(EditCategoryPage, Permission.MANAGE_CONTENT); 