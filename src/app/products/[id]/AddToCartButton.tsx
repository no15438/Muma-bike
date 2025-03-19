'use client'

import { useState } from 'react'
import { Product } from '@/lib/data'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  
  const handleAddToCart = () => {
    setIsAdding(true)
    
    // 模拟添加到购物车的API调用
    setTimeout(() => {
      console.log(`Added to cart: ${product.name}, Quantity: ${quantity}`)
      setIsAdding(false)
      
      // 模拟成功消息
      alert(`已成功将 ${quantity} 件 ${product.name} 添加到购物车`)
    }, 600)
  }
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }
  
  const increaseQuantity = () => {
    if (product.stock > quantity) {
      setQuantity(quantity + 1)
    }
  }
  
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* 数量选择器 */}
      <div className="flex border border-gray-300 rounded-md">
        <button
          type="button"
          onClick={decreaseQuantity}
          disabled={quantity <= 1 || isAdding}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          aria-label="减少数量"
        >
          <span className="text-xl">-</span>
        </button>
        <div className="flex items-center justify-center w-10">
          {quantity}
        </div>
        <button
          type="button"
          onClick={increaseQuantity}
          disabled={quantity >= product.stock || isAdding}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          aria-label="增加数量"
        >
          <span className="text-xl">+</span>
        </button>
      </div>
      
      {/* 添加到购物车按钮 */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={product.stock === 0 || isAdding}
        className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
          product.stock === 0 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-primary hover:bg-primary-dark focus:outline-none'
        }`}
      >
        <ShoppingCartIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        {isAdding ? '添加中...' : '加入购物车'}
      </button>
    </div>
  )
} 