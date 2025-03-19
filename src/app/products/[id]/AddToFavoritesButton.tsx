'use client'

import { useState } from 'react'
import { Product } from '@/lib/data'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

interface AddToFavoritesButtonProps {
  product: Product
}

export default function AddToFavoritesButton({ product }: AddToFavoritesButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  
  const handleToggleFavorite = () => {
    setIsAdding(true)
    
    // 模拟添加到收藏夹的API调用
    setTimeout(() => {
      setIsFavorite(!isFavorite)
      setIsAdding(false)
      
      // 模拟成功消息
      if (!isFavorite) {
        console.log(`Added to favorites: ${product.name}`)
      } else {
        console.log(`Removed from favorites: ${product.name}`)
      }
    }, 300)
  }
  
  return (
    <button
      type="button"
      onClick={handleToggleFavorite}
      disabled={isAdding}
      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
      title={isFavorite ? "从收藏夹移除" : "添加到收藏夹"}
    >
      {isFavorite ? (
        <HeartIconSolid className="h-6 w-6 text-red-500" />
      ) : (
        <HeartIcon className="h-6 w-6 text-gray-500" />
      )}
    </button>
  )
} 