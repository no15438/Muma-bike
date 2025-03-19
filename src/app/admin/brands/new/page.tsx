'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBrands } from '@/lib/brands/BrandContext'
import Link from 'next/link'
import { withAuth } from '@/lib/auth/auth-context'
import { Permission } from '@/lib/auth/permissions'

function NewBrandPage() {
  const router = useRouter()
  const { addBrand } = useBrands()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: ''
  })
  const [error, setError] = useState<string | null>(null)
  
  // 处理表单输入变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // 表单验证
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('品牌名称不能为空')
      return false
    }
    
    if (!formData.description.trim()) {
      setError('品牌描述不能为空')
      return false
    }
    
    return true
  }
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // 添加新品牌
      addBrand({
        name: formData.name,
        logo: formData.logo || '/images/brands/default.png', // 提供默认logo
        description: formData.description
      })
      
      // 跳转到品牌列表页
      router.push('/admin/brands')
    } catch (error) {
      console.error('Error adding brand:', error)
      setError('添加品牌时发生错误，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">添加新品牌</h1>
        <Link href="/admin/brands" className="text-blue-600 hover:text-blue-800">
          返回品牌列表
        </Link>
      </div>
      
      {/* 表单卡片 */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6">
            {/* 品牌名称 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                品牌名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            
            {/* 品牌Logo URL */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                品牌Logo URL
              </label>
              <input
                type="text"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="http://example.com/logo.png"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                输入品牌logo的URL地址。如果不提供，将使用默认logo。
              </p>
            </div>
            
            {/* Logo预览 */}
            {formData.logo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo预览
                </label>
                <div className="h-20 w-20 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={formData.logo} 
                    alt="Logo预览" 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/brands/default.png'
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* 品牌描述 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                品牌描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
          
          {/* 提交按钮 */}
          <div className="flex justify-end pt-5">
            <Link
              href="/admin/brands"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '提交中...' : '添加品牌'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default withAuth(NewBrandPage, [Permission.MANAGE_CONTENT]) 