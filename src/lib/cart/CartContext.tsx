'use client'

import { Product } from '@/lib/data'
import { createContext, useContext, useEffect, useState } from 'react'

// 购物车商品类型
export type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

// 购物车上下文类型
type CartContextType = {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemsCount: number
  subtotal: number
}

// 创建上下文
const CartContext = createContext<CartContextType | undefined>(undefined)

// 提供购物车上下文的Provider组件
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  
  // 从localStorage加载购物车数据
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
        localStorage.removeItem('cart')
      }
    }
  }, [])
  
  // 保存购物车到localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(items))
    } else {
      localStorage.removeItem('cart')
    }
  }, [items])
  
  // 添加商品到购物车
  const addItem = (product: Product, quantity: number) => {
    setItems(prevItems => {
      // 检查商品是否已在购物车中
      const existingItemIndex = prevItems.findIndex(item => item.productId === product.id)
      
      if (existingItemIndex >= 0) {
        // 如果商品已在购物车中，更新数量
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // 如果商品不在购物车中，添加新商品
        return [...prevItems, {
          id: `${product.id}-${Date.now()}`, // 创建唯一ID
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity
        }]
      }
    })
  }
  
  // 从购物车移除商品
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }
  
  // 更新购物车商品数量
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    )
  }
  
  // 清空购物车
  const clearCart = () => {
    setItems([])
  }
  
  // 计算购物车商品总数
  const itemsCount = items.reduce((total, item) => total + item.quantity, 0)
  
  // 计算购物车小计
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  
  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        itemsCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// 自定义Hook，方便使用购物车上下文
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 