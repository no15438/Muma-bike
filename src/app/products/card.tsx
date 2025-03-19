'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/data'
import { useUser } from '@/lib/auth/UserContext'
import { useCart } from '@/lib/cart/CartContext'

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user, isAuthenticated } = useUser()
  const { addItem } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  // 检查产品是否在收藏夹中
  useEffect(() => {
    if (!isAuthenticated || !user) return
    
    try {
      const savedFavorites = localStorage.getItem('favorites')
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites)
        const isInFavorites = favorites.some(
          (fav: any) => fav.productId === product.id && fav.userId === user.id
        )
        setIsFavorite(isInFavorites)
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }, [product.id, user, isAuthenticated])
  
  // 切换收藏状态
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault() // 阻止卡片链接点击
    e.stopPropagation() // 停止冒泡
    
    if (!isAuthenticated) {
      alert('请先登录后再收藏商品')
      return
    }
    
    try {
      const favoriteId = `fav-${product.id}-${user!.id}-${Date.now()}`
      const favoriteItem = {
        id: favoriteId,
        productId: product.id,
        userId: user!.id,
        product,
        createdAt: new Date().toISOString()
      }
      
      // 从localStorage获取现有收藏
      const savedFavorites = localStorage.getItem('favorites')
      let favorites = savedFavorites ? JSON.parse(savedFavorites) : []
      
      if (isFavorite) {
        // 如果已收藏，则移除
        favorites = favorites.filter(
          (fav: any) => !(fav.productId === product.id && fav.userId === user!.id)
        )
        setIsFavorite(false)
      } else {
        // 如果未收藏，则添加
        favorites.push(favoriteItem)
        setIsFavorite(true)
      }
      
      // 保存回localStorage
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }
  
  // 添加到购物车
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // 阻止卡片链接点击
    e.stopPropagation() // 停止冒泡
    
    setIsAddingToCart(true)
    addItem(product, 1)
    
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 1000)
  }

  return (
    <Link 
      href={`/products/${product.id}`} 
      className="group bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow"
    >
      {/* 商品图片 */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image 
          src={product.images[0]} 
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* 收藏按钮 */}
        <button
          onClick={toggleFavorite}
          className={`
            absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors
            ${isFavorite 
              ? 'bg-red-50 text-red-500 hover:bg-red-100' 
              : 'bg-white/80 text-gray-500 hover:bg-white'}
          `}
          aria-label={isFavorite ? '取消收藏' : '添加到收藏'}
        >
          {isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          )}
        </button>
        
        {/* 折扣标签 */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-accent text-dark text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
      </div>
      
      {/* 商品信息 */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
        
        {/* 价格 */}
        <div className="flex items-center mb-3">
          <span className="text-primary font-bold">¥{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ¥{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        {/* 快速添加到购物车按钮 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-accent text-sm">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(product.rating) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                )}
              </span>
            ))}
            <span className="ml-1">{product.rating.toFixed(1)}</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            className={`
              p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors
              ${isAddingToCart ? 'opacity-70' : ''}
              ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : ''}
            `}
            aria-label="添加到购物车"
          >
            {isAddingToCart ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
} 