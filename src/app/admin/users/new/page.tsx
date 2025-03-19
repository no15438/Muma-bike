'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission, Role, sampleStaff } from '@/lib/auth/permissions';

function NewUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: Role.RECEPTIONIST, // Default role
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    
    if (!formData.name.trim()) {
      newErrors.name = '用户名不能为空';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    } else if (sampleStaff.some(user => user.email === formData.email.trim())) {
      newErrors.email = '该邮箱已被使用';
    }
    
    if (!formData.password) {
      newErrors.password = '密码不能为空';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度不能少于6位';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
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
      // Simulate API call to create user
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a new user ID (in a real app, this would come from the backend)
      const newId = (Math.max(...sampleStaff.map(user => parseInt(user.id))) + 1).toString();
      
      // Create a new user object (excluding password for this demo)
      const newUser = {
        id: newId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
      };
      
      // In a real app, this would be an API call to create the user
      // For now, we'll just assume it succeeded
      
      // Success message
      alert('用户创建成功！');
      
      // Navigate back to user list
      router.push('/admin/users');
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('创建用户失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">添加用户</h1>
        <button
          type="button"
          onClick={() => router.push('/admin/users')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          返回用户列表
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 用户名 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                用户名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.name ? 'border-red-300' : ''
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* 邮箱 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.email ? 'border-red-300' : ''
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* 密码 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.password ? 'border-red-300' : ''
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* 确认密码 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                确认密码 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.confirmPassword ? 'border-red-300' : ''
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 角色 */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                角色 <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value={Role.ADMIN}>管理员</option>
                <option value={Role.MANAGER}>店长</option>
                <option value={Role.TECHNICIAN}>技师</option>
                <option value={Role.SALES}>销售</option>
                <option value={Role.RECEPTIONIST}>前台</option>
              </select>
            </div>
          </div>

          {/* 角色描述 */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700">角色权限说明</h3>
            <div className="mt-2 border border-gray-200 rounded-md p-4 text-sm">
              <ul className="space-y-2">
                <li><strong>管理员：</strong>拥有系统所有功能的操作权限，包括用户管理、系统设置等。</li>
                <li><strong>店长：</strong>可以查看所有数据，管理订单、维修和内容，但不能管理用户。</li>
                <li><strong>技师：</strong>专注于自行车维修相关功能，可查看和处理维修工单。</li>
                <li><strong>销售：</strong>管理订单和产品内容，负责销售和客户服务。</li>
                <li><strong>前台：</strong>基础查看权限，可查看订单、维修和用户基本信息。</li>
              </ul>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin/users')}
              className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? '创建中...' : '创建用户'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Export with permission check
export default withAuth(NewUserPage, Permission.MANAGE_USERS); 