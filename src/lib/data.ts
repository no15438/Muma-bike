// 定义产品分类
export type Category = {
  id: string;
  name: string;
  description: string;
  showOnHomepage?: boolean;
};

// 定义品牌
export type Brand = {
  id: string;
  name: string;
  logo: string;
  description: string;
};

// 定义产品类型
export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  images: string[];
  category: string;
  brand: string;
  stock: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
};

// 优惠券类型
export type Coupon = {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'amount' | 'percentage'; // 金额折扣或百分比折扣
  discountValue: number; // 折扣金额或百分比值
  minPurchase: number; // 最低使用金额
  startDate: string; // 开始日期
  endDate: string; // 结束日期
  isUsed?: boolean; // 是否已使用
  imageUrl: string; // 优惠券背景图片
};

// 商品分类数据
export const categories: Category[] = [
  {
    id: 'mountain',
    name: '山地车',
    description: '适合野外山地骑行的自行车，配备减震系统和宽轮胎，提供更好的稳定性和操控。',
    showOnHomepage: true
  },
  {
    id: 'road',
    name: '公路车',
    description: '为速度设计的轻量级自行车，有细轮胎和弯把，适合长距离骑行和竞赛。',
    showOnHomepage: true
  },
  {
    id: 'city',
    name: '城市休闲车',
    description: '适合城市通勤的舒适型自行车，注重舒适性和实用性，通常配备挡泥板和货架。',
    showOnHomepage: true
  },
  {
    id: 'kids',
    name: '儿童车',
    description: '专为儿童设计的自行车，尺寸更小，安全性更高，适合儿童学习和娱乐使用。',
    showOnHomepage: true
  },
  {
    id: 'parts',
    name: '配件',
    description: '各种自行车配件，包括车座、把手、轮胎、车灯等，提升骑行体验。',
    showOnHomepage: true
  },
  {
    id: 'accessories',
    name: '骑行装备',
    description: '骑行所需的各种装备，包括头盔、手套、骑行服、骑行鞋等。',
    showOnHomepage: true
  }
];

// 品牌数据
export const brands: Brand[] = [
  {
    id: 'giant',
    name: '捷安特 (Giant)',
    logo: '/images/brands/giant.png',
    description: '全球最大的自行车制造商之一，提供从入门级到高端的全系列自行车。'
  },
  {
    id: 'trek',
    name: '崔克 (Trek)',
    logo: '/images/brands/trek.png',
    description: '美国著名自行车品牌，产品线包括山地车、公路车和休闲车。'
  },
  {
    id: 'specialized',
    name: '闪电 (Specialized)',
    logo: '/images/brands/specialized.png',
    description: '创新和高性能自行车的代表，在专业赛事中拥有众多冠军记录。'
  },
  {
    id: 'merida',
    name: '美利达 (Merida)',
    logo: '/images/brands/merida.png',
    description: '台湾知名自行车品牌，在全球拥有广泛的用户群体。'
  },
  {
    id: 'cannondale',
    name: '卡诺德 (Cannondale)',
    logo: '/images/brands/cannondale.png',
    description: '以创新的铝合金车架和单叉前叉设计著称的美国品牌。'
  },
  {
    id: 'brompton',
    name: '布朗普顿 (Brompton)',
    logo: '/images/brands/brompton.png',
    description: '英国高端折叠自行车品牌，以精致做工和实用设计闻名。'
  }
];

// 模拟用户优惠券数据
export const userCoupons: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'WELCOME100',
    name: '新用户专享券',
    description: '首次购物满1000元立减100元',
    discountType: 'amount',
    discountValue: 100,
    minPurchase: 1000,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    imageUrl: '/images/coupons/coupon-bg-1.jpg'
  },
  {
    id: 'coupon-2',
    code: 'SPRING15',
    name: '春季特惠券',
    description: '春季购物满500元享85折优惠',
    discountType: 'percentage',
    discountValue: 15,
    minPurchase: 500,
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    imageUrl: '/images/coupons/coupon-bg-2.jpg'
  },
  {
    id: 'coupon-3',
    code: 'BIKE200',
    name: '整车专享券',
    description: '购买整车满3000元立减200元',
    discountType: 'amount',
    discountValue: 200,
    minPurchase: 3000,
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    imageUrl: '/images/coupons/coupon-bg-3.jpg'
  },
  {
    id: 'coupon-4',
    code: 'MTB10',
    name: '山地车配件券',
    description: '购买山地车配件满300元享9折优惠',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 300,
    startDate: '2024-03-15',
    endDate: '2024-07-15',
    isUsed: true,
    imageUrl: '/images/coupons/coupon-bg-4.jpg'
  }
];

