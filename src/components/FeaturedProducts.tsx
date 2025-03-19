'use client'

import { Product } from "@/lib/data"
import ProductCard from "./ProductCard"
import Link from "next/link"
import { useState } from "react"
import { useProducts } from "@/lib/products/ProductContext"

export default function FeaturedProducts() {
  const { products, getFeaturedProducts } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  // 获取所有产品的分类
  const categories = Array.from(
    new Set(products.map(product => product.category))
  )
  
  // 根据选中的分类过滤产品
  const filteredProducts = activeCategory
    ? products.filter(product => product.category === activeCategory)
    : getFeaturedProducts()
  
  return (
    <section className="section bg-light">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">特色商品</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            探索我们精选的高品质自行车和骑行装备，为您提供卓越的骑行体验
          </p>
        </div>
        
        {/* 分类标签 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-full transition-colors ${
              activeCategory === null 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveCategory(null)}
          >
            全部特色
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === category 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'mountain' && '山地车'}
              {category === 'road' && '公路车'}
              {category === 'city' && '城市车'}
              {category === 'kids' && '儿童车'}
              {category === 'parts' && '配件'}
              {category === 'accessories' && '骑行装备'}
            </button>
          ))}
        </div>
        
        {/* 产品网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredProducts.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* "查看更多"按钮 */}
        <div className="text-center mt-8">
          <Link 
            href={activeCategory ? `/products?category=${activeCategory}` : "/products"}
            className="btn"
          >
            查看更多商品
          </Link>
        </div>
      </div>
    </section>
  )
} 