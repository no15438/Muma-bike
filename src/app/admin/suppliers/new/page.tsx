'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import { Supplier, sampleSuppliers } from '@/lib/inventory/inventory-model';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function NewSupplierPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    wechat: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      newErrors.name = '供应商名称不能为空';
    }
    
    if (!formData.contactPerson?.trim()) {
      newErrors.contactPerson = '联系人不能为空';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = '联系电话不能为空';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
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
      // Simulate API call to create supplier
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a new ID (in a real app, this would come from the backend)
      const newId = (Math.max(...sampleSuppliers.map(supplier => parseInt(supplier.id.replace('sup', '')))) + 1).toString();
      
      // Create a new supplier object
      const newSupplier: Supplier = {
        id: `sup${newId}`,
        name: formData.name!,
        contactPerson: formData.contactPerson!,
        phone: formData.phone!,
        email: formData.email,
        wechat: formData.wechat,
        address: formData.address,
      };
      
      // In a real app, this would be an API call to create the supplier
      console.log('Creating supplier:', newSupplier);
      
      // Success message
      alert('供应商创建成功！');
      
      // Navigate back to supplier list
      router.push('/admin/suppliers');
    } catch (error) {
      console.error('Failed to create supplier:', error);
      alert('创建供应商失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link 
          href="/admin/suppliers"
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">添加供应商</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 供应商名称 */}
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                供应商名称 <span className="text-red-500">*</span>
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

            {/* 联系人 */}
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                联系人 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson || ''}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.contactPerson ? 'border-red-300' : ''
                }`}
              />
              {errors.contactPerson && (
                <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>
              )}
            </div>

            {/* 联系电话 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                联系电话 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.phone ? 'border-red-300' : ''
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* 邮箱 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.email ? 'border-red-300' : ''
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* 微信 */}
            <div>
              <label htmlFor="wechat" className="block text-sm font-medium text-gray-700">
                微信
              </label>
              <input
                type="text"
                id="wechat"
                name="wechat"
                value={formData.wechat || ''}
                onChange={handleChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            {/* 地址 */}
            <div className="col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                地址
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address || ''}
                onChange={handleChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="mt-6 flex justify-end space-x-3">
            <Link
              href="/admin/suppliers"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? '保存中...' : '保存供应商'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(NewSupplierPage, Permission.MANAGE_CONTENT); 