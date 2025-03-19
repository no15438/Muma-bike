import { useState, useEffect } from 'react'
import { ServiceItem, ServiceStore, ServiceType } from '@/lib/services/types'
import { getServiceItemsByType, getAvailableDates, getAvailableTimeSlotsByDate, serviceStores } from '@/lib/services/data'

type AppointmentFormProps = {
  serviceType: ServiceType
  onSubmit: (formData: any) => void
}

export default function AppointmentForm({ serviceType, onSubmit }: AppointmentFormProps) {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<{ time: string; id: string }[]>([])
  const [selectedStore, setSelectedStore] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    bikeInfo: {
      brand: '',
      model: '',
      type: ''
    },
    fittingData: {
      height: '',
      weight: '',
      inseam: '',
      flexibility: 'medium',
      ridingExperience: 'intermediate',
      painPoints: [] as string[]
    }
  })
  const [totalPrice, setTotalPrice] = useState(0)

  // 获取该类型的服务项目
  useEffect(() => {
    const items = getServiceItemsByType(serviceType)
    setServices(items)
  }, [serviceType])

  // 获取可用日期
  useEffect(() => {
    const dates = getAvailableDates()
    setAvailableDates(dates)
  }, [])

  // 当日期变化时，获取该日期的可用时间段
  useEffect(() => {
    if (!selectedDate) return
    
    const slots = getAvailableTimeSlotsByDate(selectedDate)
    setAvailableTimes(slots.map(slot => ({ 
      time: slot.time,
      id: slot.id
    })))
  }, [selectedDate])

  // 计算总价
  useEffect(() => {
    const total = services
      .filter(service => selectedServices.includes(service.id))
      .reduce((sum, service) => sum + service.price, 0)
    
    setTotalPrice(total)
  }, [selectedServices, services])

  // 选择服务项目
  const handleServiceSelect = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId)
      } else {
        return [...prev, serviceId]
      }
    })
  }

  // 表单输入改变
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('bikeInfo.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        bikeInfo: {
          ...prev.bikeInfo,
          [field]: value
        }
      }))
    } else if (name.startsWith('fittingData.')) {
      const field = name.split('.')[1]
      if (field === 'painPoints') {
        // 处理多选
        const painPoints = value.split(',').map(item => item.trim())
        setFormData(prev => ({
          ...prev,
          fittingData: {
            ...prev.fittingData,
            painPoints
          }
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          fittingData: {
            ...prev.fittingData,
            [field]: value
          }
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedStore || !selectedDate || !selectedTime || selectedServices.length === 0) {
      alert('请选择服务项目、服务点、日期和时间')
      return
    }
    
    if (!formData.name || !formData.phone) {
      alert('请填写姓名和联系电话')
      return
    }
    
    // 准备提交数据
    const appointmentData = {
      serviceType,
      serviceItems: selectedServices,
      storeId: selectedStore,
      dateTime: {
        date: selectedDate,
        time: selectedTime
      },
      totalPrice,
      ...formData
    }
    
    onSubmit(appointmentData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 服务项目选择 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">选择服务项目</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(service => (
            <div
              key={service.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedServices.includes(service.id)
                  ? 'bg-primary bg-opacity-10 border-primary'
                  : 'border-gray-200 hover:border-primary'
              }`}
              onClick={() => handleServiceSelect(service.id)}
            >
              <div className="flex justify-between">
                <h4 className="font-medium">{service.name}</h4>
                <span className="text-primary font-bold">¥{service.price}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{service.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-500">约 {service.duration} 分钟</span>
                <div className="h-5 w-5 flex items-center justify-center border border-primary rounded-full">
                  {selectedServices.includes(service.id) && (
                    <div className="h-3 w-3 bg-primary rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 服务点选择 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">选择服务点</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {serviceStores.map(store => (
            <div
              key={store.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedStore === store.id
                  ? 'bg-primary bg-opacity-10 border-primary'
                  : 'border-gray-200 hover:border-primary'
              }`}
              onClick={() => setSelectedStore(store.id)}
            >
              <h4 className="font-medium">{store.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{store.address}</p>
              <p className="text-sm text-gray-500 mt-2">{store.openHours}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 日期和时间选择 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">选择日期和时间</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 日期选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              required
            >
              <option value="">请选择日期</option>
              {availableDates.map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long' 
                  })}
                </option>
              ))}
            </select>
          </div>
          
          {/* 时间选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">时间</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              disabled={!selectedDate}
              required
            >
              <option value="">请选择时间</option>
              {availableTimes.map(slot => (
                <option key={slot.id} value={slot.time}>
                  {slot.time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 个人信息 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">个人信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
              姓名
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
              电话
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
              邮箱（选填）
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* 自行车信息 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">自行车信息（选填）</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bike-brand">
              品牌
            </label>
            <input
              type="text"
              id="bike-brand"
              name="bikeInfo.brand"
              value={formData.bikeInfo.brand}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bike-model">
              型号
            </label>
            <input
              type="text"
              id="bike-model"
              name="bikeInfo.model"
              value={formData.bikeInfo.model}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bike-type">
              类型
            </label>
            <input
              type="text"
              id="bike-type"
              name="bikeInfo.type"
              value={formData.bikeInfo.type}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Bike Fitting 专用信息 */}
      {serviceType === 'fitting' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Bike Fitting 信息（选填）</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="height">
                身高 (cm)
              </label>
              <input
                type="number"
                id="height"
                name="fittingData.height"
                value={formData.fittingData.height}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="weight">
                体重 (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="fittingData.weight"
                value={formData.fittingData.weight}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="inseam">
                裤长 (cm)
              </label>
              <input
                type="number"
                id="inseam"
                name="fittingData.inseam"
                value={formData.fittingData.inseam}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="flexibility">
                柔韧性
              </label>
              <select
                id="flexibility"
                name="fittingData.flexibility"
                value={formData.fittingData.flexibility}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="low">低</option>
                <option value="medium">中等</option>
                <option value="high">高</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="riding-experience">
                骑行经验
              </label>
              <select
                id="riding-experience"
                name="fittingData.ridingExperience"
                value={formData.fittingData.ridingExperience}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="beginner">初学者</option>
                <option value="intermediate">中级</option>
                <option value="advanced">高级</option>
              </select>
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="pain-points">
                骑行疼痛点（用逗号分隔，如：颈部,背部,膝盖）
              </label>
              <input
                type="text"
                id="pain-points"
                name="fittingData.painPoints"
                value={formData.fittingData.painPoints.join(', ')}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="例如：颈部, 背部, 膝盖"
              />
            </div>
          </div>
        </div>
      )}

      {/* 备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="notes">
          备注（选填）
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          placeholder="请填写任何需要我们了解的额外信息"
        ></textarea>
      </div>

      {/* 总价和提交按钮 */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-light rounded-lg">
        <div>
          <p className="text-sm text-gray-600">总价</p>
          <p className="text-3xl font-bold text-primary">¥{totalPrice}</p>
        </div>
        
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors mt-4 md:mt-0"
        >
          确认预约
        </button>
      </div>
    </form>
  )
} 