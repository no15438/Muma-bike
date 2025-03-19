'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon,
  ArrowPathIcon,
  CalendarIcon,
  CurrencyYenIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

// 订单状态枚举
enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',  // 待支付
  PAID = 'paid',                        // 已支付
  PROCESSING = 'processing',            // 处理中
  SHIPPED = 'shipped',                  // 已发货
  COMPLETED = 'completed',              // 已完成
  CANCELLED = 'cancelled',              // 已取消
  REFUNDED = 'refunded',                // 已退款
}

// 模拟订单数据
const sampleOrders = [
  {
    id: 'ORD10001',
    customerName: '张三',
    createdAt: '2023-04-01T10:30:00Z',
    status: OrderStatus.COMPLETED,
    totalAmount: 3798,
    items: 2,
    trackingNumber: 'SF1234567890',
    trackingCompany: '顺丰速运',
    phone: '13800138001'
  },
  {
    id: 'ORD10002',
    customerName: '李婷婷',
    createdAt: '2023-04-05T14:20:00Z',
    status: OrderStatus.SHIPPED,
    totalAmount: 5999,
    items: 1,
    trackingNumber: 'YT0987654321',
    trackingCompany: '圆通速递',
    phone: '13900139002'
  },
  {
    id: 'ORD10003',
    customerName: '张伟',
    createdAt: '2023-04-08T16:40:00Z',
    status: OrderStatus.PROCESSING,
    totalAmount: 4936,
    items: 3,
    phone: '13700137003'
  },
  {
    id: 'ORD10004',
    customerName: '陈明',
    createdAt: '2023-04-10T11:20:00Z',
    status: OrderStatus.PENDING_PAYMENT,
    totalAmount: 799,
    items: 1,
    phone: '13600136004'
  },
  {
    id: 'ORD10005',
    customerName: '赵芳',
    createdAt: '2023-04-07T09:10:00Z',
    status: OrderStatus.CANCELLED,
    totalAmount: 1299,
    items: 1,
    phone: '13500135005'
  }
];

function OrdersListPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(sampleOrders);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    customerName: '',
    orderId: '',
    fromDate: '',
    toDate: '',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 应用筛选
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 简单模拟筛选功能
    setTimeout(() => {
      let filtered = [...sampleOrders];
      
      if (filters.customerName) {
        filtered = filtered.filter(order => 
          order.customerName.toLowerCase().includes(filters.customerName.toLowerCase())
        );
      }
      
      if (filters.orderId) {
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(filters.orderId.toLowerCase())
        );
      }
      
      if (filters.status) {
        filtered = filtered.filter(order => order.status === filters.status);
      }
      
      setOrders(filtered);
      setLoading(false);
      setIsFilterOpen(false);
    }, 500);
  };

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({
      status: '',
      customerName: '',
      orderId: '',
      fromDate: '',
      toDate: '',
    });
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
  };

  // 获取状态标签
  const getOrderStatusLabel = (status: OrderStatus): string => {
    const statusLabels: Record<OrderStatus, string> = {
      [OrderStatus.PENDING_PAYMENT]: '待支付',
      [OrderStatus.PAID]: '已支付',
      [OrderStatus.PROCESSING]: '处理中',
      [OrderStatus.SHIPPED]: '已发货',
      [OrderStatus.COMPLETED]: '已完成',
      [OrderStatus.CANCELLED]: '已取消',
      [OrderStatus.REFUNDED]: '已退款',
    };
    
    return statusLabels[status] || status;
  };

  // 获取状态颜色
  const getOrderStatusColor = (status: OrderStatus): string => {
    const statusColors: Record<OrderStatus, string> = {
      [OrderStatus.PENDING_PAYMENT]: 'bg-amber-100 text-amber-800',
      [OrderStatus.PAID]: 'bg-blue-100 text-blue-800',
      [OrderStatus.PROCESSING]: 'bg-purple-100 text-purple-800',
      [OrderStatus.SHIPPED]: 'bg-indigo-100 text-indigo-800',
      [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
      [OrderStatus.REFUNDED]: 'bg-gray-100 text-gray-800',
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setOrders(sampleOrders)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md"
            title="刷新"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <Link
            href="/admin/orders/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            新建订单
          </Link>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 max-w-2xl">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="搜索客户名称..."
                value={filters.customerName}
                onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters(e)}
              />
            </div>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="订单编号..."
                value={filters.orderId}
                onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters(e)}
              />
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FunnelIcon className="-ml-0.5 mr-2 h-4 w-4" />
            高级筛选
          </button>
        </div>

        {/* 筛选面板 */}
        {isFilterOpen && (
          <div className="mt-4 border-t pt-4">
            <form onSubmit={handleApplyFilters} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  状态
                </label>
                <select
                  id="status"
                  name="status"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">全部状态</option>
                  {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>
                      {getOrderStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
                  开始日期
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="fromDate"
                    name="fromDate"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={filters.fromDate}
                    onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
                  结束日期
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="toDate"
                    name="toDate"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={filters.toDate}
                    onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="sm:col-span-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  重置
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  应用筛选
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 订单列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {loading ? (
          <div className="py-12 flex justify-center">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            没有找到匹配的订单
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id}>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/admin/orders/${order.id}`);
                  }}
                  className="block hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {order.id}
                        </p>
                        <div className="flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusColor(order.status as OrderStatus)}`}>
                            {getOrderStatusLabel(order.status as OrderStatus)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <CurrencyYenIcon className="h-5 w-5 text-gray-400 mr-1" />
                        <p className="text-sm font-medium text-gray-900">¥{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {order.customerName} ({order.phone})
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {order.items} 件商品
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>创建于 {formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    {order.trackingNumber && (
                      <div className="mt-2 text-sm text-gray-500 flex items-center">
                        <TruckIcon className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{order.trackingCompany}: {order.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default withAuth(OrdersListPage, Permission.VIEW_ORDERS); 