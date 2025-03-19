'use client'

import { Coupon, userCoupons } from '@/lib/data'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type CouponContextType = {
  coupons: Coupon[]
  getCoupon: (id: string) => Coupon | undefined
  getAvailableCoupons: () => Coupon[]
  getUsedCoupons: () => Coupon[]
  addCoupon: (couponCode: string) => boolean
  useCoupon: (id: string) => void
}

const CouponContext = createContext<CouponContextType | undefined>(undefined)

export function CouponProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  
  // 初始化时从数据加载优惠券（在实际应用中会从API获取）
  useEffect(() => {
    setCoupons(userCoupons)
  }, [])
  
  // 获取指定ID的优惠券
  const getCoupon = (id: string) => {
    return coupons.find(coupon => coupon.id === id)
  }
  
  // 获取所有可用的优惠券（未使用且在有效期内）
  const getAvailableCoupons = () => {
    const now = new Date()
    return coupons.filter(coupon => {
      const startDate = new Date(coupon.startDate)
      const endDate = new Date(coupon.endDate)
      return !coupon.isUsed && now >= startDate && now <= endDate
    })
  }
  
  // 获取所有已使用的优惠券
  const getUsedCoupons = () => {
    return coupons.filter(coupon => coupon.isUsed)
  }
  
  // 添加新的优惠券（通过优惠码）
  const addCoupon = (couponCode: string) => {
    // 在实际应用中，这里会调用API来验证优惠码并获取优惠券详情
    // 这里模拟一个简单的逻辑：检查优惠码是否存在且未被添加
    const existingCoupon = coupons.find(coupon => coupon.code === couponCode)
    if (existingCoupon) {
      return false // 优惠券已存在
    }
    
    // 假设验证成功，添加新优惠券（实际应用中会从API获取详情）
    const newCoupon: Coupon = {
      id: `coupon-${coupons.length + 1}`,
      code: couponCode,
      name: '新领取的优惠券',
      description: '通过优惠码领取的优惠券',
      discountType: 'amount',
      discountValue: 50,
      minPurchase: 500,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      imageUrl: '/images/coupons/coupon-bg-1.jpg'
    }
    
    setCoupons([...coupons, newCoupon])
    return true
  }
  
  // 使用优惠券
  const useCoupon = (id: string) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === id ? { ...coupon, isUsed: true } : coupon
    ))
  }
  
  const value = {
    coupons,
    getCoupon,
    getAvailableCoupons,
    getUsedCoupons,
    addCoupon,
    useCoupon
  }
  
  return <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
}

export const useCoupons = () => {
  const context = useContext(CouponContext)
  if (context === undefined) {
    throw new Error('useCoupons must be used within a CouponProvider')
  }
  return context
} 