import ProductCard from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'
import { brands, categories, products } from '@/lib/data'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export function generateMetadata({ params }: Props): Metadata {
  // 查找当前分类
  const category = categories.find(c => c.id === params.id)
  
  if (!category) {
    return {
      title: '分类不存在 | 牧马单车',
      description: '您访问的分类不存在，请浏览其他商品分类。',
    }
  }
  
  return {
    title: `${category.name} | 牧马单车`,
    description: category.description,
  }
}

export default function CategoryPage({ params, searchParams }: Props) {
  // 查找当前分类
  const category = categories.find(c => c.id === params.id)
  
  // 如果分类不存在，返回404
  if (!category) {
    notFound()
  }
  
  // 获取查询参数
  const brandFilter = typeof searchParams.brand === 'string' ? searchParams.brand : undefined
  
  // 根据分类和品牌筛选条件过滤商品
  const filteredProducts = products.filter(product => {
    // 检查商品是否属于当前分类
    if (product.category !== params.id) {
      return false
    }
    
    // 如果有品牌筛选，检查商品是否属于该品牌
    if (brandFilter && product.brand !== brandFilter) {
      return false
    }
    
    return true
  })
  
  // 获取当前选中的品牌名称
  const selectedBrand = brandFilter ? brands.find(b => b.id === brandFilter) : undefined
  
  return (
    <main className="min-h-screen">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          <p className="text-gray-600">{category.description}</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* 过滤栏 */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ProductFilter 
              categories={categories} 
              brands={brands}
              selectedCategory={params.id}
              selectedBrand={brandFilter}
            />
          </div>
          
          {/* 商品列表 */}
          <div className="flex-grow">
            {filteredProducts.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-gray-600">
                  显示 {filteredProducts.length} 个{selectedBrand ? selectedBrand.name : ''} {category.name}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">没有找到符合条件的商品</h3>
                <p className="text-gray-600 mb-4">请尝试更改筛选条件或浏览其他类别</p>
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="btn"
                >
                  查看全部商品
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 