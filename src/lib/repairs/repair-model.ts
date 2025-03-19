import { User } from '@/lib/auth/permissions';

export enum RepairStatus {
  PENDING = 'pending',         // 待接收
  DIAGNOSED = 'diagnosed',     // 已诊断
  IN_PROGRESS = 'in_progress', // 维修中
  WAITING_PARTS = 'waiting_parts', // 等待零件
  COMPLETED = 'completed',     // 已完成
  DELIVERED = 'delivered',     // 已交付
  CANCELLED = 'cancelled',     // 已取消
}

export enum RepairPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface RepairService {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedHours: number;
}

export interface RepairPart {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  isAvailable: boolean;
  estimatedDelivery?: string; // Date string if not available
}

export interface RepairLog {
  id: string;
  repairId: string;
  timestamp: string;
  technicianId: string;
  technician: User;
  message: string;
  statusChange?: RepairStatus;
  hoursSpent?: number;
}

export interface RepairImage {
  id: string;
  repairId: string;
  url: string;
  caption?: string;
  timestamp: string;
  uploadedBy: string;
}

export interface RepairOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  bikeModel: string;
  bikeSerialNumber?: string;
  bikeColor?: string;
  description: string;
  problemDescription: string;
  priority: RepairPriority;
  status: RepairStatus;
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  assignedTechnicianId?: string;
  assignedTechnician?: User;
  services: RepairService[];
  parts: RepairPart[];
  logs: RepairLog[];
  images: RepairImage[];
  notes?: string;
  estimatedCost: number;
  finalCost?: number;
  deposit?: number;
  isPaid: boolean;
}

// Sample repair services
export const repairServices: RepairService[] = [
  {
    id: '1',
    name: '基础维护',
    description: '清洁链条，检查刹车和变速器，润滑关键零部件',
    price: 120,
    estimatedHours: 1,
  },
  {
    id: '2',
    name: '刹车系统调整',
    description: '调整刹车片，更换刹车线（如需要），确保制动系统正常工作',
    price: 80,
    estimatedHours: 0.5,
  },
  {
    id: '3',
    name: '变速系统调整',
    description: '调整前后变速器，确保变速顺畅',
    price: 100,
    estimatedHours: 0.5,
  },
  {
    id: '4',
    name: '轮胎更换',
    description: '更换内胎或外胎，包括拆卸和安装',
    price: 60,
    estimatedHours: 0.5,
  },
  {
    id: '5',
    name: '完整大修',
    description: '全面检查自行车所有部件，包括拆卸，清洁，润滑和重新组装',
    price: 400,
    estimatedHours: 3,
  },
];

// Sample repair parts
export const repairParts: RepairPart[] = [
  {
    id: '1',
    name: '内胎 26"',
    description: '标准26寸自行车内胎',
    price: 35,
    quantity: 15,
    isAvailable: true,
  },
  {
    id: '2',
    name: '外胎 26"',
    description: '耐磨26寸自行车外胎',
    price: 150,
    quantity: 8,
    isAvailable: true,
  },
  {
    id: '3',
    name: '刹车片',
    description: '高品质刹车片，适合大多数型号',
    price: 40,
    quantity: 20,
    isAvailable: true,
  },
  {
    id: '4',
    name: '刹车线',
    description: '不锈钢刹车线',
    price: 25,
    quantity: 12,
    isAvailable: true,
  },
  {
    id: '5',
    name: '变速线',
    description: '高强度变速钢线',
    price: 30,
    quantity: 10,
    isAvailable: true,
  },
  {
    id: '6',
    name: 'SHIMANO 变速器',
    description: '高端变速器，适合山地车',
    price: 460,
    quantity: 0,
    isAvailable: false,
    estimatedDelivery: '2023-04-15',
  },
];

