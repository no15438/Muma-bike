'use client'

import { useState } from 'react'
import { useCoupons } from '@/lib/coupons/CouponContext'
import { Coupon } from '@/lib/data'

export default function CouponsPage() {
  const { getAvailableCoupons, getUsedCoupons, addCoupon } = useCoupons()
  const [activeTab, setActiveTab] = useState<'available' | 'used'>('available')
  const [couponCode, setCouponCode] = useState('')
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  
  // 获取优惠券列表
  const availableCoupons = getAvailableCoupons()
  const usedCoupons = getUsedCoupons()
  
  // 处理添加优惠券
  const handleAddCoupon = () => {
    if (!couponCode.trim()) {
      setMessage({
        type: 'error',
        text: '请输入优惠券代码'
      })
      return
    }
    
    const success = addCoupon(couponCode)
    if (success) {
      setMessage({
        type: 'success',
        text: '成功添加优惠券！'
      })
      setCouponCode('')
      // 3秒后清除消息
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({
        type: 'error',
        text: '无效的优惠券代码或该优惠券已被添加'
      })
    }
  }
  
  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (e) {
      return dateStr
    }
  }
  
  // 渲染单个优惠券卡片
  const renderCouponCard = (coupon: Coupon) => {
    return (
      <div 
        key={coupon.id} 
        className={`relative overflow-hidden rounded-lg shadow-md ${coupon.isUsed ? 'opacity-60' : ''}`}
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${coupon.imageUrl || '/images/coupons/default-bg.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* 顶部优惠券标题区域 */}
        <div className="bg-primary text-white p-4">
          <h3 className="text-lg font-bold">{coupon.name}</h3>
        </div>
        
        {/* 中间内容区域 */}
        <div className="p-4">
          {/* 折扣信息 */}
          <div className="mb-4 flex items-baseline">
            {coupon.discountType === 'amount' ? (
              <div className="text-primary">
                <span className="text-2xl font-bold">¥{coupon.discountValue}</span>
                <span className="text-sm ml-1">满{coupon.minPurchase}可用</span>
              </div>
            ) : (
              <div className="text-primary">
                <span className="text-2xl font-bold">{coupon.discountValue}%</span>
                <span className="text-sm ml-1">满{coupon.minPurchase}可用</span>
              </div>
            )}
          </div>
          
          {/* 有效期 */}
          <div className="text-gray-600 text-sm">
            <p>有效期: {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}</p>
          </div>
          
          {/* 说明 */}
          <p className="mt-2 text-sm text-gray-700">{coupon.description}</p>
          
          {/* 使用状态 */}
          {coupon.isUsed && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-red-500 w-24 h-24 flex items-center justify-center rotate-12">
              <span className="text-red-500 text-xl font-bold">已使用</span>
            </div>
          )}
        </div>
        
        {/* 底部代码区域 */}
        <div className="bg-gray-100 p-3 border-t text-center">
          <p className="text-xs text-gray-500">优惠码: <span className="font-mono">{coupon.code}</span></p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold mb-6">我的优惠券</h1>
      
      {/* 添加优惠券区域 */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">添加优惠券</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="输入优惠券代码"
            className="flex-grow p-2 border rounded-md"
          />
          <button 
            onClick={handleAddCoupon}
            className="btn"
          >
            添加
          </button>
        </div>
        {message && (
          <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
      </div>
      
      {/* 标签切换 */}
      <div className="flex border-b mb-6">
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'available' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('available')}
        >
          可用优惠券 ({availableCoupons.length})
        </button>
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'used' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('used')}
        >
          已使用 ({usedCoupons.length})
        </button>
      </div>
      
      {/* 优惠券列表 */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableCoupons.length > 0 ? (
            availableCoupons.map(renderCouponCard)
          ) : (
            <div className="col-span-2 py-8 text-center text-gray-500">
              <p>暂无可用优惠券</p>
              <p className="mt-2 text-sm">可以通过参与活动获得优惠券或直接输入优惠码添加</p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'used' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {usedCoupons.length > 0 ? (
            usedCoupons.map(renderCouponCard)
          ) : (
            <div className="col-span-2 py-8 text-center text-gray-500">
              <p>暂无已使用的优惠券</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 