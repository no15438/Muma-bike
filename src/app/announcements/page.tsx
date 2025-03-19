'use client'

import { useState } from 'react'
import Link from 'next/link'

// 从内容管理中导入模拟公告数据
const mockAnnouncements = [
  {
    id: 'announcement1',
    title: '五一假期营业时间调整公告',
    content: '尊敬的顾客，应商场管理要求，五一假期期间（5月1日至5月5日）本店营业时间调整为10:00-21:00，敬请知悉。',
    publishDate: '2024-04-25',
    expireDate: '2024-05-06',
    priority: 'high',
    isActive: true
  },
  {
    id: 'announcement2',
    title: '新品到店：Giant 2024款公路车系列',
    content: 'Giant 2024款全新公路车系列已经到店，欢迎各位车友前来体验试骑！',
    publishDate: '2024-03-20',
    expireDate: '2024-04-20',
    priority: 'medium',
    isActive: true
  },
  {
    id: 'announcement3',
    title: '会员积分规则调整通知',
    content: '自2024年4月1日起，本店会员积分规则将进行调整，每消费1元累计1积分，积分可用于兑换礼品或抵扣消费。',
    publishDate: '2024-03-15',
    expireDate: '2024-04-15',
    priority: 'low',
    isActive: true
  },
  {
    id: 'announcement4',
    title: '春季骑行活动报名开始',
    content: '2024年春季骑行活动现已开始报名！本次活动路线覆盖城市周边风景区，全程约50公里，适合中级骑行爱好者参与。活动时间：2024年4月20日，早8点在牧马单车店门口集合出发。',
    publishDate: '2024-03-25',
    expireDate: '2024-04-20',
    priority: 'medium',
    isActive: true
  },
  {
    id: 'announcement5',
    title: '技师休假通知',
    content: '因技师休假，2024年4月10日至4月12日暂停维修和Bike Fitting服务，给您带来不便，敬请谅解。',
    publishDate: '2024-04-05',
    expireDate: '2024-04-13',
    priority: 'high',
    isActive: true
  }
];

export default function AnnouncementsPage() {
  const [announcements] = useState(mockAnnouncements.filter(a => a.isActive));
  
  // 获取当前日期，用于判断是否为新公告
  const now = new Date();
  const isNew = (publishDate: string) => {
    const date = new Date(publishDate);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // 7天内发布的公告标记为新
  };
  
  // 根据优先级获取标签样式
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  // 根据优先级获取标签文字
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '重要';
      case 'medium':
        return '一般';
      default:
        return '普通';
    }
  };
  
  return (
    <main className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">最新公告</h1>
        <p className="text-gray-600">查看店铺近期公告、活动信息和服务变更通知</p>
      </div>
      
      {/* 公告列表 */}
      <div className="space-y-4">
        {announcements.map(announcement => (
          <div key={announcement.id} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">
                {announcement.title}
                {isNew(announcement.publishDate) && (
                  <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </h2>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityStyle(announcement.priority)}`}>
                {getPriorityText(announcement.priority)}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{announcement.content}</p>
            
            <div className="flex flex-wrap gap-x-4 text-sm text-gray-500">
              <span>发布日期: {announcement.publishDate}</span>
              <span>有效期至: {announcement.expireDate}</span>
            </div>
          </div>
        ))}
        
        {announcements.length === 0 && (
          <div className="py-12 text-center bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2">暂无公告</h3>
            <p className="text-gray-600">目前没有活动的公告，请稍后再查看</p>
          </div>
        )}
      </div>
    </main>
  );
} 