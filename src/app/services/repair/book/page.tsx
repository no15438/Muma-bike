'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import AppointmentForm from '@/components/AppointmentForm'
import AppointmentConfirmation from '@/components/AppointmentConfirmation'
import { useAppointments } from '@/lib/appointments/AppointmentContext'
import { useUser } from '@/lib/auth/UserContext'

export default function RepairBookingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [appointmentData, setAppointmentData] = useState<any>(null)
  const { addAppointment } = useAppointments()
  const { user, isAuthenticated } = useUser()
  const router = useRouter()
  
  const handleSubmit = (formData: any) => {
    // 在实际应用中，这里会发送请求到后端API
    // 这里我们模拟一个成功的响应
    const appointmentId = 'R' + Date.now().toString().slice(-6)
    
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">预约维修服务</h1>
            <p className="text-lg">
              选择您需要的维修服务项目，填写预约信息，我们的专业技师将为您的爱车提供最优质的服务。
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1599758022689-a8eaf83ac20c?ixlib=rb-4.0.3" 
            alt="自行车维修服务" 
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
            <li className="text-primary font-medium">预约维修服务</li>
          </ol>
        </nav>
      </div>
      
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
              serviceType="repair" 
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