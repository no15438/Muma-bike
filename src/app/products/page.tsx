import ProductCard from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'
import BackToProductsButton from '@/components/BackToProductsButton'
import { categories, products } from '@/lib/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '商品列表 | 牧马单车',
  description: '浏览牧马单车的全部商品，包括山地车、公路车、城市休闲车、儿童车以及各种自行车配件和骑行装备。',
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // 获取查询参数
  const categoryFilter = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const brandFilter = typeof searchParams.brand === 'string' ? searchParams.brand : undefined
  
  // 根据筛选条件过滤商品
  const filteredProducts = products.filter(product => {
    // 如果有分类筛选，检查商品是否属于该分类
    if (categoryFilter && product.category !== categoryFilter) {
      return false
    }
    
    // 如果有品牌筛选，检查商品是否属于该品牌
    if (brandFilter && product.brand !== brandFilter) {
      return false
    }
    
    return true
  })
  
  // 获取当前选中的分类名称，用于页面标题
  const selectedCategory = categoryFilter ? categories.find(c => c.id === categoryFilter) : undefined
  
  // 构建页面标题 - 品牌名称将在客户端组件中处理
  let pageTitle = '全部商品'
  if (selectedCategory) {
    if (brandFilter) {
      pageTitle = `${selectedCategory.name}`
    } else {
      pageTitle = selectedCategory.name
    }
  } else if (brandFilter) {
    pageTitle = '品牌商品'
  }
  
  return (
    <main className="min-h-screen">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
          <p className="text-gray-600">
            {selectedCategory?.description || '浏览牧马单车的全部商品，找到适合您的自行车和配件。'}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* 过滤栏 */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ProductFilter 
              categories={categories} 
              selectedCategory={categoryFilter}
              selectedBrand={brandFilter}
            />
          </div>
          
          {/* 商品列表 */}
          <div className="flex-grow">
            {filteredProducts.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-gray-600">显示 {filteredProducts.length} 个商品</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">没有找到符合条件的商品</h3>
                <p className="text-gray-600 mb-4">请尝试更改筛选条件或浏览其他类别</p>
                <BackToProductsButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 