'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart/CartContext'
import { useOrders } from '@/lib/orders/OrderContext'
import { useUser } from '@/lib/auth/UserContext'
import { ShippingAddress, OrderSummary, PaymentMethod } from '@/lib/orders/types'
import { 
  getProvinces, getCities, getDistricts, 
  Province, City, District,
  provinces as fallbackProvinces,
  fallbackCities, fallbackDistricts 
} from '@/lib/location/api'

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { createOrder, calculateTax, calculateShipping } = useOrders()
  const { user, isAuthenticated } = useUser()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('alipay')
  
  // 地址数据加载状态
  const [dataLoading, setDataLoading] = useState({
    provinces: false,
    cities: false,
    districts: false
  })
  
  // 省市区数据
  const [provinces, setProvinces] = useState<Province[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  
  // 省市区选择状态
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('')
  const [selectedCityId, setSelectedCityId] = useState<string>('')
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('')
  
  const [address, setAddress] = useState<ShippingAddress>({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    postalCode: ''
  })
  
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  })
  
  // 初始化地址信息
  useEffect(() => {
    if (isAuthenticated && user) {
      // 在实际应用中，这里可以从用户账户获取默认地址
      setAddress(prev => ({
        ...prev,
        name: user.name,
        // 其他字段保持不变
      }))
    }
  }, [isAuthenticated, user])
  
  // 加载省份数据
  useEffect(() => {
    async function loadProvinces() {
      setDataLoading(prev => ({ ...prev, provinces: true }))
      try {
        const data = await getProvinces()
        if (data && data.length > 0) {
          setProvinces(data)
        } else {
          // 如果API获取失败，使用备用数据
          setProvinces(fallbackProvinces)
          console.warn('使用备用省份数据')
        }
      } catch (error) {
        console.error('加载省份数据失败:', error)
        setProvinces(fallbackProvinces)
      } finally {
        setDataLoading(prev => ({ ...prev, provinces: false }))
      }
    }
    
    loadProvinces()
  }, [])
  
  // 处理省份变化，加载城市数据
  useEffect(() => {
    if (selectedProvinceId) {
      async function loadCities() {
        setDataLoading(prev => ({ ...prev, cities: true }))
        
        // 更新地址中的省份
        const province = provinces.find(p => p.id === selectedProvinceId)
        if (province) {
          setAddress(prev => ({
            ...prev,
            province: province.name
          }))
        }
        
        try {
          const data = await getCities(selectedProvinceId)
          if (data && data.length > 0) {
            setCities(data)
          } else {
            // 如果API获取失败，使用备用数据
            setCities(fallbackCities[selectedProvinceId] || [])
            console.warn('使用备用城市数据')
          }
        } catch (error) {
          console.error('加载城市数据失败:', error)
          setCities(fallbackCities[selectedProvinceId] || [])
        } finally {
          setDataLoading(prev => ({ ...prev, cities: false }))
        }
      }
      
      // 重置城市和区县选择
      setSelectedCityId('')
      setSelectedDistrictId('')
      setAddress(prev => ({
        ...prev,
        city: '',
        district: ''
      }))
      setDistricts([])
      
      loadCities()
    }
  }, [selectedProvinceId, provinces])
  
  // 处理城市变化，加载区县数据
  useEffect(() => {
    if (selectedCityId) {
      async function loadDistricts() {
        setDataLoading(prev => ({ ...prev, districts: true }))
        
        // 更新地址中的城市
        const city = cities.find(c => c.id === selectedCityId)
        if (city) {
          setAddress(prev => ({
            ...prev,
            city: city.name
          }))
        }
        
        try {
          const data = await getDistricts(selectedCityId)
          if (data && data.length > 0) {
            setDistricts(data)
          } else {
            // 如果API获取失败，使用备用数据
            setDistricts(fallbackDistricts[selectedCityId] || [])
            console.warn('使用备用区县数据')
          }
        } catch (error) {
          console.error('加载区县数据失败:', error)
          setDistricts(fallbackDistricts[selectedCityId] || [])
        } finally {
          setDataLoading(prev => ({ ...prev, districts: false }))
        }
      }
      
      // 重置区县选择
      setSelectedDistrictId('')
      setAddress(prev => ({
        ...prev,
        district: ''
      }))
      
      loadDistricts()
    }
  }, [selectedCityId, cities])
  
  // 处理区县变化
  useEffect(() => {
    if (selectedDistrictId) {
      // 更新地址中的区县
      const district = districts.find(d => d.id === selectedDistrictId)
      if (district) {
        setAddress(prev => ({
          ...prev,
          district: district.name
        }))
      }
    }
  }, [selectedDistrictId, districts])
  
  // 计算订单金额
  useEffect(() => {
    if (items.length > 0) {
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const shipping = calculateShipping(subtotal)
      const tax = calculateTax(subtotal)
      const total = subtotal + shipping + tax
      
      setOrderSummary({
        subtotal,
        shipping,
        tax,
        total
      })
    } else {
      // 如果购物车为空，重定向回购物车页面
      router.push('/cart')
    }
  }, [items, calculateShipping, calculateTax, router])
  
  // 处理地址输入变化
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // 处理省份选择
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvinceId(e.target.value)
  }
  
  // 处理城市选择
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCityId(e.target.value)
  }
  
  // 处理区县选择
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrictId(e.target.value)
  }
  
  // 处理支付方式选择
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method)
  }
  
  // 提交地址信息，进入支付步骤
  const submitAddressForm = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 检查所有必填字段
    const requiredFields = ['name', 'phone', 'province', 'city', 'district', 'address']
    const missingFields = requiredFields.filter(field => !address[field as keyof ShippingAddress])
    
    if (missingFields.length > 0) {
      alert('请填写所有必填字段')
      return
    }
    
    setStep('payment')
  }
  
  // 完成订单支付
  const handlePlaceOrder = async () => {
    if (!address || !paymentMethod) {
      alert('请填写地址信息并选择支付方式')
      return
    }
    
    setLoading(true)
    
    try {
      const order = await createOrder(items, address)
      
      // 清空购物车
      clearCart()
      
      // 跳转到订单成功页面
      router.push(`/checkout/success?orderId=${order.id}`)
    } catch (error) {
      console.error('下单失败:', error)
      alert('下单失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }
  
  if (items.length === 0) {
    return (
      <div className="container-custom py-16 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">您的购物车是空的</h1>
          <p className="mb-6">请先添加商品到购物车再结算</p>
          <Link href="/products" className="btn-primary">
            浏览商品
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <main className="container-custom py-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 左侧：结算流程 */}
        <div className="w-full md:w-8/12">
          <h1 className="text-3xl font-bold mb-6">结算</h1>
          
          {/* 结算步骤 */}
          <div className="flex mb-8">
            <div className={`flex-1 text-center pb-4 ${step === 'shipping' ? 'border-b-2 border-primary text-primary' : 'border-b border-gray-300 text-gray-500'}`}>
              1. 收货地址
            </div>
            <div className={`flex-1 text-center pb-4 ${step === 'payment' ? 'border-b-2 border-primary text-primary' : 'border-b border-gray-300 text-gray-500'}`}>
              2. 支付方式
            </div>
          </div>
          
          {/* 收货地址表单 */}
          {step === 'shipping' && (
            <form onSubmit={submitAddressForm} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">收货地址</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    收货人姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={address.name}
                    onChange={handleAddressChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    联系电话 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                    省份 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="province"
                      name="province"
                      value={selectedProvinceId}
                      onChange={handleProvinceChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
                      disabled={dataLoading.provinces}
                      required
                    >
                      <option value="">请选择省份</option>
                      {provinces.map(province => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                    {dataLoading.provinces && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    城市 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="city"
                      name="city"
                      value={selectedCityId}
                      onChange={handleCityChange}
                      disabled={!selectedProvinceId || dataLoading.cities}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
                      required
                    >
                      <option value="">请选择城市</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {dataLoading.cities && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                  {selectedProvinceId && !dataLoading.cities && cities.length === 0 && (
                    <p className="mt-1 text-xs text-orange-500">此省份暂未提供城市数据，请直接在详细地址中填写</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                    区/县 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="district"
                      name="district"
                      value={selectedDistrictId}
                      onChange={handleDistrictChange}
                      disabled={!selectedCityId || dataLoading.districts}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
                      required
                    >
                      <option value="">请选择区/县</option>
                      {districts.map(district => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    {dataLoading.districts && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                  {selectedCityId && !dataLoading.districts && districts.length === 0 && (
                    <p className="mt-1 text-xs text-orange-500">此城市暂未提供区县数据，请直接在详细地址中填写</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    邮政编码
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleAddressChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    详细地址 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={address.address}
                    onChange={handleAddressChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="街道、门牌号等"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  继续
                </button>
              </div>
            </form>
          )}
          
          {/* 支付方式选择 */}
          {step === 'payment' && (
            <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">支付方式</h2>
              
              <div className="space-y-3">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'alipay' ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-200'}`}
                  onClick={() => handlePaymentMethodChange('alipay')}
                >
                  <div className="flex items-center">
                    <div className="h-5 w-5 flex items-center justify-center border border-primary rounded-full mr-3">
                      {paymentMethod === 'alipay' && <div className="h-3 w-3 bg-primary rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">支付宝</h3>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12z" />
                        <path fill="white" d="M8.55 11.4h3.9v1.2h-3.9z" />
                        <path fill="white" d="M16.8 13.47c-.62 2.37-3.42 3.18-3.42 3.18s-.39.15-.73.15c-1.08 0-2.52-.54-2.52-1.62 0-.93.87-1.74 2.25-1.74 1.23 0 2.4.63 2.4.63l.33-1.02s-1.86-.81-3.78-.81c-2.22 0-3.75 1.35-3.75 3.06 0 1.62 1.38 2.76 3.75 2.76.66 0 1.68-.15 1.68-.15l3.33-7.32h-2.01l-1.02 2.43H9.96l.24-.84h-3.3l-1.74 5.04h1.95l.96-2.76h3.39l-.36 1.02z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'wechat' ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-200'}`}
                  onClick={() => handlePaymentMethodChange('wechat')}
                >
                  <div className="flex items-center">
                    <div className="h-5 w-5 flex items-center justify-center border border-primary rounded-full mr-3">
                      {paymentMethod === 'wechat' && <div className="h-3 w-3 bg-primary rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">微信支付</h3>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295.295a.328.328 0 00.166-.054l1.902-1.098a.81.81 0 01.4-.108c.072 0 .143.013.213.031 1.031.288 2.136.445 3.275.445 4.801 0 8.691-3.288 8.691-7.342 0-.022-.003-.044-.003-.066-.476.642-2.476 3.246-8.008 2.386-3.327-.517-3.422-4.306-1.029-5.004 2.394-.697 4.257 1.397 4.351 2.766.048.708-.48 1.34-1.087 1.623-.607.284-1.08.145-1.126.093-.047-.052-.047-.093-.047-.687.095.097-1.056-3.56-5.562-1.462-1.363.635-1.37 1.92-.531 2.476.839.557 2.931.68 4.351-1.252 0 0 .214 2.172 2.394 2.506 2.18.335 3.863-1.336 3.863-1.336s.095 1.47 1.698 1.527c1.603.056 2.485-1.056 2.485-1.056s.284.802 1.22.914c.935.112 1.9-.54 1.9-.54s.144.592 1.007.683c.862.09 1.695-.26 1.695-.685a.395.395 0 00-.068-.216c.2-.072.374-.196.51-.357.17-.197.25-.448.226-.705-.072-.79-1.042-1.628-2.45-1.575-1.407.052-1.644.861-1.644.861s-.579-.426-1.268-.384c-.69.044-.95.782-.95.782s-1.813-1.232-4.255.236c-2.442 1.469-1.407 3.668-.048 4.042 1.36.373 4.398-.234 4.874-2.48.072.786.169 1.858.455 2.233.392.515 2.373.506 2.755-.159.118-.204.236-.555.383-1.078.444.357 1.126.535 1.793.26.739-.304 1.175-.866 1.175-1.599 0-.122-.018-.244-.054-.366.824-.614 1.08-1.552.662-2.406-.418-.854-1.418-1.386-2.252-.854-.834.532-.716 1.416-.716 1.416s-.45-.471-1.126-.424c-.677.047-.995.471-.995.471s-.264-.58-1.36-.471c-1.096.108-1.34.86-1.34.86s-1.563-1.838-5.182.265c-3.227 1.88-.982 4.526.478 4.682 1.46.156 4.294-.813 4.294-3.225 0 0 .037.86.13 1.647.091.788.326.909.548.92.223.012 1.342.062 1.342-1.11 0 0 .479.678 1.342.61.863-.069 1.16-.88 1.16-.88s.273.508 1.055.508 1.16-.724 1.16-.724.222.395.59.439c.368.044.723-.346.723-.346s-.019 1.265-2.307 1.44c-2.289.177-3.128-.881-3.255-1.487-.127-.606.245-3.339-3.065-2.995-3.31.344-6.846-.932-7.35-3.682-.506-2.75 2.271-5.574 6.388-5.574 3.067 0 5.362.977 7.115 2.322.25.227.443.173.443-.142 0-1.827-.871-3.495-2.295-4.771 1.118-.657 2.48-1.028 3.93-1.028 4.248 0 7.692 3.438 7.692 7.679 0 4.242-3.444 7.679-7.692 7.679a7.73 7.73 0 01-1.46-.144.299.299 0 00-.202.033.298.298 0 00-.134.156l-.468 1.256c-.026.069-.03.143-.012.213a.296.296 0 00.296.226.3.3 0 00.107-.022c.631-.25 1.293-.418 1.873-.599v.054c0 2.244-1.823 4.067-4.07 4.067H9.323a4.023 4.023 0 01-1.824-.435l-2.582 1.438a.498.498 0 01-.249.07.497.497 0 01-.497-.497c0-.107.03-.214.088-.311l.67-1.244a.56.56 0 00.047-.224.561.561 0 00-.202-.433C2.918 17.334 1.809 15.52 1.809 13.51v-.152c.001-2.243 1.824-4.066 4.071-4.066h3.018c.288-.018.576-.201.576-.501 0-.3-.282-.417-.576-.417H5.878C2.638 8.376 0 5.741 0 2.505v-.152C0 .112 1.823-1.71 4.07-1.71h10.571c2.248 0 4.07 1.822 4.07 4.065v.152c0 3.042-2.326 5.553-5.321 5.828-.204.019-.699.034-.699.336-.001.302.342.475.546.493.576.05 1.154.05 1.73 0 4.801 0 8.691-3.288 8.691-7.342C23.659 5.476 19.768 2.188 15.97 2.188a8.56 8.56 0 00-1.73.175c-.213.038-.426.083-.639.13-.142.033-.285.07-.426.108a8.89 8.89 0 00-.852.283 3.486 3.486 0 00-.2.088c-.249.106-.494.22-.735.343-.073.038-.144.076-.213.115A8.58 8.58 0 008.69 2.188z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'creditcard' ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-200'}`}
                  onClick={() => handlePaymentMethodChange('creditcard')}
                >
                  <div className="flex items-center">
                    <div className="h-5 w-5 flex items-center justify-center border border-primary rounded-full mr-3">
                      {paymentMethod === 'creditcard' && <div className="h-3 w-3 bg-primary rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">信用卡支付</h3>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  返回
                </button>
                
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70"
                >
                  {loading ? '处理中...' : '提交订单'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* 右侧：订单摘要 */}
        <div className="w-full md:w-4/12">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-4">订单摘要</h2>
            
            {/* 商品列表 */}
            <div className="mb-6 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center">
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ¥{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
            
            {/* 金额计算 */}
            <div className="border-t border-gray-200 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">小计</span>
                <span className="font-medium">¥{orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">运费</span>
                <span className="font-medium">
                  {orderSummary.shipping > 0 ? `¥${orderSummary.shipping.toFixed(2)}` : '免运费'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">税费</span>
                <span className="font-medium">¥{orderSummary.tax.toFixed(2)}</span>
              </div>
            </div>
            
            {/* 总计 */}
            <div className="border-t border-gray-200 py-4">
              <div className="flex justify-between">
                <span className="font-medium">总计</span>
                <span className="text-xl font-bold text-primary">¥{orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 