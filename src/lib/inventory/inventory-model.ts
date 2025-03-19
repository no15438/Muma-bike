export interface Category {
  id: string;
  name: string;
  parentId?: string;
  description?: string;
  showOnHomepage?: boolean; // 控制是否在主页显示
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  wechat?: string;
  address?: string;
}

export enum ProductStatus {
  ACTIVE = 'active',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
  COMING_SOON = 'coming_soon',
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  category?: Category;
  brand: string;
  description: string;
  price: number;
  costPrice: number;
  salePrice?: number;
  stockQuantity: number;
  status: ProductStatus;
  images: string[];
  specifications?: Record<string, string>; // 如: {颜色: '黑色', 尺寸: 'L'}
  attributes?: Record<string, string>; // 如: {材质: '铝合金', 重量: '12kg'}
  supplierId?: string;
  supplier?: Supplier;
  minStock?: number; // 库存警戒线
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  product?: Product;
  type: 'in' | 'out'; // 入库或出库
  quantity: number;
  reason: 'purchase' | 'sale' | 'return' | 'damage' | 'adjustment'; // 采购、销售、退货、损坏、调整
  relatedOrderId?: string; // 关联订单ID
  notes?: string;
  performedBy: string; // 操作人ID
  performedAt: string; // 操作时间
}

// 示例数据
export const sampleCategories: Category[] = [
  { id: 'cat1', name: '山地车', description: '适合野外骑行的山地自行车', showOnHomepage: true },
  { id: 'cat2', name: '公路车', description: '适合公路骑行的速度型自行车', showOnHomepage: true },
  { id: 'cat3', name: '城市车', description: '适合城市通勤的舒适型自行车', showOnHomepage: true },
  { id: 'cat4', name: '儿童车', description: '专为儿童设计的自行车', showOnHomepage: true },
  { id: 'cat5', name: '配件', description: '各类自行车配件', showOnHomepage: true },
  { id: 'cat5-1', name: '头盔', parentId: 'cat5', description: '骑行头盔', showOnHomepage: false },
  { id: 'cat5-2', name: '车灯', parentId: 'cat5', description: '自行车灯', showOnHomepage: false },
  { id: 'cat5-3', name: '水壶', parentId: 'cat5', description: '骑行水壶', showOnHomepage: false },
  { id: 'cat6', name: '工具', description: '维修工具和设备', showOnHomepage: false },
];

export const sampleSuppliers: Supplier[] = [
  {
    id: 'sup1',
    name: '捷安特中国',
    contactPerson: '张经理',
    phone: '13800138001',
    email: 'contact@giant-china.com',
    address: '江苏省昆山市某某路123号',
  },
  {
    id: 'sup2',
    name: '美利达中国',
    contactPerson: '李经理',
    phone: '13900139002',
    email: 'contact@merida-china.com',
    address: '上海市某某区某某路456号',
  },
  {
    id: 'sup3',
    name: '速珂电动',
    contactPerson: '王经理',
    phone: '13700137003',
    email: 'contact@soco.com',
    address: '深圳市某某区某某路789号',
  },
];

