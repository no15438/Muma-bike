'use client'

import { useState, useEffect } from 'react'
import { useBrands } from '@/lib/brands/BrandContext'
import Link from 'next/link'
import { withAuth } from '@/lib/auth/auth-context'
import { Permission } from '@/lib/auth/permissions'

function BrandsPage() {
  const { brands, deleteBrand } = useBrands()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // 过滤品牌
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    brand.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // 处理删除品牌
  const handleDelete = async (id: string) => {
    if (confirm('确定要删除此品牌吗？删除后无法恢复，且可能影响现有产品。')) {
      setIsDeleting(id)
      
      try {
        const success = deleteBrand(id)
        if (!success) {
          alert('删除失败，请稍后重试')
        }
      } catch (error) {
        console.error('Error deleting brand:', error)
        alert('删除过程中发生错误')
      } finally {
        setIsDeleting(null)
      }
    }
  }
  
  return (
    <div className="space-y-6">
      {/* 页面标题和操作按钮 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">品牌管理</h1>
        <Link
          href="/admin/brands/new"
          className="btn-primary text-center"
        >
          添加新品牌
        </Link>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="mb-4">
          <label htmlFor="search" className="sr-only">搜索品牌</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="搜索品牌名称或描述"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* 品牌列表 */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  品牌信息
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  描述
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {brand.logo ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={brand.logo} alt={brand.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {brand.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                          <div className="text-sm text-gray-500">ID: {brand.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{brand.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/brands/${brand.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          查看
                        </Link>
                        <Link
                          href={`/admin/brands/${brand.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          disabled={isDeleting === brand.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting === brand.id ? '删除中...' : '删除'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchQuery ? '没有找到匹配的品牌' : '暂无品牌数据'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default withAuth(BrandsPage, [Permission.MANAGE_CONTENT, Permission.VIEW_CONTENT]) 