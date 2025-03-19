'use client'

import { Category, Brand } from '@/lib/data'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useBrands } from '@/lib/brands/BrandContext'

interface ProductFilterProps {
  categories: Category[]
  brands?: Brand[] // 品牌变为可选参数，因为我们将从BrandContext获取
  selectedCategory?: string
  selectedBrand?: string
}

export default function ProductFilter({
  categories,
  selectedCategory,
  selectedBrand
}: ProductFilterProps) {
  const router = useRouter()
  const { brands } = useBrands() // 从BrandContext获取品牌数据
  
  // 根据筛选条件构建URL
  const buildFilterUrl = (categoryId: string | null, brandId: string | null) => {
    let url = '/products'
    const params = []
    
    if (categoryId) {
      params.push(`category=${categoryId}`)
    }
    
    if (brandId) {
      params.push(`brand=${brandId}`)
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`
    }
    
    return url
  }
  
  // 切换分类选择
  const handleCategoryChange = (categoryId: string) => {
    router.push(buildFilterUrl(
      categoryId === selectedCategory ? null : categoryId,
      selectedBrand
    ))
  }
  
  // 切换品牌选择
  const handleBrandChange = (brandId: string) => {
    router.push(buildFilterUrl(
      selectedCategory,
      brandId === selectedBrand ? null : brandId
    ))
  }
  
  // 清除所有筛选
  const clearAllFilters = () => {
    router.push('/products')
  }
  
  // 判断是否有筛选条件
  const hasFilters = selectedCategory || selectedBrand
  
  return (
    <div className="space-y-6">
      {/* 分类筛选 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">分类</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`block w-full text-left px-2 py-1.5 rounded-md ${
                selectedCategory === category.id
                  ? 'bg-gray-100 text-primary font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* 品牌筛选 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">品牌</h3>
        <div className="space-y-2">
          {brands.map(brand => (
            <button
              key={brand.id}
              onClick={() => handleBrandChange(brand.id)}
              className={`block w-full text-left px-2 py-1.5 rounded-md ${
                selectedBrand === brand.id
                  ? 'bg-gray-100 text-primary font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* 清除筛选按钮 */}
      {hasFilters && (
        <div className="pt-4">
          <button
            onClick={clearAllFilters}
            className="flex items-center text-sm text-primary hover:text-primary-dark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            清除筛选条件
          </button>
        </div>
      )}
    </div>
  )
} 