export const sampleProducts: Product[] = [
  {
    id: 'prod1',
    name: '捷安特 ATX 860 山地自行车',
    sku: 'BK-MTB-001',
    categoryId: 'cat1',
    brand: '捷安特 (Giant)',
    description: '高性能铝合金车架山地车，27速变速系统，液压碟刹。',
    price: 3499,
    costPrice: 2800,
    stockQuantity: 15,
    status: ProductStatus.ACTIVE,
    images: ['https://placehold.co/400x300?text=Giant+ATX+860'],
    specifications: { '颜色': '黑色/红色', '尺寸': 'M/L/XL' },
    attributes: { '材质': '铝合金', '重量': '12kg', '变速': '27速' },
    supplierId: 'sup1',
    minStock: 5,
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-03-10T14:25:00Z',
  },
  {
    id: 'prod2',
    name: '美利达 SCULTURA 400 公路自行车',
    sku: 'BK-ROAD-001',
    categoryId: 'cat2',
    brand: '美利达 (Merida)',
    description: '碳纤维车架公路车，22速变速系统，轻量化设计。',
    price: 5999,
    costPrice: 4800,
    stockQuantity: 8,
    status: ProductStatus.ACTIVE,
    images: ['https://placehold.co/400x300?text=Merida+SCULTURA+400'],
    specifications: { '颜色': '蓝色/白色', '尺寸': 'S/M/L' },
    attributes: { '材质': '碳纤维', '重量': '8.5kg', '变速': '22速' },
    supplierId: 'sup2',
    minStock: 3,
    createdAt: '2023-02-20T09:45:00Z',
    updatedAt: '2023-03-15T11:20:00Z',
  },
  {
    id: 'prod3',
    name: '捷安特 Momentum 城市通勤自行车',
    sku: 'BK-CITY-001',
    categoryId: 'cat3',
    brand: '捷安特 (Giant)',
    description: '舒适城市通勤车，7速变速，前框和后架，适合日常代步。',
    price: 1999,
    costPrice: 1600,
    stockQuantity: 20,
    status: ProductStatus.ACTIVE,
    images: ['https://placehold.co/400x300?text=Giant+Momentum'],
    specifications: { '颜色': '米色/棕色', '尺寸': '通用' },
    attributes: { '材质': '铝合金', '重量': '13kg', '变速': '7速' },
    supplierId: 'sup1',
    minStock: 8,
    createdAt: '2023-01-25T10:15:00Z',
    updatedAt: '2023-03-05T15:40:00Z',
  },
  {
    id: 'prod4',
    name: 'GUB山地车头盔',
    sku: 'AC-HELM-001',
    categoryId: 'cat5-1',
    brand: 'GUB',
    description: '轻量化山地车头盔，多孔通风设计，可调节头围。',
    price: 299,
    costPrice: 180,
    stockQuantity: 50,
    status: ProductStatus.ACTIVE,
    images: ['https://placehold.co/400x300?text=GUB+Helmet'],
    specifications: { '颜色': '黑色/红色/蓝色', '尺寸': '可调节' },
    attributes: { '材质': 'PC+EPS', '重量': '250g' },
    minStock: 15,
    createdAt: '2023-02-10T14:20:00Z',
    updatedAt: '2023-03-20T09:30:00Z',
  },
  {
    id: 'prod5',
    name: 'SAHOO 750ml骑行水壶',
    sku: 'AC-BOT-001',
    categoryId: 'cat5-3',
    brand: 'SAHOO',
    description: '大容量自行车水壶，食品级PP材质，防漏设计。',
    price: 89,
    costPrice: 45,
    stockQuantity: 100,
    status: ProductStatus.ACTIVE,
    images: ['https://placehold.co/400x300?text=SAHOO+Bottle'],
    specifications: { '颜色': '黑色/蓝色/红色', '容量': '750ml' },
    attributes: { '材质': '食品级PP', '重量': '82g' },
    minStock: 30,
    createdAt: '2023-02-05T11:30:00Z',
    updatedAt: '2023-03-18T16:15:00Z',
  },
  {
    id: 'prod6',
    name: '特里克 Marlin 5 山地自行车',
    sku: 'BK-MTB-002',
    categoryId: 'cat1',
    brand: '特里克 (Trek)',
    description: '入门级越野山地车，21速变速，液压碟刹，适合初学者。',
    price: 4599,
    costPrice: 3700,
    stockQuantity: 0,
    status: ProductStatus.OUT_OF_STOCK,
    images: ['https://placehold.co/400x300?text=Trek+Marlin+5'],
    specifications: { '颜色': '红色/黑色', '尺寸': 'S/M/L/XL' },
    attributes: { '材质': '铝合金', '重量': '13.5kg', '变速': '21速' },
    minStock: 4,
    createdAt: '2023-03-01T08:45:00Z',
    updatedAt: '2023-04-02T17:20:00Z',
  },
];

// 获取所有产品
export function getAllProducts(): Promise<Product[]> {
  return Promise.resolve([...sampleProducts]);
}

// 获取单个产品
export function getProductById(id: string): Promise<Product | null> {
  const product = sampleProducts.find(product => product.id === id) || null;
  return Promise.resolve(product);
}

// 搜索产品
export function searchProducts(filters: {
  name?: string;
  categoryId?: string;
  status?: ProductStatus;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}): Promise<Product[]> {
  let filteredProducts = [...sampleProducts];
  
  if (filters.name) {
    const name = filters.name.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(name) || p.sku.toLowerCase().includes(name)
    );
  }
  
  if (filters.categoryId) {
    filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
  }
  
  if (filters.status) {
    filteredProducts = filteredProducts.filter(p => p.status === filters.status);
  }
  
  if (filters.brand) {
    const brand = filters.brand.toLowerCase();
    filteredProducts = filteredProducts.filter(p => p.brand.toLowerCase().includes(brand));
  }
  
  if (filters.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
  }
  
  if (filters.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
  }
  
  if (filters.inStock) {
    filteredProducts = filteredProducts.filter(p => p.stockQuantity > 0);
  }
  
  return Promise.resolve(filteredProducts);
}

// 获取所有类别
export function getAllCategories(): Promise<Category[]> {
  return Promise.resolve([...sampleCategories]);
}

// 获取所有供应商
export function getAllSuppliers(): Promise<Supplier[]> {
  return Promise.resolve([...sampleSuppliers]);
}

// Helper functions for suppliers
export async function getSupplierById(id: string): Promise<Supplier | null> {
  // In a real app, this would be an API call
  return sampleSuppliers.find(supplier => supplier.id === id) || null;
}

// Helper functions for categories
export async function getCategoryById(id: string): Promise<Category | null> {
  // In a real app, this would be an API call
  return sampleCategories.find(category => category.id === id) || null;
}

// Get product status label for display
export function getProductStatusLabel(status: ProductStatus): string {
  const statusLabels: Record<ProductStatus, string> = {
    [ProductStatus.ACTIVE]: '在售',
    [ProductStatus.OUT_OF_STOCK]: '缺货',
    [ProductStatus.DISCONTINUED]: '已停产',
    [ProductStatus.COMING_SOON]: '即将上市',
  };
  
  return statusLabels[status] || status;
}

// Get product status color for UI display
export function getProductStatusColor(status: ProductStatus): string {
  const statusColors: Record<ProductStatus, string> = {
    [ProductStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [ProductStatus.OUT_OF_STOCK]: 'bg-yellow-100 text-yellow-800',
    [ProductStatus.DISCONTINUED]: 'bg-red-100 text-red-800',
    [ProductStatus.COMING_SOON]: 'bg-blue-100 text-blue-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
} 