// 产品数据
export const products: Product[] = [
  {
    id: 'giant-atx-mountain',
    name: 'Giant ATX 山地车',
    price: 3999,
    originalPrice: 4599,
    description: 'Giant ATX 是一款入门级山地自行车，适合初学者和休闲骑行者。它采用铝合金车架，提供良好的耐用性和轻量化设计，配备21速变速系统，应对各种地形。前叉减震系统能有效吸收震动，提供更舒适的骑行体验。',
    features: [
      '铝合金车架，轻量耐用',
      '前叉减震系统，提供舒适骑行',
      'Shimano 21速变速系统',
      '液压碟刹，提供可靠制动力',
      '27.5英寸轮组，适合各种地形'
    ],
    images: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW4lMjBiaWtlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1581775106440-bdd04289a05f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bW91bnRhaW4lMjBiaWtlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
    ],
    category: 'mountain',
    brand: 'giant',
    stock: 15,
    rating: 4.5,
    reviews: 23,
    isNew: false,
    isFeatured: true,
    discount: 13
  },
  {
    id: 'trek-marlin-5',
    name: 'Trek Marlin 5 山地车',
    price: 4299,
    originalPrice: 4699,
    description: 'Trek Marlin 5 是一款多用途山地自行车，适合越野骑行和日常通勤。它采用耐用的铝合金车架和可靠的组件，前叉减震让骑行更加顺畅。易于操控的几何形状让这款车成为初学者的理想选择。',
    features: [
      'Alpha Silver 铝合金车架',
      'SR Suntour XCE 前叉减震',
      'Shimano Altus M315 8速变速系统',
      '机械碟刹，提供全天候制动性能',
      '29英寸轮组（较大尺寸）或27.5英寸轮组（较小尺寸）'
    ],
    images: [
      'https://images.unsplash.com/photo-1575585269294-7d28dd912db8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWluJTIwYmlrZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fG1vdW50YWluJTIwYmlrZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
    ],
    category: 'mountain',
    brand: 'trek',
    stock: 8,
    rating: 4.3,
    reviews: 18,
    isNew: false,
    isFeatured: false,
    discount: 9
  },
  {
    id: 'specialized-allez',
    name: 'Specialized Allez 公路车',
    price: 6599,
    description: 'Specialized Allez 是一款入门级公路自行车，专为速度和耐力而设计。E5铝合金车架轻量且坚固，碳纤维前叉提供出色的响应性和减震效果。Shimano Claris R2000变速系统提供平顺的换挡体验。',
    features: [
      'E5 Premium 铝合金车架',
      'FACT碳纤维前叉，轻量且减震',
      'Shimano Claris R2000 8速变速系统',
      'Tektro 刹车系统',
      'Espoir Sport 700x25mm轮胎'
    ],
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cm9hZCUyMGJpa2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cm9hZCUyMGJpa2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
    ],
    category: 'road',
    brand: 'specialized',
    stock: 5,
    rating: 4.7,
    reviews: 31,
    isNew: true,
    isFeatured: true
  },
  {
    id: 'merida-scultura',
    name: 'Merida Scultura 公路车',
    price: 7899,
    originalPrice: 8599,
    description: 'Merida Scultura 是一款高性能公路自行车，采用轻量级铝合金车架和碳纤维前叉，在保持舒适性的同时提供卓越的性能。Shimano 105变速系统提供精准的变速体验，适合长距离骑行和竞赛。',
    features: [
      'Scultura Lite 铝合金车架',
      'Scultura Carbon 前叉',
      'Shimano 105 R7000 11速变速系统',
      'Shimano 105 液压碟刹',
      'Fulcrum Racing 700 轮组'
    ],
    images: [
      'https://images.unsplash.com/photo-1583468992113-33c69948be55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cm9hZCUyMGJpa2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1569943228307-a66beab7cd96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cm9hZCUyMGJpa2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
    ],
    category: 'road',
    brand: 'merida',
    stock: 3,
    rating: 4.8,
    reviews: 15,
    isNew: false,
    isFeatured: true,
    discount: 8
  },
  {
    id: 'cannondale-quick',
    name: 'Cannondale Quick 城市休闲车',
    price: 5299,
    description: 'Cannondale Quick 是一款多功能城市自行车，结合了公路车的速度和山地车的稳定性。SmartForm C3铝合金车架轻便且响应灵敏，直把设计提供舒适的骑行姿势，适合通勤和休闲骑行。',
    features: [
      'SmartForm C3 铝合金车架',
      '碳纤维前叉，减轻重量并吸收震动',
      'Shimano Altus/Acera 9速变速系统',
      'Tektro 液压碟刹',
      '700c轮组配备反光条轮胎'
    ],
    images: [
      'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Y2l0eSUyMGJpa2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1538895194639-f50bcf0a3c69?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGNpdHklMjBiaWtlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
    ],
    category: 'city',
    brand: 'cannondale',
    stock: 12,
    rating: 4.6,
    reviews: 27,
    isNew: false,
    isFeatured: false
  },
  {
    id: 'brompton-m6l',
    name: 'Brompton M6L 折叠自行车',
    price: 13999,
    description: 'Brompton M6L 是一款高品质折叠自行车，专为城市通勤者设计。它可以快速折叠成小巧的形状，方便携带和存储。6速变速系统应对各种城市地形，M型把手提供经典舒适的骑行姿势。',
    features: [
      '钢制车架，耐用且提供舒适的骑行感',
      'M型把手，经典舒适的骑行姿势',
      'Sturmey Archer 6速内变速系统',
      '前后V型刹车',
      '轻松折叠设计，适合城市通勤'
    ],
    images: [
      'https://images.unsplash.com/photo-1599408341378-7c27d782d9b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Zm9sZGluZyUyMGJpa2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1598983062026-f57dba8d6be7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGZvbGRpbmclMjBiaWtlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
    ],
    category: 'city',
    brand: 'brompton',
    stock: 2,
    rating: 4.9,
    reviews: 42,
    isNew: true,
    isFeatured: true
  },
  {
    id: 'giant-arx',
    name: 'Giant ARX 儿童自行车',
    price: 2599,
    description: 'Giant ARX 是一款为年轻骑手设计的轻量级儿童自行车。ALUXX铝合金车架轻便且耐用，简单的单速设计易于操控和维护，适合儿童在各种环境中骑行，培养骑行的乐趣。',
    features: [
      'ALUXX 铝合金车架，轻量耐用',
      '单速设计，简单易用',
      '可靠的V型刹车系统',
      '适合身高110-140cm的儿童',
      '提供多种鲜艳颜色选择'
    ],
    images: [
      'https://images.unsplash.com/photo-1595953453715-87b2d7f715d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8a2lkcyUyMGJpa2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1599686567821-1795b5aab0a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8a2lkcyUyMGJpa2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
    ],
    category: 'kids',
    brand: 'giant',
    stock: 10,
    rating: 4.4,
    reviews: 15,
    isNew: false,
    isFeatured: false
  },
  {
    id: 'giro-syntax-mips',
    name: 'Giro Syntax MIPS 头盔',
    price: 899,
    originalPrice: 999,
    description: 'Giro Syntax MIPS 是一款高性能自行车头盔，结合了优雅的造型、出色的通风性能和先进的安全技术。MIPS技术（多方向冲击保护系统）可以减少旋转力对大脑的影响，提供更全面的保护。',
    features: [
      'MIPS技术，提供额外的旋转冲击保护',
      '25个通风口，提供卓越的散热性能',
      'Roc Loc 5 Air适配系统，提供舒适贴合的佩戴体验',
      '轻量polycarbonate外壳与EPS内衬',
      '可拆卸遮阳帽檐'
    ],
    images: [
      'https://images.unsplash.com/photo-1583729250536-d5d2e33de85e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YmlrZSUyMGhlbG1ldHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1602743486222-4e19b96d0cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGJpa2UlMjBoZWxtZXR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
    ],
    category: 'accessories',
    brand: 'specialized', // 使用已有品牌，实际上Giro是独立品牌
    stock: 25,
    rating: 4.7,
    reviews: 32,
    isNew: false,
    isFeatured: true,
    discount: 10
  },
  {
    id: 'continental-grand-prix',
    name: 'Continental GP5000 公路车轮胎',
    price: 499,
    description: 'Continental Grand Prix 5000是一款高性能公路车轮胎，采用BlackChili化合物和Active Comfort技术，在保持低滚动阻力的同时提供优异的抓地力和舒适性。是竞速和长距离骑行的理想选择。',
    features: [
      'BlackChili化合物，提供较低的滚动阻力和优异的抓地力',
      'Active Comfort技术，减少震动提高舒适性',
      'LazerGrip技术，提升弯道抓地力',
      '专利Vectran防刺穿技术',
      '25mm宽度，适合现代公路车架'
    ],
    images: [
      'https://images.unsplash.com/photo-1558189574-1daba265e305?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8YmlrZSUyMHRpcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1626428075520-be6c3e99c753?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YmlrZSUyMHRpcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
    ],
    category: 'parts',
    brand: 'trek', // 使用已有品牌，实际上Continental是独立品牌
    stock: 40,
    rating: 4.8,
    reviews: 56,
    isNew: true,
    isFeatured: false
  },
  {
    id: 'shimano-spd-pedals',
    name: 'Shimano SPD-SL 公路车脚踏',
    price: 699,
    originalPrice: 799,
    description: 'Shimano SPD-SL脚踏是专业公路车骑行的理想选择，提供宽大的踏板平台和稳定的脚部支撑。采用轻量级复合材料，可靠的机械结构，以及可调节的脚部释放张力，适合竞赛和长途骑行。',
    features: [
      '宽大的踏板平台，提供稳定的力量传递',
      '可调节释放张力，适合不同骑行风格',
      '包含6度浮动的SM-SH11黄色防滑垫片',
      '重量约为285克/对',
      '兼容所有标准的公路车骑行鞋'
    ],
    images: [
      'https://images.unsplash.com/photo-1625311161866-c6cc4190c363?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGJpa2UlMjBwZWRhbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1629224834618-3fdf6b73124a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YmlrZSUyMHBlZGFsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
    ],
    category: 'parts',
    brand: 'specialized', // 使用已有品牌，实际上Shimano是独立品牌
    stock: 15,
    rating: 4.6,
    reviews: 28,
    isNew: false,
    isFeatured: false,
    discount: 13
  }
]; 