'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@/lib/auth/UserContext'
import { useEvents, EventRegistration } from '@/lib/events/EventContext'

// 模拟活动数据
const mockEvents = [
  {
    id: 'event1',
    title: '春季城市骑行之旅',
    description: '春暖花开，一起探索城市美景。沿途经过多个城市公园，全程约25公里，适合各级骑行爱好者参与。',
    type: 'riding',
    date: '2024-04-15',
    time: '08:00',
    location: '牧马单车店门口集合',
    price: 0,
    imageUrl: '/images/events/spring-city-ride.jpg'
  },
  {
    id: 'event2',
    title: '公路车骑行技巧工作坊',
    description: '由专业教练指导的公路车骑行技巧培训，内容包括正确的骑行姿势、变速技巧、爬坡下坡要领等。适合想提升骑行技巧的公路车爱好者。',
    type: 'workshop',
    date: '2024-04-22',
    time: '14:00',
    location: '牧马单车训练基地',
    price: 99,
    imageUrl: '/images/events/road-bike-workshop.jpg'
  },
  {
    id: 'event3',
    title: '郊外山地穿越挑战',
    description: '挑战性的山地骑行路线，穿越山地地形，体验刺激的下坡和技术性强的单车道。要求参与者有一定的山地车骑行经验。',
    type: 'riding',
    date: '2024-04-29',
    time: '07:30',
    location: '青龙山车场集合',
    price: 50,
    imageUrl: '/images/events/mountain-challenge.jpg'
  },
  {
    id: 'event4',
    title: '夜骑灯光装备讲座',
    description: '夜间骑行安全知识讲座，涵盖灯光装备选择、夜间骑行注意事项和紧急情况处理。所有参与者将获得一个免费的尾灯。',
    type: 'lecture',
    date: '2024-04-18',
    time: '19:00',
    location: '牧马单车店内',
    price: 0,
    imageUrl: '/images/events/night-riding-lecture.jpg'
  },
  {
    id: 'event5',
    title: '亲子骑行乐',
    description: '专为家庭设计的亲子骑行活动，在安全的公园道路上进行，包含互动游戏和野餐时间。适合有4-12岁小朋友的家庭。',
    type: 'riding',
    date: '2024-04-21',
    time: '09:30',
    location: '城市中央公园',
    price: 30,
    imageUrl: '/images/events/family-ride.jpg'
  }
];

// 组合用户报名和活动信息
interface UserEventInfo {
  registration: EventRegistration;
  event: any;  // 实际应用中应使用明确的事件类型
}

export default function MyEventsPage() {
  const { user, isAuthenticated } = useUser();
  const { getUserRegistrations, cancelRegistration } = useEvents();
  
  const [userEvents, setUserEvents] = useState<UserEventInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      // 获取用户的所有活动报名记录
      const registrations = getUserRegistrations(user.id);
      
      // 组合活动报名信息和活动详情
      const eventInfos = registrations
        .filter(reg => reg.status !== 'cancelled')
        .map(registration => {
          // 查找对应的活动信息
          const eventDetails = mockEvents.find(event => event.id === registration.eventId);
          return {
            registration,
            event: eventDetails || { id: registration.eventId, title: '活动信息不可用', date: '', status: 'unknown' }
          };
        });
        
      setUserEvents(eventInfos);
      setLoading(false);
    }
  }, [isAuthenticated, user, getUserRegistrations]);
  
  // 按照即将到来和已过期分类
  const currentDate = new Date();
  
  const upcomingEvents = userEvents.filter(({ event }) => {
    if (!event.date) return false;
    return new Date(event.date) >= currentDate;
  });
  
  const pastEvents = userEvents.filter(({ event }) => {
    if (!event.date) return false;
    return new Date(event.date) < currentDate;
  });
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      });
    } catch (e) {
      return dateStr;
    }
  };
  
  // 处理取消报名
  const handleCancelRegistration = (registrationId: string) => {
    const confirmCancel = window.confirm('确定要取消此活动报名吗？已支付的费用可能无法全额退还。');
    
    if (confirmCancel) {
      setCancellingId(registrationId);
      
      // 执行取消操作
      cancelRegistration(registrationId);
      
      // 更新界面
      setTimeout(() => {
        setUserEvents(prev => prev.filter(item => item.registration.id !== registrationId));
        setCancellingId(null);
      }, 1000);
    }
  };
  
  // 获取活动类型标签文本
  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'riding': return '骑行活动';
      case 'workshop': return '工作坊';
      case 'lecture': return '讲座';
      default: return '其他';
    }
  };
  
  // 获取活动类型标签样式
  const getEventTypeStyle = (type: string) => {
    switch (type) {
      case 'riding': return 'bg-blue-100 text-blue-800';
      case 'workshop': return 'bg-purple-100 text-purple-800';
      case 'lecture': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 获取支付状态标签样式
  const getPaymentStatusStyle = (hasPaid: boolean, price: number) => {
    if (price === 0) return 'bg-green-100 text-green-800';
    return hasPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };
  
  // 获取支付状态文本
  const getPaymentStatusText = (hasPaid: boolean, price: number) => {
    if (price === 0) return '免费活动';
    return hasPaid ? '已支付' : '待支付';
  };
  
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">我的活动</h1>
        
        {/* 标签切换 */}
        <div className="flex border-b mb-6">
          <button
            className={`pb-2 px-4 font-medium ${activeTab === 'upcoming' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            即将参加 ({upcomingEvents.length})
          </button>
          <button
            className={`pb-2 px-4 font-medium ${activeTab === 'past' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('past')}
          >
            历史活动 ({pastEvents.length})
          </button>
        </div>
        
        {/* 活动列表 */}
        <div className="space-y-4">
          {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).length > 0 ? (
            (activeTab === 'upcoming' ? upcomingEvents : pastEvents).map(({ registration, event }) => (
              <div key={registration.id} className="border rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-4 flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getEventTypeStyle(event.type)}`}>
                        {getEventTypeLabel(event.type)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentStatusStyle(registration.hasPaid, event.price)}`}>
                        {getPaymentStatusText(registration.hasPaid, event.price)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2">{event.title}</h3>
                    
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <span>{formatDate(event.date)} {event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                        <span>费用: {event.price === 0 ? '免费' : `¥${event.price}`}</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>报名时间: {new Date(registration.registrationTime).toLocaleString('zh-CN')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link href={`/events/${event.id}`} className="text-sm text-primary hover:underline">
                        查看活动详情
                      </Link>
                      
                      {activeTab === 'upcoming' && (
                        <button
                          onClick={() => handleCancelRegistration(registration.id)}
                          disabled={!!cancellingId}
                          className="text-sm text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
                        >
                          {cancellingId === registration.id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              取消中...
                            </span>
                          ) : '取消报名'}
                        </button>
                      )}
                      
                      {activeTab === 'upcoming' && event.price > 0 && !registration.hasPaid && (
                        <button className="text-sm bg-primary text-white px-4 py-1 rounded hover:bg-primary-dark">
                          立即支付
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5m0 0v4.5m0-4.5h18M5.25 9h13.5" />
              </svg>
              <h3 className="text-lg font-medium mb-2">
                {activeTab === 'upcoming' ? '暂无即将参加的活动' : '暂无历史活动记录'}
              </h3>
              <p className="mb-4">
                {activeTab === 'upcoming' ? '您可以前往活动页面查看和报名更多活动' : '参加活动后，您的历史记录将显示在此处'}
              </p>
              
              {activeTab === 'upcoming' && (
                <Link href="/events" className="btn">
                  浏览活动
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 