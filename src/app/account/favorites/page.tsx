'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@/lib/auth/UserContext'
import { Product } from '@/lib/data'

// 假设的收藏夹数据结构
type FavoriteItem = {
  id: string
  productId: string
  userId: string
  product: Product
  createdAt: string
}

export default function FavoritesPage() {
  const { user } = useUser()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // 模拟从本地存储加载收藏夹数据
    const loadFavorites = () => {
      setLoading(true)
      try {
        // 这里模拟从localStorage获取数据
        // 实际应用中可能会从API获取
        const savedFavorites = localStorage.getItem('favorites')
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites) as FavoriteItem[]
          // 过滤出当前用户的收藏
          const userFavorites = parsedFavorites.filter(fav => fav.userId === user?.id)
          setFavorites(userFavorites)
        } else {
          setFavorites([])
        }
      } catch (error) {
        console.error('Failed to load favorites:', error)
        setFavorites([])
      } finally {
        setLoading(false)
      }
    }
    
    loadFavorites()
  }, [user])
  
  // 移除收藏
  const removeFavorite = (favoriteId: string) => {
    try {
      // 从状态中移除
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId))
      
      // 从localStorage中移除
      const savedFavorites = localStorage.getItem('favorites')
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites) as FavoriteItem[]
        const updatedFavorites = parsedFavorites.filter(fav => fav.id !== favoriteId)
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    }
  }
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">我的收藏</h1>
        <Link href="/products" className="text-primary text-sm hover:underline">
          浏览更多商品
        </Link>
      </div>
      
      <div className="p-6">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-300 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              暂无收藏商品
            </h3>
            <p className="text-gray-500 mb-6">
              您可以将喜欢的商品添加到收藏夹，方便以后查看
            </p>
            <Link href="/products" className="btn-primary">
              浏览商品
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(favorite => (
              <div key={favorite.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={favorite.product.images[0]}
                    alt={favorite.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2 text-lg">{favorite.product.name}</h3>
                  <p className="text-primary font-bold mb-3">¥{favorite.product.price.toFixed(2)}</p>
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/products/${favorite.productId}`} 
                      className="text-primary hover:underline"
                    >
                      查看详情
                    </Link>
                    <button
                      onClick={() => removeFavorite(favorite.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 