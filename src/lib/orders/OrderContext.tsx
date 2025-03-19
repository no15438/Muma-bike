'use client'

import { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { Order, OrderStatus } from './types'
import { CartItem } from '@/lib/cart/types'
import { useUser } from '@/lib/auth/UserContext'

type OrderContextType = {
  orders: Order[]
  createOrder: (items: CartItem[], shippingAddress: any) => Promise<Order>
  getOrderById: (orderId: string) => Order | undefined
  getUserOrders: () => Order[]
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  calculateTax: (subtotal: number) => number
  calculateShipping: (subtotal: number) => number
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const { user } = useUser()

  // 初始化 - 从本地存储加载订单
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (error) {
        console.error('Error parsing orders from localStorage', error)
        setOrders([])
      }
    }
  }, [])

  // 保存到本地存储
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(orders))
    }
  }, [orders])

  // 创建新订单
  const createOrder = async (items: CartItem[], shippingAddress: any): Promise<Order> => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = calculateShipping(subtotal)
    const tax = calculateTax(subtotal)
    const total = subtotal + shipping + tax

    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      userId: user?.id || 'guest',
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: total,
      status: 'pending',
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setOrders(prev => [...prev, newOrder])
    return newOrder
  }

  // 根据ID获取订单
  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId)
  }

  // 获取用户的所有订单
  const getUserOrders = () => {
    if (!user) return []
    return orders.filter(order => order.userId === user.id)
  }

  // 更新订单状态
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => {
        if (order.id === orderId) {
          const updatedOrder = { 
            ...order, 
            status, 
            updatedAt: new Date().toISOString() 
          }
          
          // 设置特定的时间戳
          if (status === 'paid' && !order.paidAt) {
            updatedOrder.paidAt = new Date().toISOString()
          } else if (status === 'shipped' && !order.shippedAt) {
            updatedOrder.shippedAt = new Date().toISOString()
          } else if (status === 'delivered' && !order.deliveredAt) {
            updatedOrder.deliveredAt = new Date().toISOString()
          }
          
          return updatedOrder
        }
        return order
      })
    )
  }

  // 计算税费 (模拟，实际应用中可能需要更复杂的计算)
  const calculateTax = (subtotal: number) => {
    return subtotal * 0.13 // 假设13%的税率
  }

  // 计算运费 (模拟)
  const calculateShipping = (subtotal: number) => {
    // 购物金额超过199免运费，否则20元运费
    return subtotal >= 199 ? 0 : 20
  }

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      getOrderById,
      getUserOrders,
      updateOrderStatus,
      calculateTax,
      calculateShipping
    }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
} 