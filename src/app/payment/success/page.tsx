'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useOrders } from '@/lib/orders/OrderContext'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { orders, getOrderById } = useOrders()
  const [orderDetails, setOrderDetails] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  
  // 获取订单ID
  const orderId = searchParams.get('orderId')
  
  useEffect(() => {
    // 如果没有订单ID，重定向到首页
    if (!orderId) {
      router.push('/')
      return
    }
    
    // 获取订单详情
    const order = getOrderById(orderId)
    if (order) {
      setOrderDetails(order)
      // 更新订单状态为已支付（在实际应用中，这应该由支付回调处理）
      // updateOrderStatus(orderId, 'paid')
    }
    
    setLoading(false)
  }, [orderId, router, getOrderById])
  
  if (loading) {
    return (
      <div className="container-custom py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载订单信息...</p>
        </div>
      </div>
    )
  }
  
  if (!orderDetails) {
    return (
      <div className="container-custom py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mx-auto mb-4 text-yellow-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <h1 className="text-2xl font-bold mb-4">未找到订单信息</h1>
          <p className="text-gray-600 mb-6">
            很抱歉，我们无法找到相关订单信息。这可能是因为链接已过期或无效。
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/account/orders" className="btn">
              查看我的订单
            </Link>
            <Link href="/" className="btn-outline">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container-custom py-16">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-green-100 rounded-full w-20 h-20 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">支付成功！</h1>
          <p className="text-gray-600 mt-2">
            您的订单已成功支付，感谢您在牧马单车的购物。
          </p>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">订单编号：</span>
            <span className="font-medium">{orderDetails.id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">订单时间：</span>
            <span>{new Date(orderDetails.date).toLocaleString('zh-CN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">支付金额：</span>
            <span className="font-bold text-primary">¥{orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-3">商品清单</h2>
          <div className="space-y-3">
            {orderDetails.items.map((item: any) => (
              <div key={item.id} className="flex items-center">
                <div className="bg-gray-100 rounded w-16 h-16 flex-shrink-0 mr-4">
                  <img
                    src={item.image || '/images/product-placeholder.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="flex justify-between mt-1 text-sm text-gray-600">
                    <span>数量: {item.quantity}</span>
                    <span>¥{item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">下一步</h2>
          <p className="text-gray-600 text-sm mb-2">
            我们将尽快处理您的订单，您可以随时在"我的订单"中查看订单状态。
            发货后，您将收到发货通知，您可以通过订单详情页查看物流信息。
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Link 
            href={`/account/orders/${orderId}`} 
            className="btn"
          >
            查看订单详情
          </Link>
          <Link 
            href="/products" 
            className="btn-outline"
          >
            继续购物
          </Link>
        </div>
      </div>
    </div>
  )
} 