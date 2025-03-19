'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useOrders } from '@/lib/orders/OrderContext'
import { useUser } from '@/lib/auth/UserContext'
import { Order, OrderStatus } from '@/lib/orders/types'

export default function OrdersPage() {
  const { orders, getUserOrders } = useOrders()
  const { user, isAuthenticated } = useUser()
  const router = useRouter()
  
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<OrderStatus | 'all'>('all')
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    // 获取当前用户的订单
    const orders = getUserOrders()
    setUserOrders(orders)
    setLoading(false)
  }, [isAuthenticated, router, getUserOrders, orders])
  
  // 按状态筛选订单
  const filteredOrders = selectedTab === 'all' 
    ? userOrders 
    : userOrders.filter(order => order.status === selectedTab)
  
  // 订单状态信息
  const getStatusInfo = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { text: string, color: string }> = {
      'pending': { text: '待支付', color: 'text-yellow-600 bg-yellow-100' },
      'paid': { text: '已支付', color: 'text-blue-600 bg-blue-100' },
      'shipped': { text: '已发货', color: 'text-indigo-600 bg-indigo-100' },
      'delivered': { text: '已送达', color: 'text-purple-600 bg-purple-100' },
      'completed': { text: '已完成', color: 'text-green-600 bg-green-100' },
      'cancelled': { text: '已取消', color: 'text-gray-600 bg-gray-100' }
    }
    
    return statusMap[status] || { text: status, color: 'text-gray-600 bg-gray-100' }
  }
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <h1 className="text-2xl font-bold">我的订单</h1>
        <Link href="/products" className="text-primary text-sm hover:underline">
          继续购物
        </Link>
      </div>
      
      {/* 状态筛选标签页 */}
      <div className="border-b">
        <div className="flex overflow-x-auto scrollbar-hide">
          <button
            className={`pb-2 px-4 font-medium whitespace-nowrap ${
              selectedTab === 'all' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('all')}
          >
            全部订单
          </button>
          <button
            className={`pb-2 px-4 font-medium whitespace-nowrap ${
              selectedTab === 'pending' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('pending')}
          >
            待支付
          </button>
          <button
            className={`pb-2 px-4 font-medium whitespace-nowrap ${
              selectedTab === 'paid' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('paid')}
          >
            已支付
          </button>
          <button
            className={`pb-2 px-4 font-medium whitespace-nowrap ${
              selectedTab === 'shipped' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('shipped')}
          >
            已发货
          </button>
          <button
            className={`pb-2 px-4 font-medium whitespace-nowrap ${
              selectedTab === 'completed' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('completed')}
          >
            已完成
          </button>
        </div>
      </div>
      
      {/* 订单列表 */}
      <div className="p-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-300 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              没有{selectedTab !== 'all' ? getStatusInfo(selectedTab as OrderStatus).text : ''}订单
            </h3>
            <p className="text-gray-500 mb-8">
              您还没有{selectedTab !== 'all' ? getStatusInfo(selectedTab as OrderStatus).text : ''}的订单
            </p>
            <Link href="/products" className="btn-primary">
              浏览商品
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredOrders.map(order => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                {/* 订单头部 */}
                <div className="px-4 py-3 bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <span className="text-sm text-gray-500">订单号: {order.id}</span>
                    <span className="text-sm text-gray-500">下单时间: {formatDate(order.createdAt)}</span>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(order.status).color}`}>
                      {getStatusInfo(order.status).text}
                    </span>
                  </div>
                </div>
                
                {/* 订单商品 */}
                <div className="divide-y">
                  {order.items.map(item => (
                    <div key={item.productId} className="p-4 flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">¥{item.price.toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">数量: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 订单底部 */}
                <div className="border-t px-4 py-3 bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center">
                  <div className="text-base font-medium">
                    总计: <span className="text-primary">¥{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 sm:mt-0 flex gap-3">
                    <Link 
                      href={`/account/orders/${order.id}`} 
                      className="text-primary text-sm hover:underline"
                    >
                      查看详情
                    </Link>
                    {order.status === 'pending' && (
                      <button 
                        className="text-red-600 text-sm hover:underline"
                      >
                        取消订单
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button 
                        className="text-green-600 text-sm hover:underline"
                      >
                        确认收货
                      </button>
                    )}
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