// Get repair status label for display
export function getRepairStatusLabel(status: RepairStatus): string {
  const statusLabels: Record<RepairStatus, string> = {
    [RepairStatus.PENDING]: '待接收',
    [RepairStatus.DIAGNOSED]: '已诊断',
    [RepairStatus.IN_PROGRESS]: '维修中',
    [RepairStatus.WAITING_PARTS]: '等待零件',
    [RepairStatus.COMPLETED]: '已完成',
    [RepairStatus.DELIVERED]: '已交付',
    [RepairStatus.CANCELLED]: '已取消',
  };
  
  return statusLabels[status] || status;
}

// Get status color for UI display
export function getRepairStatusColor(status: RepairStatus): string {
  const statusColors: Record<RepairStatus, string> = {
    [RepairStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [RepairStatus.DIAGNOSED]: 'bg-blue-100 text-blue-800',
    [RepairStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800',
    [RepairStatus.WAITING_PARTS]: 'bg-orange-100 text-orange-800',
    [RepairStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [RepairStatus.DELIVERED]: 'bg-teal-100 text-teal-800',
    [RepairStatus.CANCELLED]: 'bg-red-100 text-red-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

// Get priority label
export function getRepairPriorityLabel(priority: RepairPriority): string {
  const priorityLabels: Record<RepairPriority, string> = {
    [RepairPriority.LOW]: '低',
    [RepairPriority.MEDIUM]: '中',
    [RepairPriority.HIGH]: '高',
    [RepairPriority.URGENT]: '紧急',
  };
  
  return priorityLabels[priority] || priority;
}

// Get priority color for UI display
export function getRepairPriorityColor(priority: RepairPriority): string {
  const priorityColors: Record<RepairPriority, string> = {
    [RepairPriority.LOW]: 'bg-blue-100 text-blue-800',
    [RepairPriority.MEDIUM]: 'bg-green-100 text-green-800',
    [RepairPriority.HIGH]: 'bg-yellow-100 text-yellow-800',
    [RepairPriority.URGENT]: 'bg-red-100 text-red-800',
  };
  
  return priorityColors[priority] || 'bg-gray-100 text-gray-800';
}

// Sample repair orders for development (mock data)
export const sampleRepairOrders: RepairOrder[] = [
  {
    id: 'R10001',
    customerName: '张三',
    customerPhone: '13800138001',
    customerEmail: 'zhangsan@example.com',
    bikeModel: '捷安特 ATX 860',
    bikeSerialNumber: 'GT12345678',
    bikeColor: '黑色/红色',
    description: '山地车',
    problemDescription: '刹车系统异常，变速不顺畅',
    priority: RepairPriority.MEDIUM,
    status: RepairStatus.IN_PROGRESS,
    createdAt: '2023-04-01T09:30:00Z',
    updatedAt: '2023-04-02T14:15:00Z',
    scheduledDate: '2023-04-03T10:00:00Z',
    estimatedCompletionDate: '2023-04-05T17:00:00Z',
    assignedTechnicianId: '3',
    services: [
      repairServices[1], // 刹车系统调整
      repairServices[2], // 变速系统调整
    ],
    parts: [
      { ...repairParts[2], quantity: 1 }, // 刹车片
      { ...repairParts[4], quantity: 1 }, // 变速线
    ],
    logs: [
      {
        id: 'L1001',
        repairId: 'R10001',
        timestamp: '2023-04-01T09:30:00Z',
        technicianId: '3',
        technician: {
          id: '3',
          name: '技师小王',
          email: 'tech1@mumabike.com',
          role: 'technician' as any,
        },
        message: '接收到维修订单，已安排检查',
        statusChange: RepairStatus.PENDING,
      },
      {
        id: 'L1002',
        repairId: 'R10001',
        timestamp: '2023-04-02T14:15:00Z',
        technicianId: '3',
        technician: {
          id: '3',
          name: '技师小王',
          email: 'tech1@mumabike.com',
          role: 'technician' as any,
        },
        message: '诊断完成，需要更换刹车片和调整变速器',
        statusChange: RepairStatus.DIAGNOSED,
        hoursSpent: 0.5,
      },
      {
        id: 'L1003',
        repairId: 'R10001',
        timestamp: '2023-04-03T10:30:00Z',
        technicianId: '3',
        technician: {
          id: '3',
          name: '技师小王',
          email: 'tech1@mumabike.com',
          role: 'technician' as any,
        },
        message: '开始进行维修，更换刹车片',
        statusChange: RepairStatus.IN_PROGRESS,
        hoursSpent: 0.5,
      },
    ],
    images: [
      {
        id: 'I1001',
        repairId: 'R10001',
        url: 'https://placehold.co/400x300?text=Bicycle+Brakes',
        caption: '刹车系统照片',
        timestamp: '2023-04-01T10:00:00Z',
        uploadedBy: '3',
      },
    ],
    notes: '客户要求尽快完成，周五需要骑行',
    estimatedCost: 220, // 80 (刹车系统) + 100 (变速系统) + 40 (刹车片)
    deposit: 100,
    isPaid: false,
  },
  {
    id: 'R10002',
    customerName: '李四',
    customerPhone: '13900139002',
    customerEmail: 'lisi@example.com',
    bikeModel: '美利达 SCULTURA 400',
    bikeColor: '蓝色',
    description: '公路车',
    problemDescription: '轮胎漏气，需要更换内胎',
    priority: RepairPriority.LOW,
    status: RepairStatus.COMPLETED,
    createdAt: '2023-04-02T11:00:00Z',
    updatedAt: '2023-04-02T15:30:00Z',
    scheduledDate: '2023-04-02T14:00:00Z',
    estimatedCompletionDate: '2023-04-02T16:00:00Z',
    actualCompletionDate: '2023-04-02T15:30:00Z',
    assignedTechnicianId: '4',
    services: [
      repairServices[3], // 轮胎更换
    ],
    parts: [
      { ...repairParts[0], quantity: 1 }, // 内胎
    ],
    logs: [
      {
        id: 'L2001',
        repairId: 'R10002',
        timestamp: '2023-04-02T11:00:00Z',
        technicianId: '4',
        technician: {
          id: '4',
          name: '技师小李',
          email: 'tech2@mumabike.com',
          role: 'technician' as any,
        },
        message: '接收到维修订单，轮胎漏气',
        statusChange: RepairStatus.PENDING,
      },
      {
        id: 'L2002',
        repairId: 'R10002',
        timestamp: '2023-04-02T14:15:00Z',
        technicianId: '4',
        technician: {
          id: '4',
          name: '技师小李',
          email: 'tech2@mumabike.com',
          role: 'technician' as any,
        },
        message: '开始更换内胎',
        statusChange: RepairStatus.IN_PROGRESS,
        hoursSpent: 0.25,
      },
      {
        id: 'L2003',
        repairId: 'R10002',
        timestamp: '2023-04-02T15:30:00Z',
        technicianId: '4',
        technician: {
          id: '4',
          name: '技师小李',
          email: 'tech2@mumabike.com',
          role: 'technician' as any,
        },
        message: '内胎更换完成，充气测试通过',
        statusChange: RepairStatus.COMPLETED,
        hoursSpent: 0.25,
      },
    ],
    images: [],
    estimatedCost: 95, // 60 (轮胎更换) + 35 (内胎)
    finalCost: 95,
    isPaid: true,
  },
  {
    id: 'R10003',
    customerName: '王五',
    customerPhone: '13700137003',
    customerEmail: 'wangwu@example.com',
    bikeModel: '特里克 Marlin 5',
    bikeSerialNumber: 'T98765432',
    bikeColor: '红色',
    description: '山地车',
    problemDescription: '需要全面检修，长时间未使用',
    priority: RepairPriority.HIGH,
    status: RepairStatus.WAITING_PARTS,
    createdAt: '2023-04-03T10:00:00Z',
    updatedAt: '2023-04-04T11:30:00Z',
    scheduledDate: '2023-04-04T09:00:00Z',
    estimatedCompletionDate: '2023-04-10T17:00:00Z',
    assignedTechnicianId: '3',
    services: [
      repairServices[4], // 完整大修
    ],
    parts: [
      { ...repairParts[2], quantity: 1 }, // 刹车片
      { ...repairParts[5], quantity: 1 }, // SHIMANO 变速器
    ],
    logs: [
      {
        id: 'L3001',
        repairId: 'R10003',
        timestamp: '2023-04-03T10:00:00Z',
        technicianId: '3',
        technician: {
          id: '3',
          name: '技师小王',
          email: 'tech1@mumabike.com',
          role: 'technician' as any,
        },
        message: '接收到维修订单，需要全面检修',
        statusChange: RepairStatus.PENDING,
      },
      {
        id: 'L3002',
        repairId: 'R10003',
        timestamp: '2023-04-04T10:30:00Z',
        technicianId: '3',
        technician: {
          id: '3',
          name: '技师小王',
          email: 'tech1@mumabike.com',
          role: 'technician' as any,
        },
        message: '诊断完成，需要更换刹车片和变速器',
        statusChange: RepairStatus.DIAGNOSED,
        hoursSpent: 1,
      },
      {
        id: 'L3003',
        repairId: 'R10003',
        timestamp: '2023-04-04T11:30:00Z',
        technicianId: '3',
        technician: {
          id: '3',
          name: '技师小王',
          email: 'tech1@mumabike.com',
          role: 'technician' as any,
        },
        message: '变速器缺货，需要等待零件到货',
        statusChange: RepairStatus.WAITING_PARTS,
        hoursSpent: 0.5,
      },
    ],
    images: [
      {
        id: 'I3001',
        repairId: 'R10003',
        url: 'https://placehold.co/400x300?text=Bicycle+Gears',
        caption: '变速器损坏照片',
        timestamp: '2023-04-04T10:45:00Z',
        uploadedBy: '3',
      },
    ],
    notes: '客户同意等待高端变速器到货',
    estimatedCost: 900, // 400 (完整大修) + 40 (刹车片) + 460 (变速器)
    deposit: 450,
    isPaid: false,
  },
];

// Get all repair orders (simulating database call)
export function getAllRepairOrders(): Promise<RepairOrder[]> {
  return Promise.resolve([...sampleRepairOrders]);
}

// Get a specific repair order by ID
export function getRepairOrderById(id: string): Promise<RepairOrder | null> {
  const order = sampleRepairOrders.find(order => order.id === id) || null;
  return Promise.resolve(order);
}

// Search repair orders with filters
export function searchRepairOrders(filters: {
  status?: RepairStatus;
  priority?: RepairPriority;
  technicianId?: string;
  customerName?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<RepairOrder[]> {
  let filteredOrders = [...sampleRepairOrders];
  
  if (filters.status) {
    filteredOrders = filteredOrders.filter(o => o.status === filters.status);
  }
  
  if (filters.priority) {
    filteredOrders = filteredOrders.filter(o => o.priority === filters.priority);
  }
  
  if (filters.technicianId) {
    filteredOrders = filteredOrders.filter(o => o.assignedTechnicianId === filters.technicianId);
  }
  
  if (filters.customerName) {
    const name = filters.customerName.toLowerCase();
    filteredOrders = filteredOrders.filter(o => 
      o.customerName.toLowerCase().includes(name)
    );
  }
  
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    filteredOrders = filteredOrders.filter(o => 
      new Date(o.createdAt) >= fromDate
    );
  }
  
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    filteredOrders = filteredOrders.filter(o => 
      new Date(o.createdAt) <= toDate
    );
  }
  
  return Promise.resolve(filteredOrders);
} 