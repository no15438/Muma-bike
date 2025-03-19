'use client'

import { useState } from 'react'
import Link from 'next/link'

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
    capacity: 30,
    enrolled: 18,
    price: 0, // 免费活动
    difficulty: 'easy', // 容易
    distance: 25, // 公里
    duration: 150, // 分钟
    imageUrl: '/images/events/spring-city-ride.jpg',
    organizer: '牧马单车俱乐部',
    status: 'upcoming',
    tags: ['城市骑行', '周末活动', '初学者友好']
  },
  {
    id: 'event2',
    title: '公路车骑行技巧工作坊',
    description: '由专业教练指导的公路车骑行技巧培训，内容包括正确的骑行姿势、变速技巧、爬坡下坡要领等。适合想提升骑行技巧的公路车爱好者。',
    type: 'workshop',
    date: '2024-04-22',
    time: '14:00',
    location: '牧马单车训练基地',
    capacity: 15,
    enrolled: 10,
    price: 99, // 收费活动
    difficulty: 'medium', // 中等
    duration: 180, // 分钟
    imageUrl: '/images/events/road-bike-workshop.jpg',
    organizer: '张教练',
    status: 'upcoming',
    tags: ['技能培训', '公路车', '进阶技巧']
  },
  {
    id: 'event3',
    title: '郊外山地穿越挑战',
    description: '挑战性的山地骑行路线，穿越山地地形，体验刺激的下坡和技术性强的单车道。要求参与者有一定的山地车骑行经验。',
    type: 'riding',
    date: '2024-04-29',
    time: '07:30',
    location: '青龙山车场集合',
    capacity: 20,
    enrolled: 12,
    price: 50, // 收费活动
    difficulty: 'hard', // 困难
    distance: 40, // 公里
    duration: 240, // 分钟
    imageUrl: '/images/events/mountain-challenge.jpg',
    organizer: '牧马山地车队',
    status: 'upcoming',
    tags: ['山地骑行', '挑战', '高级']
  },
  {
    id: 'event4',
    title: '夜骑灯光装备讲座',
    description: '夜间骑行安全知识讲座，涵盖灯光装备选择、夜间骑行注意事项和紧急情况处理。所有参与者将获得一个免费的尾灯。',
    type: 'lecture',
    date: '2024-04-18',
    time: '19:00',
    location: '牧马单车店内',
    capacity: 40,
    enrolled: 22,
    price: 0, // 免费活动
    duration: 90, // 分钟
    imageUrl: '/images/events/night-riding-lecture.jpg',
    organizer: '李安全',
    status: 'upcoming',
    tags: ['安全知识', '夜骑', '装备']
  },
  {
    id: 'event5',
    title: '亲子骑行乐',
    description: '专为家庭设计的亲子骑行活动，在安全的公园道路上进行，包含互动游戏和野餐时间。适合有4-12岁小朋友的家庭。',
    type: 'riding',
    date: '2024-04-21',
    time: '09:30',
    location: '城市中央公园',
    capacity: 15, // 15个家庭
    enrolled: 8,
    price: 30, // 每个家庭
    difficulty: 'easy', // 容易
    distance: 8, // 公里
    duration: 180, // 分钟，包含活动时间
    imageUrl: '/images/events/family-ride.jpg',
    organizer: '牧马亲子俱乐部',
    status: 'upcoming',
    tags: ['亲子活动', '家庭友好', '休闲']
  }
];

export default function EventsPage() {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  
  // 根据筛选条件过滤活动
  const filteredEvents = mockEvents.filter(event => {
    if (filterType && event.type !== filterType) return false;
    if (filterDifficulty && event.difficulty !== filterDifficulty) return false;
    return true;
  });
  
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
  
  // 获取难度文本
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '初级';
      case 'medium': return '中级';
      case 'hard': return '高级';
      default: return '未指定';
    }
  };
  
  // 获取难度标签样式
  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
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
  
  return (
    <main className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">车友活动</h1>
        <p className="text-gray-600">加入我们的骑行活动、讲座和工作坊，与更多车友一起分享骑行乐趣</p>
      </div>
      
      {/* 筛选选项 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">筛选活动</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">活动类型</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType(null)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterType === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setFilterType('riding')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterType === 'riding' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                骑行活动
              </button>
              <button
                onClick={() => setFilterType('workshop')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterType === 'workshop' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                工作坊
              </button>
              <button
                onClick={() => setFilterType('lecture')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterType === 'lecture' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                讲座
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">难度等级</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterDifficulty(null)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterDifficulty === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setFilterDifficulty('easy')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterDifficulty === 'easy' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                初级
              </button>
              <button
                onClick={() => setFilterDifficulty('medium')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterDifficulty === 'medium' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                中级
              </button>
              <button
                onClick={() => setFilterDifficulty('hard')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterDifficulty === 'hard' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                高级
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 活动列表 */}
      <div className="space-y-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <Link 
              key={event.id} 
              href={`/events/${event.id}`}
              className="block transition-transform hover:scale-[1.01]"
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-gray-200 h-48 md:h-auto">
                  {/* 实际项目中这里会显示真实图片 */}
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    {event.imageUrl ? 
                      `活动图片：${event.title}` : 
                      '无图片'
                    }
                  </div>
                </div>
                <div className="p-5 md:w-2/3">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getEventTypeStyle(event.type)}`}>
                      {getEventTypeLabel(event.type)}
                    </span>
                    {event.difficulty && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyStyle(event.difficulty)}`}>
                        {getDifficultyLabel(event.difficulty)}
                      </span>
                    )}
                    {event.price === 0 ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">免费</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                        ¥{event.price}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                  
                  <div className="mb-3 text-gray-600 line-clamp-2">
                    {event.description}
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span>{formatDate(event.date)} {event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                      <span>已报名: {event.enrolled}/{event.capacity}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {event.tags.length > 2 && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          +{event.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <div className="text-primary font-medium">查看详情</div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-2">暂无符合条件的活动</h3>
            <p className="text-gray-600 mb-4">请尝试更改筛选条件，或稍后再查看</p>
            <button
              onClick={() => { setFilterType(null); setFilterDifficulty(null); }}
              className="btn"
            >
              查看所有活动
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 