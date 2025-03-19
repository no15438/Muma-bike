'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import { ArrowLeftIcon, TruckIcon, CreditCardIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// Mock orders data (in a real app, this would come from the API)
const orderStatuses = {
  pending: { label: '待支付', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: '已支付', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: '已发货', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: '已送达', color: 'bg-green-100 text-green-800' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
  cancelled: { label: '已取消', color: 'bg-red-100 text-red-800' }
};

const paymentMethods = {
  alipay: { label: '支付宝', icon: CreditCardIcon },
  wechat: { label: '微信支付', icon: CreditCardIcon },
  creditcard: { label: '信用卡', icon: CreditCardIcon }
};

const mockOrder = {
  id: 'ORD10001',
  userId: 'user123',
  status: 'shipped',
  items: [
    {
      productId: 'prod1',
      name: '捷安特 ATX 860 山地自行车',
      price: 3499,
      quantity: 1,
      image: 'https://placehold.co/100x100?text=Giant+ATX+860'
    },
    {
      productId: 'prod5',
      name: 'SAHOO 750ml骑行水壶',
      price: 89,
      quantity: 2,
      image: 'https://placehold.co/100x100?text=SAHOO+Bottle'
    }
  ],
  totalAmount: 3677,
  paymentMethod: 'alipay',
  shippingAddress: {
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '海淀区',
    address: '中关村大街1号',
    postalCode: '100080'
  },
  createdAt: '2023-05-10T08:30:00Z',
  updatedAt: '2023-05-10T10:15:00Z',
  paidAt: '2023-05-10T09:45:00Z',
  shippedAt: '2023-05-11T14:20:00Z',
  deliveredAt: null,
  trackingNumber: 'SF1234567890',
  trackingCompany: '顺丰速运',
  notes: '请在工作日送货，周末不在家',
};

// Helper function to format date
function formatDate(dateString: string | null) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Calculate order subtotal
function calculateSubtotal(items: typeof mockOrder.items) {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  
  const [order, setOrder] = useState<typeof mockOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Load order data
  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock the API response using our predefined order
        if (orderId === mockOrder.id) {
          setOrder(mockOrder);
        } else {
          // For demo, we always return the mock order
          setOrder({...mockOrder, id: orderId});
        }
      } catch (err) {
        console.error('Failed to load order', err);
        setError('加载订单数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the order status locally for the demo
      if (order) {
        const updatedOrder = { ...order, status: newStatus };
        
        // Add timestamps based on the status change
        if (newStatus === 'paid') {
          updatedOrder.paidAt = new Date().toISOString();
        } else if (newStatus === 'shipped') {
          updatedOrder.shippedAt = new Date().toISOString();
        } else if (newStatus === 'delivered') {
          updatedOrder.deliveredAt = new Date().toISOString();
        }
        
        setOrder(updatedOrder);
      }
      
      // Show success message
      alert(`订单状态已更新为 ${orderStatuses[newStatus as keyof typeof orderStatuses].label}`);
    } catch (err) {
      console.error('Failed to update order status', err);
      alert('更新订单状态失败');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">加载中...</div>;
  }

  if (error || !order) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">订单不存在</h1>
        <p className="text-gray-500 mb-6">{error || `找不到ID为 ${orderId} 的订单`}</p>
        <button
          type="button"
          onClick={() => router.push('/admin/orders')}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          返回订单列表
        </button>
      </div>
    );
  }
  
  // Calculate order summary
  const subtotal = calculateSubtotal(order.items);
  const shipping = 0; // For this example, shipping is free
  const tax = 0; // For this example, no tax
  const total = order.totalAmount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link 
            href="/admin/orders"
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">订单详情: {order.id}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${orderStatuses[order.status as keyof typeof orderStatuses].color}`}>
            {orderStatuses[order.status as keyof typeof orderStatuses].label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 订单信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 商品列表 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">商品列表</h2>
            </div>
            <div className="px-6 py-4">
              <ul role="list" className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.productId} className="py-4 flex">
                    <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">¥{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <p className="text-gray-500">数量: {item.quantity}</p>
                        <p className="text-gray-500">小计: ¥{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 收货信息 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">收货信息</h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">收件人</p>
                  <p className="mt-1 text-sm text-gray-900">{order.shippingAddress.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">联系电话</p>
                  <p className="mt-1 text-sm text-gray-900">{order.shippingAddress.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">收货地址</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {order.shippingAddress.province} {order.shippingAddress.city} {order.shippingAddress.district} {order.shippingAddress.address}
                    {order.shippingAddress.postalCode && ` (${order.shippingAddress.postalCode})`}
                  </p>
                </div>
                {order.notes && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">备注</p>
                    <p className="mt-1 text-sm text-gray-900">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 物流信息 */}
          {(order.status === 'shipped' || order.status === 'delivered' || order.status === 'completed') && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">物流信息</h2>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">物流公司</p>
                    <p className="mt-1 text-sm text-gray-900">{order.trackingCompany}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">运单号</p>
                    <p className="mt-1 text-sm text-gray-900">{order.trackingNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 订单摘要 */}
        <div className="space-y-6">
          {/* 订单状态 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">订单状态</h2>
            </div>
            <div className="px-6 py-4 space-y-6">
              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">更新订单状态</p>
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange('paid')}
                        disabled={updating}
                        className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                      >
                        标记为已支付
                      </button>
                    )}
                    {order.status === 'paid' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange('shipped')}
                        disabled={updating}
                        className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                      >
                        标记为已发货
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange('delivered')}
                        disabled={updating}
                        className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                      >
                        标记为已送达
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange('completed')}
                        disabled={updating}
                        className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                      >
                        标记为已完成
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleStatusChange('cancelled')}
                      disabled={updating}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                    >
                      取消订单
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">订单创建时间</p>
                  <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">支付时间</p>
                  <p className="text-sm text-gray-900">{formatDate(order.paidAt)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">发货时间</p>
                  <p className="text-sm text-gray-900">{formatDate(order.shippedAt)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">送达时间</p>
                  <p className="text-sm text-gray-900">{formatDate(order.deliveredAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 支付信息 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">支付信息</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">支付方式</p>
                <p className="text-sm text-gray-900">
                  {paymentMethods[order.paymentMethod as keyof typeof paymentMethods].label}
                </p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">商品小计</p>
                  <p className="text-sm font-medium text-gray-900">¥{subtotal.toLocaleString()}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-sm text-gray-500">运费</p>
                  <p className="text-sm font-medium text-gray-900">
                    {shipping === 0 ? '免运费' : `¥${shipping.toLocaleString()}`}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-sm text-gray-500">税费</p>
                  <p className="text-sm font-medium text-gray-900">
                    {tax === 0 ? '免税' : `¥${tax.toLocaleString()}`}
                  </p>
                </div>
                <div className="flex justify-between mt-4 border-t border-gray-200 pt-4">
                  <p className="text-base font-medium text-gray-900">总计</p>
                  <p className="text-base font-medium text-gray-900">¥{total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-6 py-4 space-y-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" />
                打印订单
              </button>
              <button
                type="button"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <TruckIcon className="-ml-1 mr-2 h-5 w-5" />
                添加物流信息
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(OrderDetailPage, Permission.VIEW_ORDERS); 