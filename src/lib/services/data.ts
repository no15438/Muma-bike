import { ServiceItem, ServiceStore, TimeSlot } from './types';

// 服务项目
export const serviceItems: ServiceItem[] = [
  // 维修服务
  {
    id: 'basic-tune-up',
    name: '基础调整',
    description: '基础的自行车调整服务，包括变速器调整、刹车调整、胎压检查等。',
    price: 199,
    type: 'repair',
    duration: 60,
    available: true
  },
  {
    id: 'advanced-tune-up',
    name: '高级调整',
    description: '全面的自行车调整服务，包括底部支架检查、花鼓调整、变速器深度调整等。',
    price: 399,
    type: 'repair',
    duration: 120,
    available: true
  },
  {
    id: 'flat-repair',
    name: '补胎/更换内胎',
    description: '处理轮胎漏气问题，包括补胎或更换内胎。',
    price: 99,
    type: 'repair',
    duration: 30,
    available: true
  },
  {
    id: 'brake-adjustment',
    name: '刹车调整',
    description: '调整刹车系统，确保制动力和响应性。',
    price: 149,
    type: 'repair',
    duration: 45,
    available: true
  },
  {
    id: 'derailleur-adjustment',
    name: '变速器调整',
    description: '调整前后变速器，确保换挡平顺。',
    price: 149,
    type: 'repair',
    duration: 45,
    available: true
  },
  {
    id: 'wheel-truing',
    name: '车轮校正',
    description: '校正车轮，消除跳动和弯曲。',
    price: 199,
    type: 'repair',
    duration: 60,
    available: true
  },
  {
    id: 'full-overhaul',
    name: '全车大保养',
    description: '全面的自行车保养服务，包括拆卸、清洁、润滑和调整所有组件。',
    price: 899,
    type: 'repair',
    duration: 240,
    available: true
  },
  // Bike Fitting 服务
  {
    id: 'basic-fitting',
    name: '基础适配',
    description: '基础的自行车适配服务，包括座椅高度、把手位置和踏板位置的调整。',
    price: 499,
    type: 'fitting',
    duration: 90,
    available: true
  },
  {
    id: 'pro-fitting',
    name: '专业适配',
    description: '全面的自行车适配服务，使用先进设备分析骑行姿势，并进行精确调整。',
    price: 999,
    type: 'fitting',
    duration: 180,
    available: true
  },
  {
    id: 'follow-up-fitting',
    name: '跟进适配',
    description: '针对已完成基础或专业适配的客户，进行跟进调整。',
    price: 299,
    type: 'fitting',
    duration: 60,
    available: true
  }
];

// 服务门店
export const serviceStores: ServiceStore[] = [
  {
    id: 'store-1',
    name: '牧马单车 - 朝阳门店',
    address: '北京市朝阳区建国路88号',
    phone: '010-12345678',
    openHours: '周一至周日 9:00-18:00',
    available: true
  },
  {
    id: 'store-2',
    name: '牧马单车 - 海淀门店',
    address: '北京市海淀区中关村大街1号',
    phone: '010-87654321',
    openHours: '周一至周日 9:00-18:00',
    available: true
  },
  {
    id: 'store-3',
    name: '牧马单车 - 西城门店',
    address: '北京市西城区西长安街66号',
    phone: '010-23456789',
    openHours: '周一至周日 9:00-18:00',
    available: true
  }
];

// 生成未来两周的可预约时间段
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();
  
  // 未来14天
  for (let i = 1; i <= 14; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    
    // 如果是周日，则不提供服务
    if (date.getDay() === 0) continue;
    
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // 每天9:00-17:00，每小时一个时间段
    for (let hour = 9; hour <= 17; hour++) {
      // 随机设置某些时间段已被预约
      const available = Math.random() > 0.3;
      
      slots.push({
        id: `${dateStr}-${hour}`,
        date: dateStr,
        time: `${hour.toString().padStart(2, '0')}:00`,
        available
      });
    }
  }
  
  return slots;
}

// 获取可预约日期列表
export function getAvailableDates() {
  const timeSlots = generateTimeSlots();
  const dates = new Set<string>();
  
  timeSlots.forEach(slot => {
    if (slot.available) {
      dates.add(slot.date);
    }
  });
  
  return Array.from(dates).sort();
}

// 根据日期获取可用时间段
export function getAvailableTimeSlotsByDate(date: string) {
  const timeSlots = generateTimeSlots();
  return timeSlots.filter(slot => slot.date === date && slot.available);
}

// 根据服务类型获取服务项目
export function getServiceItemsByType(type: 'repair' | 'fitting') {
  return serviceItems.filter(item => item.type === type && item.available);
} 