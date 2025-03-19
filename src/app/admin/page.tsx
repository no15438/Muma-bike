'use client';

import React from 'react';
import { 
  UserGroupIcon, 
  WrenchScrewdriverIcon, 
  ShoppingBagIcon, 
  CurrencyYenIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const stats = [
  { name: '用户总数', value: '1,284', icon: UserGroupIcon, color: 'bg-blue-500' },
  { name: '待处理维修', value: '12', icon: WrenchScrewdriverIcon, color: 'bg-amber-500' },
  { name: '今日订单', value: '32', icon: ShoppingBagIcon, color: 'bg-green-500' },
  { name: '本月收入', value: '¥42,546', icon: CurrencyYenIcon, color: 'bg-purple-500' },
  { name: '库存产品', value: '152', icon: ArchiveBoxIcon, color: 'bg-indigo-500' },
  { name: '库存告警', value: '8', icon: ExclamationTriangleIcon, color: 'bg-red-500' },
];

// Mock data for recent activities
const recentActivities = [
  { id: 1, type: 'order', user: '张三', action: '购买了一辆山地车', time: '10分钟前' },
  { id: 2, type: 'repair', user: '李四', action: '预约了自行车维修', time: '1小时前' },
  { id: 3, type: 'user', user: '王五', action: '注册了新账户', time: '2小时前' },
  { id: 4, type: 'order', user: '赵六', action: '购买了骑行装备', time: '3小时前' },
  { id: 5, type: 'repair', user: '孙七', action: '完成了自行车维修', time: '5小时前' },
];

// Mock data for upcoming repairs
const upcomingRepairs = [
  { id: 1, customerName: '陈八', bikeModel: '捷安特 ATX 860', issue: '刹车系统异常', appointmentTime: '今天 14:00' },
  { id: 2, customerName: '吴九', bikeModel: '美利达 SCULTURA 400', issue: '变速器调整', appointmentTime: '今天 16:30' },
  { id: 3, customerName: '郑十', bikeModel: '特里克 Marlin 5', issue: '轮胎更换', appointmentTime: '明天 09:00' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">控制面板</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activities */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">最近活动</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex-shrink-0 mr-3">
                  {activity.type === 'order' && (
                    <div className="p-2 bg-blue-100 rounded-full">
                      <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  {activity.type === 'repair' && (
                    <div className="p-2 bg-amber-100 rounded-full">
                      <WrenchScrewdriverIcon className="h-5 w-5 text-amber-600" />
                    </div>
                  )}
                  {activity.type === 'user' && (
                    <div className="p-2 bg-green-100 rounded-full">
                      <UserGroupIcon className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user} {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Upcoming repairs */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">今日维修预约</h2>
          <div className="space-y-4">
            {upcomingRepairs.map((repair) => (
              <div key={repair.id} className="flex items-start border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{repair.customerName} - {repair.bikeModel}</p>
                  <p className="text-xs text-gray-600">{repair.issue}</p>
                  <p className="text-xs text-gray-500 mt-1">{repair.appointmentTime}</p>
                </div>
                <button className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs rounded-md">
                  查看详情
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 