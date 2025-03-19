'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import AddToFavoritesButton from './AddToFavoritesButton';
import { useBrands } from '@/lib/brands/BrandContext';
import { Product, Category } from '@/lib/data';

type Props = {
  product: Product;
  category: Category | undefined;
  discountPercent: number | undefined;
  relatedProducts: Product[];
};

function BrandViewer({ brandId }: { brandId: string }) {
  const { brands } = useBrands();
  const brand = brands.find(b => b.id === brandId);
  
  if (!brand) return null;
  
  return (
    <Link 
      href={`/products?brand=${brand.id}`}
      className="inline-block text-primary hover:underline mb-3"
    >
      {brand.name}
    </Link>
  );
}

export default function ProductClient({ product, category, discountPercent, relatedProducts }: Props) {
  // 用于图片库的状态
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  return (
    <>
      {/* 商品信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* 商品图片 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-card">
          <div className="relative aspect-square">
            <Image 
              src={product.images[activeImageIndex] || product.images[0]} 
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {discountPercent && (
              <span className="absolute top-4 right-4 bg-accent text-dark text-sm font-semibold px-2 py-1 rounded">
                -{discountPercent}%
              </span>
            )}
          </div>
          
          {/* 如果有多张图片，显示缩略图 */}
          {product.images.length > 1 && (
            <div className="flex gap-2 p-4">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative w-16 h-16 border rounded cursor-pointer overflow-hidden ${
                    index === activeImageIndex ? 'border-primary' : 'border-gray-200'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image 
                    src={image} 
                    alt={`${product.name} - 图片 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 商品详情 */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          {/* 品牌信息 - 使用BrandViewer组件 */}
          <BrandViewer brandId={product.brand} />
          
          {/* 评分 */}
          <div className="flex items-center mb-4">
            <div className="flex text-accent">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ) : i === Math.floor(product.rating) && product.rating % 1 > 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  )}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">{product.rating.toFixed(1)} ({product.reviews} 条评价)</span>
          </div>
          
          {/* 价格 */}
          <div className="mb-6">
            {product.originalPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">¥{product.price.toLocaleString()}</span>
                <span className="text-xl text-gray-500 line-through">¥{product.originalPrice.toLocaleString()}</span>
                {discountPercent && (
                  <span className="text-sm text-accent font-medium">
                    节省 {discountPercent}%
                  </span>
                )}
              </div>
            ) : (
              <span className="text-3xl font-bold">¥{product.price.toLocaleString()}</span>
            )}
          </div>
          
          {/* 库存状态 */}
          <div className="mb-6">
            {product.stock > 10 ? (
              <span className="text-success font-medium">有货</span>
            ) : product.stock > 0 ? (
              <span className="text-accent font-medium">库存紧张，仅剩 {product.stock} 件</span>
            ) : (
              <span className="text-danger font-medium">缺货</span>
            )}
          </div>
          
          {/* 描述 */}
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          {/* 加入购物车按钮 */}
          <div className="mb-6">
            <div className="flex gap-3">
              <AddToCartButton product={product} />
              <AddToFavoritesButton product={product} />
            </div>
          </div>
          
          {/* 特性列表 */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">产品特点</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* 相关商品 */}
      {relatedProducts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">相关商品</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <Link 
                key={relatedProduct.id} 
                href={`/products/${relatedProduct.id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <Image 
                    src={relatedProduct.images[0]} 
                    alt={relatedProduct.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{relatedProduct.name}</h3>
                  <p className="text-primary font-medium mt-2">¥{relatedProduct.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
} 