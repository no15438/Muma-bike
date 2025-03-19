import { categories, products } from '@/lib/data'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductClient from './ProductClient'

type Props = {
  params: { id: string }
}

export function generateMetadata({ params }: Props): Metadata {
  const product = products.find(p => p.id === params.id)
  
  if (!product) {
    return {
      title: '商品未找到 | 牧马单车',
      description: '您查找的商品不存在或已被移除。',
    }
  }
  
  return {
    title: `${product.name} | 牧马单车`,
    description: product.description.substring(0, 160),
  }
}

export default function ProductPage({ params }: Props) {
  const product = products.find(p => p.id === params.id)
  
  if (!product) {
    notFound()
  }
  
  const category = categories.find(c => c.id === product.category)
  
  // 计算折扣百分比
  const discountPercent = product.discount || (product.originalPrice && 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100))
  
  // 获取相关商品（同分类的其他商品）
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)
  
  return (
    <main className="min-h-screen py-8">
      <div className="container-custom">
        {/* 面包屑导航 */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center flex-wrap">
            <li className="flex items-center">
              <Link href="/" className="text-gray-500 hover:text-primary">
                首页
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link href="/products" className="text-gray-500 hover:text-primary">
                商品
              </Link>
              <span className="mx-2">/</span>
            </li>
            {category && (
              <li className="flex items-center">
                <Link 
                  href={`/products?category=${category.id}`} 
                  className="text-gray-500 hover:text-primary"
                >
                  {category.name}
                </Link>
                <span className="mx-2">/</span>
              </li>
            )}
            <li className="text-gray-700">{product.name}</li>
          </ol>
        </nav>
        
        {/* 将产品详情部分传递给客户端组件 */}
        <ProductClient 
          product={product} 
          category={category} 
          discountPercent={discountPercent} 
          relatedProducts={relatedProducts} 
        />
      </div>
    </main>
  )
} 