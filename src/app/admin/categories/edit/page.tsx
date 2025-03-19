'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import { Category, getAllCategories, sampleCategories } from '@/lib/inventory/inventory-model';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function EditCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('id');
  
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    parentId: '',
    description: '',
    showOnHomepage: false,
  });
  const [originalCategory, setOriginalCategory] = useState<Category | null>(null);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Load category and parent categories
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load all categories
        const allCategories = await getAllCategories();
        
        // Find the category to edit
        const categoryToEdit = allCategories.find(c => c.id === categoryId);
        
        if (!categoryToEdit) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        setOriginalCategory(categoryToEdit);
        setFormData({
          name: categoryToEdit.name,
          parentId: categoryToEdit.parentId || '',
          description: categoryToEdit.description || '',
          showOnHomepage: categoryToEdit.showOnHomepage || false,
        });
        
        // Filter out the current category and its children to prevent circular references
        const potentialParents = allCategories.filter(c => {
          // Can't be itself
          if (c.id === categoryId) return false;
          
          // Can't be its own child (direct or indirect)
          let current: Category | undefined = c;
          while (current?.parentId) {
            if (current.parentId === categoryId) return false;
            current = allCategories.find(cat => cat.id === current?.parentId);
          }
          
          // Only top-level categories can be parents
          return !c.parentId;
        });
        
        setParentCategories(potentialParents);
      } catch (error) {
        console.error('Failed to load category data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryId) {
      loadData();
    } else {
      setNotFound(true);
      setLoading(false);
    }
  }, [categoryId]);

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
    
    // Check if another category with the same name exists at the same level
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
    
    if (!validateForm() || !originalCategory) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to update category
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the category object
      const updatedCategory: Category = {
        ...originalCategory,
        name: formData.name!,
        parentId: formData.parentId || undefined,
        description: formData.description || undefined,
        showOnHomepage: formData.showOnHomepage || false,
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

  // If category not found
  if (notFound) {
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

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                未找到指定的分类。请返回<Link href="/admin/categories" className="font-medium underline text-yellow-700 hover:text-yellow-600">分类列表</Link>。
              </p>
            </div>
          </div>
        </div>
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
        {loading ? (
          <div className="p-6 text-center text-gray-500">加载中...</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* 分类ID - 只读 */}
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                  分类ID
                </label>
                <input
                  type="text"
                  id="id"
                  value={originalCategory?.id || ''}
                  readOnly
                  className="mt-1 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
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

            {/* 子分类信息 */}
            {originalCategory && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900">子分类信息</h3>
                <p className="mt-1 text-sm text-gray-500">
                  此分类下的子分类数量: {sampleCategories.filter(c => c.parentId === originalCategory.id).length}
                </p>
              </div>
            )}

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
                {isSubmitting ? '保存中...' : '保存修改'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default withAuth(EditCategoryPage, Permission.MANAGE_CONTENT); 