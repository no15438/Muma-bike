import ProductCard from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'
import { brands, categories, products } from '@/lib/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '搜索结果 | 牧马单车',
  description: '搜索牧马单车的商品，找到您需要的自行车、配件和骑行装备。',
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // 获取查询参数
  const query = typeof searchParams.q === 'string' ? searchParams.q : ''
  const categoryFilter = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const brandFilter = typeof searchParams.brand === 'string' ? searchParams.brand : undefined
  const sortBy = typeof searchParams.sort === 'string' ? searchParams.sort : 'relevance'
  
  // 根据搜索关键词和筛选条件过滤商品
  const filteredProducts = products.filter(product => {
    // 如果没有搜索关键词且没有筛选条件，返回所有商品
    if (!query && !categoryFilter && !brandFilter) {
      return true
    }
    
    // 如果有搜索关键词，检查商品名称和描述是否匹配
    const matchesQuery = !query || 
      product.name.toLowerCase().includes(query.toLowerCase()) || 
      product.description.toLowerCase().includes(query.toLowerCase())
    
    // 如果有分类筛选，检查商品是否属于该分类
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    
    // 如果有品牌筛选，检查商品是否属于该品牌
    const matchesBrand = !brandFilter || product.brand === brandFilter
    
    return matchesQuery && matchesCategory && matchesBrand
  })
  
  // 根据排序选项排序商品
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'newest':
        return a.isNew ? -1 : b.isNew ? 1 : 0
      case 'rating':
        return b.rating - a.rating
      default: // relevance - 匹配度排序，这里简化处理
        if (query) {
          const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase())
          const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase())
          
          if (aNameMatch && !bNameMatch) return -1
          if (!aNameMatch && bNameMatch) return 1
        }
        return 0
    }
  })
  
  // 获取当前选中的分类和品牌名称
  const selectedCategory = categoryFilter ? categories.find(c => c.id === categoryFilter) : undefined
  const selectedBrand = brandFilter ? brands.find(b => b.id === brandFilter) : undefined
  
  return (
    <main className="min-h-screen">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {query ? `"${query}" 的搜索结果` : '搜索结果'}
          </h1>
          <p className="text-gray-600">
            {selectedCategory || selectedBrand ? 
              `${selectedBrand?.name || ''} ${selectedCategory?.name || ''} 类别中的搜索结果` 
              : '浏览搜索结果，找到适合您的自行车和配件。'}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* 过滤栏 */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ProductFilter 
              categories={categories} 
              brands={brands}
              selectedCategory={categoryFilter}
              selectedBrand={brandFilter}
            />
            
            {/* 排序选项 */}
            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">排序方式</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-relevance"
                    name="sort"
                    checked={sortBy === 'relevance'}
                    onChange={() => {
                      const url = new URL(window.location.href)
                      url.searchParams.set('sort', 'relevance')
                      window.location.href = url.toString()
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="sort-relevance" className="text-sm cursor-pointer">相关度</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-price-asc"
                    name="sort"
                    checked={sortBy === 'price-asc'}
                    onChange={() => {
                      const url = new URL(window.location.href)
                      url.searchParams.set('sort', 'price-asc')
                      window.location.href = url.toString()
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="sort-price-asc" className="text-sm cursor-pointer">价格（从低到高）</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-price-desc"
                    name="sort"
                    checked={sortBy === 'price-desc'}
                    onChange={() => {
                      const url = new URL(window.location.href)
                      url.searchParams.set('sort', 'price-desc')
                      window.location.href = url.toString()
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="sort-price-desc" className="text-sm cursor-pointer">价格（从高到低）</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-newest"
                    name="sort"
                    checked={sortBy === 'newest'}
                    onChange={() => {
                      const url = new URL(window.location.href)
                      url.searchParams.set('sort', 'newest')
                      window.location.href = url.toString()
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="sort-newest" className="text-sm cursor-pointer">最新上架</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-rating"
                    name="sort"
                    checked={sortBy === 'rating'}
                    onChange={() => {
                      const url = new URL(window.location.href)
                      url.searchParams.set('sort', 'rating')
                      window.location.href = url.toString()
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="sort-rating" className="text-sm cursor-pointer">评分</label>
                </div>
              </div>
            </div>
          </div>
          
          {/* 商品列表 */}
          <div className="flex-grow">
            {sortedProducts.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-gray-600">显示 {sortedProducts.length} 个商品</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">没有找到符合条件的商品</h3>
                <p className="text-gray-600 mb-4">请尝试使用其他关键词或更改筛选条件</p>
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