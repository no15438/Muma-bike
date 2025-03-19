'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart/CartContext'

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, itemsCount } = useCart()
  const [loading, setLoading] = useState(false)

  // 处理数量更改
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity)
    } else {
      removeItem(itemId)
    }
  }

  // 检查购物车是否为空
  if (items.length === 0) {
    return (
      <div className="container-custom py-16 min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">购物车是空的</h1>
          <p className="text-gray-600 mb-8">看起来您的购物车还没有任何商品，让我们开始选购吧！</p>
          <Link href="/products" className="btn-primary py-2 px-4">
            浏览商品
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="container-custom py-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">购物车</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 购物车列表 */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">商品列表</h2>
              <p className="text-gray-600 text-sm mt-1">
                您的购物车中共有 {itemsCount} 件商品
              </p>
            </div>
            
            <div className="divide-y">
              {items.map(item => (
                <div key={item.id} className="p-6 flex flex-wrap md:flex-nowrap">
                  <div className="w-full md:w-auto md:flex-shrink-0 mb-4 md:mb-0">
                    <div className="w-full h-40 md:w-40 md:h-40 relative rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 md:ml-6 flex flex-col">
                    <div className="flex flex-wrap justify-between mb-2">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <span className="text-lg font-bold text-primary">
                        ¥{item.price.toFixed(2)}
                      </span>
                    </div>
                    
                    {item.brand && (
                      <p className="text-gray-500 text-sm mb-4">品牌: {item.brand}</p>
                    )}
                    
                    <div className="mt-auto pt-4 flex flex-wrap justify-between items-center">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-center min-w-[40px]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        移除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 订单摘要 */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">订单摘要</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">商品数量</span>
                <span>{itemsCount}件</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">商品总价</span>
                <span>¥{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">运费</span>
                <span>{subtotal >= 199 ? '免运费' : '¥20.00'}</span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">合计</span>
                  <span className="text-xl font-bold text-primary">
                    ¥{(subtotal + (subtotal >= 199 ? 0 : 20)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <Link 
              href="/checkout" 
              className="btn-primary w-full text-center py-3 block"
            >
              去结算
            </Link>
            
            <Link 
              href="/products" 
              className="mt-4 text-primary hover:underline text-center block text-sm"
            >
              继续购物
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 