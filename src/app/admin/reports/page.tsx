'use client';

import React, { useState, useEffect } from 'react';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import { 
  BanknotesIcon, 
  WrenchScrewdriverIcon, 
  ShoppingBagIcon, 
  ArchiveBoxIcon,
  UserIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Mock data for charts and statistics
const salesData = {
  monthly: [
    { month: '1月', sales: 12000 },
    { month: '2月', sales: 15000 },
    { month: '3月', sales: 18000 },
    { month: '4月', sales: 14000 },
    { month: '5月', sales: 22000 },
    { month: '6月', sales: 20000 },
  ],
  total: 101000,
  count: 126,
  average: 801.58
};

const repairsData = {
  monthly: [
    { month: '1月', repairs: 24 },
    { month: '2月', repairs: 32 },
    { month: '3月', repairs: 28 },
    { month: '4月', repairs: 36 },
    { month: '5月', repairs: 42 },
    { month: '6月', repairs: 38 },
  ],
  total: 200,
  completed: 176,
  inProgress: 24,
  revenue: 28000
};

const inventoryData = {
  totalItems: 325,
  lowStock: 12,
  outOfStock: 5,
  categories: [
    { name: '山地车', count: 45 },
    { name: '公路车', count: 32 },
    { name: '城市车', count: 28 },
    { name: '配件', count: 220 },
  ]
};

const customerData = {
  total: 245,
  newThisMonth: 18,
  returning: 142,
  vip: 35
};

function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('半年');

  // Simulate data loading when tab or date range changes
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call with the selected date range
      await new Promise(resolve => setTimeout(resolve, 800));
      // Data would be updated from API response
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeTab, dateRange]);

  // Render a summary card
  const SummaryCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    change, 
    color = 'blue' 
  }: { 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    icon: any; 
    change?: { value: number; isPositive: boolean } 
    color?: 'blue' | 'green' | 'purple' | 'yellow'
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      yellow: 'bg-yellow-500'
    };

    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className={`flex-shrink-0 rounded-md p-3 ${colorClasses[color]}`}>
              <Icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{value}</div>
                </dd>
                {subtitle && (
                  <dd className="text-sm text-gray-500 mt-1">{subtitle}</dd>
                )}
                {change && (
                  <dd className={`text-sm ${change.isPositive ? 'text-green-600' : 'text-red-600'} mt-1`}>
                    {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
                  </dd>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Simple bar chart component
  const BarChart = ({ data, valueKey, labelKey, title, color = '#3b82f6' }) => {
    const maxValue = Math.max(...data.map(item => item[valueKey])) * 1.1;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="h-64">
          <div className="flex h-56 items-end space-x-2">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-opacity-80 rounded-t"
                  style={{ 
                    height: `${(item[valueKey] / maxValue) * 100}%`,
                    backgroundColor: color
                  }}
                ></div>
                <div className="text-xs mt-1 font-medium text-gray-500">{item[labelKey]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">报表统计</h1>
        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="dateRange" className="text-sm font-medium text-gray-700">
              时间范围:
            </label>
            <select
              id="dateRange"
              name="dateRange"
              className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="月">本月</option>
              <option value="季度">本季度</option>
              <option value="半年">半年</option>
              <option value="年">全年</option>
            </select>
          </div>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                刷新中...
              </>
            ) : (
              <>
                <ArrowPathIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                刷新数据
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            概览
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`${
              activeTab === 'sales'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            销售分析
          </button>
          <button
            onClick={() => setActiveTab('repairs')}
            className={`${
              activeTab === 'repairs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            维修分析
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`${
              activeTab === 'inventory'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            库存分析
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <SummaryCard 
                    title="总销售额" 
                    value={`¥${salesData.total.toLocaleString()}`} 
                    subtitle={`${salesData.count}个订单`} 
                    icon={BanknotesIcon}
                    change={{ value: 12.5, isPositive: true }}
                    color="blue"
                  />
                  <SummaryCard 
                    title="维修订单" 
                    value={repairsData.total} 
                    subtitle={`已完成: ${repairsData.completed}`} 
                    icon={WrenchScrewdriverIcon}
                    change={{ value: 8.3, isPositive: true }}
                    color="green"
                  />
                  <SummaryCard 
                    title="库存商品" 
                    value={inventoryData.totalItems} 
                    subtitle={`缺货: ${inventoryData.outOfStock}`} 
                    icon={ArchiveBoxIcon}
                    color="purple"
                  />
                  <SummaryCard 
                    title="会员数量" 
                    value={customerData.total} 
                    subtitle={`本月新增: ${customerData.newThisMonth}`} 
                    icon={UserIcon}
                    change={{ value: 5.2, isPositive: true }}
                    color="yellow"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <BarChart 
                    data={salesData.monthly} 
                    valueKey="sales" 
                    labelKey="month" 
                    title="销售趋势" 
                    color="#3b82f6"
                  />
                  <BarChart 
                    data={repairsData.monthly} 
                    valueKey="repairs" 
                    labelKey="month" 
                    title="维修订单趋势" 
                    color="#10b981"
                  />
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">热门商品分类</h3>
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            分类名称
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            商品数量
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            占比
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventoryData.categories.map((category, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {category.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                              {category.count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                              {((category.count / inventoryData.totalItems) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sales Analysis Tab */}
            {activeTab === 'sales' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <SummaryCard 
                    title="总销售额" 
                    value={`¥${salesData.total.toLocaleString()}`} 
                    icon={BanknotesIcon}
                    color="blue"
                  />
                  <SummaryCard 
                    title="订单数量" 
                    value={salesData.count} 
                    icon={ShoppingBagIcon}
                    color="purple"
                  />
                  <SummaryCard 
                    title="平均订单金额" 
                    value={`¥${salesData.average.toFixed(2)}`} 
                    icon={ChartBarIcon}
                    color="green"
                  />
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">销售趋势详情</h3>
                  <div className="h-80">
                    <BarChart 
                      data={salesData.monthly} 
                      valueKey="sales" 
                      labelKey="month" 
                      title="" 
                      color="#3b82f6"
                    />
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">待补充数据</h3>
                  <p className="text-gray-500">此部分将展示更多销售分析数据，例如：</p>
                  <ul className="mt-2 list-disc pl-5 text-gray-500">
                    <li>热门产品排行</li>
                    <li>销售渠道分析</li>
                    <li>客户购买频率</li>
                    <li>销售退货率</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Repairs Analysis Tab */}
            {activeTab === 'repairs' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                  <SummaryCard 
                    title="维修工单总数" 
                    value={repairsData.total} 
                    icon={WrenchScrewdriverIcon}
                    color="blue"
                  />
                  <SummaryCard 
                    title="已完成维修" 
                    value={repairsData.completed} 
                    subtitle={`${((repairsData.completed / repairsData.total) * 100).toFixed(1)}%`}
                    icon={ChartBarIcon}
                    color="green"
                  />
                  <SummaryCard 
                    title="进行中维修" 
                    value={repairsData.inProgress} 
                    icon={WrenchScrewdriverIcon}
                    color="yellow"
                  />
                  <SummaryCard 
                    title="维修收入" 
                    value={`¥${repairsData.revenue.toLocaleString()}`} 
                    icon={BanknotesIcon}
                    color="purple"
                  />
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">维修工单趋势</h3>
                  <div className="h-80">
                    <BarChart 
                      data={repairsData.monthly} 
                      valueKey="repairs" 
                      labelKey="month" 
                      title="" 
                      color="#10b981"
                    />
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">待补充数据</h3>
                  <p className="text-gray-500">此部分将展示更多维修分析数据，例如：</p>
                  <ul className="mt-2 list-disc pl-5 text-gray-500">
                    <li>常见维修类型</li>
                    <li>平均维修时长</li>
                    <li>技师工作量</li>
                    <li>维修满意度</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Inventory Analysis Tab */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <SummaryCard 
                    title="库存商品总数" 
                    value={inventoryData.totalItems} 
                    icon={ArchiveBoxIcon}
                    color="blue"
                  />
                  <SummaryCard 
                    title="低库存商品" 
                    value={inventoryData.lowStock} 
                    icon={ArchiveBoxIcon}
                    color="yellow"
                  />
                  <SummaryCard 
                    title="缺货商品" 
                    value={inventoryData.outOfStock} 
                    icon={ArchiveBoxIcon}
                    color="red"
                  />
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">库存分类统计</h3>
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            分类名称
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            商品数量
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            占比
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventoryData.categories.map((category, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {category.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                              {category.count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                              {((category.count / inventoryData.totalItems) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">待补充数据</h3>
                  <p className="text-gray-500">此部分将展示更多库存分析数据，例如：</p>
                  <ul className="mt-2 list-disc pl-5 text-gray-500">
                    <li>库存周转率</li>
                    <li>滞销商品分析</li>
                    <li>库存价值统计</li>
                    <li>采购建议</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default withAuth(ReportsPage, Permission.VIEW_REPORTS); 