'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/auth/UserContext'
import { useAppointments } from '@/lib/appointments/AppointmentContext'
import { Appointment, ServiceType } from '@/lib/services/types'
import { serviceStores, serviceItems } from '@/lib/services/data'

export default function AppointmentsPage() {
  const { user, isAuthenticated, logout } = useUser()
  const { appointments, cancelAppointment } = useAppointments()
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    // 如果用户未登录，重定向到登录页面
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    // 过滤出当前用户的预约
    const filteredAppointments = appointments.filter(
      appointment => appointment.userId === user?.id
    )
    
    setUserAppointments(filteredAppointments)
    setIsLoading(false)
  }, [isAuthenticated, user, appointments, router])
  
  // 取消预约
  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm('确定要取消此预约吗？')) {
      cancelAppointment(appointmentId)
    }
  }
  
  // 获取服务点名称
  const getStoreName = (storeId: string) => {
    const store = serviceStores.find(store => store.id === storeId)
    return store ? store.name : '未知服务点'
  }
  
  // 获取服务名称
  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds.map(id => {
      const service = serviceItems.find(item => item.id === id)
      return service ? service.name : '未知服务'
    }).join(', ')
  }
  
  // 获取状态中文名
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': '待确认',
      'confirmed': '已确认',
      'completed': '已完成',
      'cancelled': '已取消'
    }
    return statusMap[status] || status
  }
  
  // 获取状态CSS类
  const getStatusClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    }
    return statusClasses[status] || 'bg-gray-100 text-gray-800'
  }
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }
  
  // 格式化时间
  const formatDateTime = (date: string, time: string) => {
    return `${formatDate(date)} ${time}`
  }
  
  // 服务类型显示
  const getServiceTypeText = (type: ServiceType) => {
    return type === 'repair' ? '维修服务' : 'Bike Fitting'
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* 页面标题 */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">我的预约</h1>
            {user && (
              <p className="text-gray-600">
                欢迎回来，{user.name}
              </p>
            )}
          </div>
          
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => logout()}
              className="text-gray-600 hover:text-primary flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              登出
            </button>
          </div>
        </div>
        
        {/* 预约列表 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">预约记录</h2>
            <p className="text-gray-600 text-sm mt-1">
              查看并管理您的所有预约
            </p>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">加载中...</p>
            </div>
          ) : userAppointments.length === 0 ? (
            <div className="p-6">
              <div className="text-center py-8">
                <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  暂无预约记录
                </h3>
                <p className="text-gray-600 mb-6">
                  您还没有预约任何服务，立即预约体验我们的专业服务
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Link href="/services/repair/book" className="btn-primary py-2 px-4">
                    预约维修服务
                  </Link>
                  <Link href="/services/fitting/book" className="btn-secondary py-2 px-4">
                    预约Bike Fitting
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      预约编号
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      服务类型
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      服务项目
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      预约时间
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      服务点
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getServiceTypeText(appointment.serviceType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getServiceNames(appointment.serviceItems)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(appointment.dateTime.date, appointment.dateTime.time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getStoreName(appointment.storeId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            取消预约
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* 快速链接 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-3">预约维修服务</h3>
            <p className="text-gray-600 mb-4">
              我们提供专业的自行车维修服务，保持您的爱车最佳状态。
            </p>
            <Link href="/services/repair/book" className="text-primary hover:text-primary-dark font-medium">
              立即预约 &rarr;
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-3">预约Bike Fitting</h3>
            <p className="text-gray-600 mb-4">
              专业的骑行姿势调校，让您的骑行更舒适、更高效。
            </p>
            <Link href="/services/fitting/book" className="text-primary hover:text-primary-dark font-medium">
              立即预约 &rarr;
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-3">浏览商品</h3>
            <p className="text-gray-600 mb-4">
              发现高品质的自行车、配件和骑行装备。
            </p>
            <Link href="/products" className="text-primary hover:text-primary-dark font-medium">
              查看商品 &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 