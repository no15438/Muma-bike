import { useEffect, useState } from 'react'
import Link from 'next/link'
import { serviceStores } from '@/lib/services/data'
import { ServiceType } from '@/lib/services/types'

type AppointmentConfirmationProps = {
  appointmentData: {
    id: string
    serviceType: ServiceType
    name: string
    phone: string
    email?: string
    storeId: string
    dateTime: {
      date: string
      time: string
    }
    totalPrice: number
    serviceItems: string[]
  }
}

export default function AppointmentConfirmation({ appointmentData }: AppointmentConfirmationProps) {
  const [storeName, setStoreName] = useState('')
  
  useEffect(() => {
    // 获取服务点名称
    const store = serviceStores.find(s => s.id === appointmentData.storeId)
    if (store) {
      setStoreName(store.name)
    }
  }, [appointmentData.storeId])
  
  // 格式化日期
  const formattedDate = new Date(appointmentData.dateTime.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">预约成功！</h1>
        <p className="text-gray-600">
          您的预约已成功提交，我们会尽快与您联系确认。
        </p>
      </div>
      
      <div className="bg-light rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 bg-primary text-white">
          <h2 className="text-xl font-bold">预约详情</h2>
          <p className="text-sm opacity-80">预约号: {appointmentData.id}</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* 服务类型 */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">服务类型</h3>
            <p className="mt-1 text-lg">
              {appointmentData.serviceType === 'repair' ? '维修服务' : 'Bike Fitting'}
            </p>
          </div>
          
          {/* 联系信息 */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">联系信息</h3>
            <p className="mt-1">{appointmentData.name}</p>
            <p>{appointmentData.phone}</p>
            {appointmentData.email && <p>{appointmentData.email}</p>}
          </div>
          
          {/* 服务点和时间 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">服务点</h3>
              <p className="mt-1">{storeName}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">预约时间</h3>
              <p className="mt-1">{formattedDate}</p>
              <p>{appointmentData.dateTime.time}</p>
            </div>
          </div>
          
          {/* 价格 */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">总价</h3>
            <p className="mt-1 text-xl font-bold text-primary">¥{appointmentData.totalPrice}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center space-y-4">
        <p className="text-gray-600">
          我们会在服务开始前24小时内发送短信提醒。如需修改或取消预约，请致电客服。
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Link href="/" className="btn-secondary">
            返回首页
          </Link>
          
          <Link href="/services" className="btn-primary">
            查看更多服务
          </Link>
        </div>
      </div>
    </div>
  )
} 