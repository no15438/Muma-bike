import { Product } from '@/lib/products/types'

export type OrderStatus = 
  | 'pending' // 待支付
  | 'paid'    // 已支付
  | 'shipped' // 已发货
  | 'delivered' // 已送达
  | 'completed' // 已完成
  | 'cancelled' // 已取消

export type PaymentMethod = 
  | 'alipay'
  | 'wechat'
  | 'creditcard'

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export type ShippingAddress = {
  name: string
  phone: string
  province: string
  city: string
  district: string
  address: string
  postalCode?: string
}

export type Order = {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  paymentMethod?: PaymentMethod
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
  paidAt?: string
  shippedAt?: string
  deliveredAt?: string
}

export type OrderSummary = {
  subtotal: number
  shipping: number
  tax: number
  total: number
} 