'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@/lib/auth/UserContext'
import { useOrders } from '@/lib/orders/OrderContext'
import { useAppointments } from '@/lib/appointments/AppointmentContext'

export default function AccountPage() {
  const { user, isAuthenticated } = useUser()
  const { orders, getUserOrders } = useOrders()
  const { appointments } = useAppointments()
  const router = useRouter()
  
  // 获取用户的订单和预约
  const userOrders = getUserOrders()
  const userAppointments = appointments.filter(appointment => appointment.userId === user?.id)
  
  // 最近的订单和预约
  const recentOrders = userOrders.slice(0, 2)
  const recentAppointments = userAppointments.slice(0, 2)
  
  // 订单状态信息
  const getOrderStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string, color: string }> = {
      'pending': { text: '待支付', color: 'text-yellow-600 bg-yellow-100' },
      'paid': { text: '已支付', color: 'text-blue-600 bg-blue-100' },
      'shipped': { text: '已发货', color: 'text-indigo-600 bg-indigo-100' },
      'delivered': { text: '已送达', color: 'text-purple-600 bg-purple-100' },
      'completed': { text: '已完成', color: 'text-green-600 bg-green-100' },
      'cancelled': { text: '已取消', color: 'text-gray-600 bg-gray-100' }
    }
    
    return statusMap[status] || { text: status, color: 'text-gray-600 bg-gray-100' }
  }
  
  // 预约状态信息
  const getAppointmentStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string, color: string }> = {
      'pending': { text: '待确认', color: 'text-yellow-600 bg-yellow-100' },
      'confirmed': { text: '已确认', color: 'text-blue-600 bg-blue-100' },
      'completed': { text: '已完成', color: 'text-green-600 bg-green-100' },
      'cancelled': { text: '已取消', color: 'text-gray-600 bg-gray-100' }
    }
    
    return statusMap[status] || { text: status, color: 'text-gray-600 bg-gray-100' }
  }
  
  // 获取订单和预约的统计信息
  const pendingOrders = userOrders.filter(order => order.status === 'pending').length
  const completedOrders = userOrders.filter(order => order.status === 'completed').length
  const pendingAppointments = userAppointments.filter(appointment => 
    appointment.status === 'pending' || appointment.status === 'confirmed'
  ).length
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      {/* 欢迎和统计卡片 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">个人中心</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-light p-4 rounded-lg flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">待支付订单</h3>
              <p className="text-2xl font-bold">{pendingOrders}</p>
            </div>
          </div>
          
          <div className="bg-light p-4 rounded-lg flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">已完成订单</h3>
              <p className="text-2xl font-bold">{completedOrders}</p>
            </div>
          </div>
          
          <div className="bg-light p-4 rounded-lg flex items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">待处理预约</h3>
              <p className="text-2xl font-bold">{pendingAppointments}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 最近订单 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">最近订单</h2>
          <Link href="/account/orders" className="text-primary text-sm hover:underline">
            查看全部
          </Link>
        </div>
        
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">暂无订单记录</p>
              <Link href="/products" className="text-primary text-sm mt-2 inline-block hover:underline">
                开始购物
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentOrders.map(order => (
                <div key={order.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-500">订单号: {order.id}</p>
                      <p className="text-sm text-gray-500">下单时间: {formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusInfo(order.status).color}`}>
                      {getOrderStatusInfo(order.status).text}
                    </span>
                  </div>
                  
                  <div className="flex items-center mt-3">
                    <div className="flex items-center flex-1 overflow-hidden">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="relative -mr-3" style={{ zIndex: 10 - index }}>
                          <div className="h-10 w-10 rounded-full border-2 border-white overflow-hidden">
                            <Image 
                              src={item.image} 
                              alt={item.name} 
                              width={40} 
                              height={40} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 3 && (
                        <div className="ml-1 text-sm text-gray-500">
                          +{order.items.length - 3}件商品
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">¥{order.totalAmount.toFixed(2)}</p>
                      <Link 
                        href={`/account/orders/${order.id}`} 
                        className="text-primary text-sm hover:underline"
                      >
                        查看详情
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* 最近预约 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">最近预约</h2>
          <Link href="/account/appointments" className="text-primary text-sm hover:underline">
            查看全部
          </Link>
        </div>
        
        <div className="p-6">
          {recentAppointments.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">暂无预约记录</p>
              <div className="flex justify-center mt-2 space-x-3">
                <Link href="/services/repair/book" className="text-primary text-sm hover:underline">
                  预约维修服务
                </Link>
                <Link href="/services/fitting/book" className="text-primary text-sm hover:underline">
                  预约Bike Fitting
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {recentAppointments.map(appointment => (
                <div key={appointment.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {appointment.serviceType === 'repair' ? '维修服务' : 'Bike Fitting'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        预约时间: {formatDate(appointment.dateTime.date)} {appointment.dateTime.time}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAppointmentStatusInfo(appointment.status).color}`}>
                      {getAppointmentStatusInfo(appointment.status).text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* 账户设置快捷入口 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">账户设置</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/account/settings" className="border rounded-lg p-4 hover:border-primary transition-colors flex items-center">
            <div className="h-10 w-10 bg-light rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">个人信息</h3>
              <p className="text-xs text-gray-500">修改您的个人信息</p>
            </div>
          </Link>
          
          <Link href="/account/settings#password" className="border rounded-lg p-4 hover:border-primary transition-colors flex items-center">
            <div className="h-10 w-10 bg-light rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">修改密码</h3>
              <p className="text-xs text-gray-500">更新您的账户密码</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 