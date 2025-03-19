'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useUser } from '@/lib/auth/UserContext'
import { useEvents } from '@/lib/events/EventContext'

// 使用与列表页相同的模拟数据
const mockEvents = [
  {
    id: 'event1',
    title: '春季城市骑行之旅',
    description: '春暖花开，一起探索城市美景。沿途经过多个城市公园，全程约25公里，适合各级骑行爱好者参与。',
    fullDescription: `## 活动介绍

春暖花开的四月，正是骑行的好时节。本次骑行活动将沿着城市绿道系统，穿越多个城市公园，欣赏春季盛开的花朵和绿意盎然的风景。

全程约25公里，道路平坦，难度低，非常适合初学者和家庭参与。沿途我们会经过东湖公园、滨江绿道、樱花林等景点，并在中途设有休息站，提供水和简单补给。

## 行程安排

- 08:00 - 08:30：牧马单车店门口集合，车辆检查
- 08:30 - 10:30：第一段骑行（约12公里）
- 10:30 - 11:00：东湖公园休息站补给
- 11:00 - 12:30：第二段骑行（约13公里）
- 12:30 - 14:00：返回起点，共享午餐

## 装备要求

- 自行车（如需租赁，请提前联系我们）
- 头盔（必须）
- 骑行手套（建议）
- 水壶或水袋
- 舒适运动服装
- 防晒用品

## 安全提示

- 全程骑行请遵守交通规则
- 保持队形，注意前后车距
- 听从领队指挥，不擅自脱离队伍
- 量力而行，如感到不适请立即告知工作人员

## 费用说明

本次活动免费参加，但需提前报名预留名额。活动结束后的共享午餐费用自理（约30元/人）。`,
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
    organizerContact: '138-1234-5678',
    status: 'upcoming',
    tags: ['城市骑行', '周末活动', '初学者友好'],
    participants: [
      { id: 'user1', name: '张三' },
      { id: 'user2', name: '李四' },
      // ... 其他参与者
    ]
  },
  {
    id: 'event2',
    title: '公路车骑行技巧工作坊',
    description: '由专业教练指导的公路车骑行技巧培训，内容包括正确的骑行姿势、变速技巧、爬坡下坡要领等。适合想提升骑行技巧的公路车爱好者。',
    fullDescription: `## 工作坊内容

这是一个为期3小时的专业公路车技巧培训课程，由前职业车手张教练亲自指导。通过理论讲解与实践相结合的方式，帮助你掌握公路车骑行的核心技巧。

本次工作坊将着重讲解：

1. 科学的骑行姿势与肌肉配合
2. 高效踏频与变速技巧
3. 爬坡与下坡技术
4. 弯道过弯与重心控制
5. 集体骑行时的队形与技巧

课程将在理论讲解后立即进行实践操作，让你在专业指导下纠正不良骑行习惯，提升骑行效率与安全性。

## 适合人群

- 已有公路车骑行基础（至少能够连续骑行30公里以上）
- 希望提升骑行技巧、增加骑行效率的车友
- 准备参加业余赛事的爱好者

## 课程安排

- 14:00 - 14:30：理论讲解（室内）
- 14:30 - 16:30：户外实践训练
- 16:30 - 17:00：总结与答疑

## 装备要求

- 公路自行车（如无可租赁，需额外费用）
- 头盔（必须）
- 骑行服装与手套
- 骑行鞋（如有）
- 水壶

## 费用说明

工作坊费用为99元/人，包含：
- 专业教练指导
- 课程资料
- 运动饮料与能量补给
- 活动保险

如需租赁公路车，需额外支付200元租赁费。`,
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
    organizerContact: '139-8765-4321',
    status: 'upcoming',
    tags: ['技能培训', '公路车', '进阶技巧'],
    participants: [
      { id: 'user3', name: '王五' },
      { id: 'user4', name: '赵六' },
      // ... 其他参与者
    ]
  },
  // ... 其他活动数据
];

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { user, isAuthenticated } = useUser();
  const { registerForEvent, getRegistration } = useEvents();
  
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    phone: '',
    email: '',
    emergencyContact: '',
    hasBike: true,
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userHasRegistered, setUserHasRegistered] = useState(false);
  
  useEffect(() => {
    // 在客户端获取活动数据
    setLoading(true);
    
    // 模拟API调用延迟
    setTimeout(() => {
      const foundEvent = mockEvents.find(e => e.id === eventId);
      setEvent(foundEvent || null);
      setLoading(false);
      
      // 如果用户登录了，检查是否已经报名
      if (isAuthenticated && user) {
        const existingRegistration = getRegistration(user.id, eventId);
        setUserHasRegistered(!!existingRegistration && existingRegistration.status !== 'cancelled');
        
        // 预填写表单
        setRegistrationForm(prev => ({
          ...prev,
          name: user.name,
          email: user.email || '',
          phone: user.phone || ''
        }));
      }
    }, 300);
  }, [eventId, isAuthenticated, user, getRegistration]);
  
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
  
  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!registrationForm.name || !registrationForm.phone) {
      alert('请填写必要的信息（姓名、手机号）');
      return;
    }
    
    // 模拟表单提交
    setFormSubmitted(true);
    
    // 如果用户已登录，保存报名信息
    if (isAuthenticated && user && event) {
      // 注册活动
      registerForEvent({
        userId: user.id,
        eventId: event.id,
        status: 'registered',
        hasPaid: event.price === 0, // 免费活动自动标记为已支付
        hasAttended: false,
        additionalInfo: registrationForm.message
      });
    }
    
    // 模拟API调用
    setTimeout(() => {
      setRegistrationSuccess(true);
      
      // 更新参与人数 (实际中会由后端处理)
      if (event) {
        setEvent({
          ...event,
          enrolled: event.enrolled + 1
        });
      }
    }, 1000);
  };
  
  // 处理表单值变更
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setRegistrationForm({
        ...registrationForm,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setRegistrationForm({
        ...registrationForm,
        [name]: value
      });
    }
  };
  
  // 将Markdown格式的内容转换为HTML（简化版）
  const formatContent = (content: string = '') => {
    // 分割成段落
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // 标题处理
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold mt-6 mb-3">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      
      // 列表处理
      if (paragraph.includes('\n- ')) {
        const listItems = paragraph.split('\n- ');
        const title = listItems.shift();
        
        return (
          <div key={index}>
            {title && <p className="mb-2">{title}</p>}
            <ul className="list-disc pl-6 mb-4 space-y-1">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
        );
      }
      
      // 数字列表处理
      if (paragraph.includes('\n1. ')) {
        const listItems = paragraph.split('\n');
        const title = listItems[0].startsWith('1. ') ? null : listItems.shift();
        
        return (
          <div key={index}>
            {title && <p className="mb-2">{title}</p>}
            <ol className="list-decimal pl-6 mb-4 space-y-1">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-700">{item.replace(/^\d+\.\s/, '')}</li>
              ))}
            </ol>
          </div>
        );
      }
      
      // 普通段落
      return (
        <p key={index} className="mb-4">
          {paragraph}
        </p>
      );
    });
  };
  
  if (loading) {
    return (
      <div className="container-custom py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载活动信息...</p>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">未找到活动</h1>
        <p className="text-gray-600 mb-6">抱歉，无法找到该活动信息</p>
        <Link href="/events" className="btn">
          查看所有活动
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-8">
      <Link href="/events" className="inline-flex items-center text-primary hover:underline mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        返回活动列表
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 活动详情区 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* 活动图片 */}
            <div className="h-64 sm:h-80 md:h-96 bg-gray-200 flex items-center justify-center text-gray-500">
              {event.imageUrl ? `活动图片：${event.title}` : '无图片'}
            </div>
            
            {/* 活动标题区 */}
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
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
              
              <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
              
              {/* 活动基本信息 */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span><strong>时间：</strong>{formatDate(event.date)} {event.time}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span><strong>地点：</strong>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span><strong>组织者：</strong>{event.organizer}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                  <span><strong>人数：</strong>{event.enrolled}/{event.capacity}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>时长：</strong>{Math.floor(event.duration / 60)}小时{event.duration % 60 > 0 ? ` ${event.duration % 60}分钟` : ''}</span>
                </div>
                {event.distance && (
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                    </svg>
                    <span><strong>距离：</strong>{event.distance}公里</span>
                  </div>
                )}
              </div>
              
              {/* 活动详细描述 */}
              <div className="prose prose-lg max-w-none">
                {formatContent(event.fullDescription)}
              </div>
              
              {/* 标签 */}
              <div className="mt-6 flex flex-wrap gap-2">
                {event.tags.map((tag: string, index: number) => (
                  <span key={index} className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 报名表单区 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">活动报名</h2>
            
            {/* 用户已报名 */}
            {isAuthenticated && userHasRegistered ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-green-800 mb-2">您已成功报名</h3>
                <p className="text-sm text-green-700">
                  我们将在活动开始前通过短信或邮件提醒您
                </p>
              </div>
            ) : (
              <>
                {/* 是否有名额 */}
                {event?.enrolled >= event?.capacity ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
                    <h3 className="font-semibold text-yellow-800 mb-2">活动名额已满</h3>
                    <p className="text-sm text-yellow-700">
                      您可以留下联系方式加入候补名单，如有空缺我们会第一时间通知您。
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-green-800">剩余名额</span>
                      <span className="text-green-800 font-bold">{event?.capacity - event?.enrolled}</span>
                    </div>
                  </div>
                )}
                
                {/* 价格信息 */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">活动费用</span>
                    <span className="font-bold text-lg">
                      {event?.price === 0 ? '免费' : `¥${event?.price.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {event?.price > 0 && (
                    <p className="text-sm text-gray-500">
                      请在报名成功后24小时内完成支付，逾期未支付将自动取消报名
                    </p>
                  )}
                </div>
                
                {/* 报名表单 */}
                {registrationSuccess ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">报名成功！</h3>
                    <p className="text-gray-600 mb-4">
                      您已成功报名参加"{event?.title}"活动。<br />
                      我们会在活动开始前通过短信或邮件提醒您。
                    </p>
                    {event?.price > 0 && (
                      <div className="bg-yellow-50 p-4 rounded-lg mb-4 text-sm text-yellow-800">
                        请在24小时内完成支付，您可以在"我的活动"中查看详情并支付。
                      </div>
                    )}
                    <Link href="/events" className="btn">
                      返回活动列表
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                        <input
                          type="text"
                          name="name"
                          value={registrationForm.name}
                          onChange={handleFormChange}
                          placeholder="请输入您的姓名"
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">手机号 *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={registrationForm.phone}
                          onChange={handleFormChange}
                          placeholder="联系电话"
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                        <input
                          type="email"
                          name="email"
                          value={registrationForm.email}
                          onChange={handleFormChange}
                          placeholder="选填"
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">紧急联系人电话</label>
                        <input
                          type="tel"
                          name="emergencyContact"
                          value={registrationForm.emergencyContact}
                          onChange={handleFormChange}
                          placeholder="选填，骑行活动建议填写"
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      {event.type === 'riding' && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="hasBike"
                            name="hasBike"
                            checked={registrationForm.hasBike}
                            onChange={handleFormChange}
                            className="mr-2"
                          />
                          <label htmlFor="hasBike" className="text-sm text-gray-700">
                            我自带自行车参加活动
                          </label>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">备注信息</label>
                        <textarea
                          name="message"
                          value={registrationForm.message}
                          onChange={handleFormChange}
                          rows={3}
                          placeholder="对活动有什么问题或特殊要求可以在这里告诉我们"
                          className="w-full p-2 border rounded-md"
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full btn"
                        disabled={formSubmitted}
                      >
                        {formSubmitted ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            处理中...
                          </span>
                        ) : (
                          '立即报名'
                        )}
                      </button>
                      
                      <p className="text-xs text-gray-500 text-center">
                        点击"立即报名"，即表示您同意活动的各项规则和免责条款
                      </p>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 