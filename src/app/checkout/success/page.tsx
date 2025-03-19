'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useOrders } from '@/lib/orders/OrderContext'

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getOrderById, updateOrderStatus } = useOrders()
  
  useEffect(() => {
    const orderId = searchParams.get('orderId')
    
    if (!orderId) {
      router.push('/')
      return
    }
    
    const orderData = getOrderById(orderId)
    if (orderData) {
      setOrder(orderData)
      
      // 模拟支付成功，将订单状态更新为已支付
      updateOrderStatus(orderId, 'paid')
    } else {
      router.push('/cart')
    }
    
    setLoading(false)
  }, [searchParams, router, getOrderById, updateOrderStatus])
  
  if (loading) {
    return (
      <div className="container-custom py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }
  
  if (!order) {
    return (
      <div className="container-custom py-16 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">找不到订单信息</h1>
          <p className="mb-6">订单可能已过期或不存在</p>
          <Link href="/products" className="btn-primary">
            继续购物
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="container-custom py-16 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">订单提交成功！</h1>
          <p className="text-gray-600 mb-1">您的订单已成功提交并支付。</p>
          <p className="text-gray-600">
            订单号: <span className="font-medium">{order.id}</span>
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold">订单详情</h2>
          </div>
          
          <div className="p-6">
            {/* 订单信息 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">订单信息</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">订单状态</p>
                  <p className="font-medium">已支付</p>
                </div>
                <div>
                  <p className="text-gray-500">订单日期</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleString('zh-CN')}</p>
                </div>
                <div>
                  <p className="text-gray-500">支付方式</p>
                  <p className="font-medium">
                    {order.paymentMethod === 'alipay' && '支付宝'}
                    {order.paymentMethod === 'wechat' && '微信支付'}
                    {order.paymentMethod === 'creditcard' && '信用卡'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">总金额</p>
                  <p className="font-medium text-primary">¥{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            {/* 收货信息 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">收货信息</h3>
              <div className="text-sm">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>
                  {order.shippingAddress.province} {order.shippingAddress.city} {order.shippingAddress.district}
                </p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.postalCode && <p>邮编：{order.shippingAddress.postalCode}</p>}
              </div>
            </div>
            
            {/* 商品清单 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">商品清单</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item: any) => (
                      <tr key={item.productId}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          ¥{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/products" className="btn-secondary py-3 px-6">
            继续购物
          </Link>
          <Link href="/account/orders" className="btn-primary py-3 px-6">
            查看我的订单
          </Link>
        </div>
      </div>
    </main>
  )
} 