'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import AppointmentForm from '@/components/AppointmentForm'
import AppointmentConfirmation from '@/components/AppointmentConfirmation'
import { useAppointments } from '@/lib/appointments/AppointmentContext'
import { useUser } from '@/lib/auth/UserContext'

export default function FittingBookingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [appointmentData, setAppointmentData] = useState<any>(null)
  const { addAppointment } = useAppointments()
  const { user, isAuthenticated } = useUser()
  const router = useRouter()
  
  const handleSubmit = (formData: any) => {
    // 在实际应用中，这里会发送请求到后端API
    // 这里我们模拟一个成功的响应
    const appointmentId = 'F' + Date.now().toString().slice(-6)
    
    const appointment = {
      id: appointmentId,
      ...formData,
      userId: user?.id || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // 保存到上下文
    addAppointment(appointment)
    
    setAppointmentData(appointment)
    setIsSubmitted(true)
  }
  
  return (
    <main className="min-h-screen pb-16">
      {/* 页面头部 */}
      <section className="relative bg-primary text-white py-16">
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">预约Bike Fitting服务</h1>
            <p className="text-lg">
              专业的骑行姿势调校服务，帮助您找到最舒适的骑行姿势，提高骑行效率，减少疲劳和疼痛。
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3" 
            alt="Bike Fitting服务" 
            className="object-cover"
            fill
            priority
          />
        </div>
      </section>
      
      {/* 面包屑导航 */}
      <div className="container-custom py-4">
        <nav className="text-sm">
          <ol className="flex space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-primary">首页</Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link href="/services" className="text-gray-500 hover:text-primary">服务</Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-primary font-medium">预约Bike Fitting服务</li>
          </ol>
        </nav>
      </div>
      
      {/* Bike Fitting简介 */}
      <section className="container-custom py-8">
        <div className="bg-light rounded-lg p-6 mb-10">
          <h2 className="text-2xl font-bold mb-4">什么是Bike Fitting？</h2>
          <p className="text-gray-700 mb-4">
            Bike Fitting是一种专业的自行车调校服务，通过对骑行者身体数据的测量和分析，
            调整自行车各部件的位置和角度，使骑行者在骑行过程中保持最佳姿势，提高骑行效率，
            减少疲劳和不适，预防运动伤害。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">提高舒适度</h3>
              <p className="text-sm text-gray-600">减少骑行中的不适感，让长时间骑行更加舒适</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">提高效率</h3>
              <p className="text-sm text-gray-600">优化骑行姿势和动力传递，让每一次踩踏更有效率</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">预防伤害</h3>
              <p className="text-sm text-gray-600">减少关节压力和肌肉紧张，预防常见的骑行相关伤害</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 预约表单或确认页面 */}
      <section className="container-custom py-8">
        {!isSubmitted ? (
          <div className="max-w-4xl mx-auto">
            {isAuthenticated && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  您已以 <strong>{user?.name}</strong> 身份登录。预约将与您的账户关联。
                </p>
              </div>
            )}
            
            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row justify-between items-center">
                <p className="text-blue-800 mb-3 sm:mb-0">
                  登录以跟踪和管理您的预约。
                </p>
                <div className="flex space-x-3">
                  <Link href="/login" className="btn-secondary text-sm py-2">
                    登录
                  </Link>
                  <Link href="/register" className="btn-primary text-sm py-2">
                    注册
                  </Link>
                </div>
              </div>
            )}
            
            <AppointmentForm 
              serviceType="fitting" 
              onSubmit={handleSubmit} 
            />
          </div>
        ) : (
          <div>
            <AppointmentConfirmation appointmentData={appointmentData} />
            
            <div className="text-center mt-8">
              <button
                onClick={() => router.push('/account/appointments')}
                className="btn-primary px-6 py-2"
              >
                查看我的预约
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
} 