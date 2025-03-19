'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useBrands } from '@/lib/brands/BrandContext'
import Link from 'next/link'
import { withAuth } from '@/lib/auth/auth-context'
import { Permission } from '@/lib/auth/permissions'

function EditBrandPage() {
  const router = useRouter()
  const params = useParams()
  const brandId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { brands, getBrand, updateBrand } = useBrands()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: ''
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  
  // 加载品牌数据
  useEffect(() => {
    const brand = getBrand(brandId)
    
    if (brand) {
      setFormData({
        name: brand.name,
        logo: brand.logo,
        description: brand.description
      })
      setLogoPreview(brand.logo)
      setIsLoading(false)
    } else {
      setError('找不到该品牌')
      setIsLoading(false)
    }
  }, [brandId, getBrand, brands])
  
  // 处理表单输入变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // 验证文件类型
    if (!file.type.match('image.*')) {
      setError('请上传图片文件')
      return
    }
    
    // 验证文件大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('图片大小不能超过2MB')
      return
    }
    
    setLogoFile(file)
    
    // 创建预览URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  
  // 触发文件选择
  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }
  
  // 移除已选图片
  const handleRemoveImage = () => {
    setLogoFile(null)
    setLogoPreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
      // 如果有新上传的Logo文件，则使用Base64编码
      let logoUrl = formData.logo
      if (logoFile && logoPreview) {
        logoUrl = logoPreview // 使用Base64数据URI
      } else if (logoPreview === '') {
        logoUrl = '/images/brands/default.png'
      }
      
      // 更新品牌
      const result = updateBrand(brandId, {
        name: formData.name,
        logo: logoUrl,
        description: formData.description
      })
      
      if (!result) {
        setError('更新品牌失败，找不到该品牌')
        return
      }
      
      // 跳转到品牌列表页
      router.push('/admin/brands')
    } catch (error) {
      console.error('Error updating brand:', error)
      setError('更新品牌时发生错误，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">编辑品牌</h1>
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
            {/* 品牌ID (只读) */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                品牌ID
              </label>
              <input
                type="text"
                id="id"
                value={brandId}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 cursor-not-allowed sm:text-sm"
              />
            </div>
            
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
            
            {/* 品牌Logo上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                品牌Logo
              </label>
              
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={handleFileButtonClick}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  选择图片
                </button>
                
                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    移除
                  </button>
                )}
              </div>
              
              <p className="mt-2 text-xs text-gray-500">
                支持JPG、PNG格式，图片大小不超过2MB。
              </p>
            </div>
            
            {/* Logo预览 */}
            {logoPreview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo预览
                </label>
                <div className="h-24 w-24 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-white">
                  <img 
                    src={logoPreview} 
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
              {isSubmitting ? '保存中...' : '保存更改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default withAuth(EditBrandPage, [Permission.MANAGE_CONTENT]) 