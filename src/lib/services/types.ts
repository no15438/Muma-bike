// 服务类型
export type ServiceType = 'repair' | 'fitting';

// 服务项目
export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ServiceType;
  duration: number; // 分钟
  available: boolean;
};

// 服务点
export type ServiceStore = {
  id: string;
  name: string;
  address: string;
  phone: string;
  openHours: string;
  available: boolean;
};

// 可预约时间段
export type TimeSlot = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  available: boolean;
};

// 预约状态
export type AppointmentStatus = 
  | 'pending' // 待确认
  | 'confirmed' // 已确认
  | 'completed' // 已完成
  | 'cancelled' // 已取消

// 预约信息
export type Appointment = {
  id: string;
  userId?: string; // 用户ID，非会员可能没有
  name: string;
  phone: string;
  email?: string;
  serviceType: ServiceType;
  serviceItems: string[]; // 服务项目ID列表
  storeId: string;
  dateTime: {
    date: string;
    time: string;
  };
  status: AppointmentStatus;
  totalPrice: number;
  notes?: string;
  bikeInfo?: {
    brand?: string;
    model?: string;
    type?: string;
  };
  // 只有Bike Fitting才需要的身体数据
  fittingData?: {
    height?: number; // 身高，单位cm
    weight?: number; // 体重，单位kg
    inseam?: number; // 裤长，单位cm
    flexibility?: 'low' | 'medium' | 'high'; // 柔韧性
    ridingExperience?: 'beginner' | 'intermediate' | 'advanced'; // 骑行经验
    painPoints?: string[]; // 骑行中的疼痛点，如"neck", "back", "knees"等
  };
  createdAt: string; // ISO日期字符串
  updatedAt: string; // ISO日期字符串
}; 