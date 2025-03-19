const { PrismaClient } = require('@prisma/client');
const { createHash } = require('crypto');

const prisma = new PrismaClient();

async function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Start seeding...');
  
  // 清理现有数据
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();
  
  // 创建管理员用户
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@mumabike.com',
      phone: '13800138000',
      passwordHash: await hashPassword('admin123'),
      isStaff: true,
    },
  });
  
  console.log(`Created admin user: ${adminUser.id}`);
  
  // 创建测试用户
  const testUser = await prisma.user.create({
    data: {
      username: 'user',
      email: 'user@example.com',
      phone: '13900139000',
      passwordHash: await hashPassword('user123'),
      isStaff: false,
    },
  });
  
  console.log(`Created test user: ${testUser.id}`);
  
  // 创建品牌
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: 'Giant 捷安特',
        logo: 'https://placehold.co/200x100?text=Giant',
        description: '捷安特（Giant）是全球领先的自行车品牌，以其卓越的工艺和创新设计而闻名，提供从入门级到专业级的各类自行车产品。',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Trek 崔克',
        logo: 'https://placehold.co/200x100?text=Trek',
        description: '崔克（Trek）是美国知名自行车品牌，专注于高性能山地车和公路车，以先进的技术和精湛的制造工艺著称。',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Specialized 闪电',
        logo: 'https://placehold.co/200x100?text=Specialized',
        description: '闪电（Specialized）是一家美国高端自行车品牌，以其创新设计和顶级性能闻名，广受专业车手和骑行爱好者的青睐。',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Cannondale 佳能戴尔',
        logo: 'https://placehold.co/200x100?text=Cannondale',
        description: '佳能戴尔（Cannondale）是美国著名自行车品牌，以其创新的铝合金和碳纤维车架设计而闻名，产品线涵盖公路车、山地车和城市车。',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Shimano 禧玛诺',
        logo: 'https://placehold.co/200x100?text=Shimano',
        description: '禧玛诺（Shimano）是全球领先的自行车零部件制造商，以其可靠的变速系统、刹车和其他高质量配件而闻名。',
      },
    }),
  ]);
  
  console.log(`Created ${brands.length} brands`);
  
  // 创建分类
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: '山地车',
        description: '山地车设计用于野外地形骑行，通常配备宽轮胎、悬挂系统和较低的齿比，适合在崎岖路面和山地环境中使用。',
        showOnHomepage: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '公路车',
        description: '公路车专为铺装道路设计，具有轻量化车架、窄轮胎和弯把，追求速度和效率，适合长距离骑行和竞速。',
        showOnHomepage: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '城市车',
        description: '城市车专为日常通勤设计，注重舒适性和实用性，通常配备挡泥板、车灯和行李架，适合都市环境使用。',
        showOnHomepage: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '儿童车',
        description: '儿童自行车专为年幼骑手设计，安全性是首要考虑因素，有各种尺寸以适应不同年龄段的孩子。',
        showOnHomepage: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '电动自行车',
        description: '电动自行车配备电机辅助系统，减轻骑行负担，延长骑行距离，适合通勤和休闲。',
        showOnHomepage: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '折叠车',
        description: '折叠自行车设计紧凑，可轻松折叠便于存储和携带，适合混合交通通勤和有限空间存放。',
        showOnHomepage: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '零部件',
        description: '自行车零部件包括制动系统、传动系统、车轮等各类可替换和升级的部件。',
        showOnHomepage: false,
      },
    }),
    prisma.category.create({
      data: {
        name: '骑行服饰',
        description: '专业骑行服饰设计用于提高骑行舒适度和性能，包括骑行服、头盔、手套等装备。',
        showOnHomepage: false,
      },
    }),
    prisma.category.create({
      data: {
        name: '骑行配件',
        description: '骑行配件涵盖码表、水壶架、灯具等增强骑行体验和安全性的各类装备。',
        showOnHomepage: false,
      },
    }),
  ]);
  
  console.log(`Created ${categories.length} categories`);
  
  // 为每个品牌和分类组合创建产品
  const categoryMap = {
    '山地车': categories[0],
    '公路车': categories[1],
    '城市车': categories[2],
    '儿童车': categories[3],
    '电动自行车': categories[4],
    '折叠车': categories[5],
    '零部件': categories[6],
    '骑行服饰': categories[7],
    '骑行配件': categories[8],
  };
  
  const brandMap = {
    'Giant 捷安特': brands[0],
    'Trek 崔克': brands[1],
    'Specialized 闪电': brands[2],
    'Cannondale 佳能戴尔': brands[3],
    'Shimano 禧玛诺': brands[4],
  };
  
  // 创建山地车产品
  const mountainBikes = [
    {
      name: 'Giant Talon 29 山地车',
      description: '入门级越野山地自行车，29寸车轮提供出色的通过性和稳定性，铝合金车架轻量耐用。前叉提供100mm行程，应对各种地形。配备Shimano变速系统，骑行流畅。',
      price: 4999,
      originalPrice: 5299,
      stock: 15,
      categoryId: categoryMap['山地车'].id,
      brandId: brandMap['Giant 捷安特'].id,
      images: JSON.stringify(['https://placehold.co/600x400?text=Giant+Talon+1', 'https://placehold.co/600x400?text=Giant+Talon+2']),
      features: JSON.stringify(['铝合金车架', '29寸车轮', 'Shimano变速系统', '液压碟刹']),
      isNew: true,
      isFeatured: true,
      discount: 5,
    },
    {
      name: 'Trek Marlin 7 山地车',
      description: '中端越野山地自行车，适合技术型骑行，轻量化铝合金车架，RockShox前叉提供120mm行程。搭载Shimano Deore变速系统，获得精准换挡体验。',
      price: 6299,
      originalPrice: 6799,
      stock: 8,
      categoryId: categoryMap['山地车'].id,
      brandId: brandMap['Trek 崔克'].id,
      images: JSON.stringify(['https://placehold.co/600x400?text=Trek+Marlin+1', 'https://placehold.co/600x400?text=Trek+Marlin+2']),
      features: JSON.stringify(['轻量化铝合金车架', 'RockShox前叉', 'Shimano Deore变速', '液压碟刹']),
      isNew: false,
      isFeatured: true,
      discount: 7,
    },
  ];
  
  // 创建公路车产品
  const roadBikes = [
    {
      name: 'Specialized Allez Elite 公路车',
      description: '高性能公路自行车，采用E5铝合金车架和全碳前叉，兼顾重量和刚性。Shimano 105 R7000变速系统，11速变速，带来专业骑行体验。适合长途骑行和竞速。',
      price: 9999,
      originalPrice: 10799,
      stock: 5,
      categoryId: categoryMap['公路车'].id,
      brandId: brandMap['Specialized 闪电'].id,
      images: JSON.stringify(['https://placehold.co/600x400?text=Specialized+Allez+1', 'https://placehold.co/600x400?text=Specialized+Allez+2']),
      features: JSON.stringify(['E5铝合金车架', '全碳前叉', 'Shimano 105 R7000 11速变速', 'DT Swiss轮组']),
      isNew: true,
      isFeatured: true,
      discount: 7,
    },
    {
      name: 'Cannondale CAAD13 Disc 105 公路车',
      description: '专业级铝合金公路车，CAAD13车架设计实现最佳的骑行姿态和效率。全碳前叉减震出色，Shimano 105液压碟刹提供全天候制动可靠性。',
      price: 12999,
      originalPrice: 13999,
      stock: 3,
      categoryId: categoryMap['公路车'].id,
      brandId: brandMap['Cannondale 佳能戴尔'].id,
      images: JSON.stringify(['https://placehold.co/600x400?text=Cannondale+CAAD13+1', 'https://placehold.co/600x400?text=Cannondale+CAAD13+2']),
      features: JSON.stringify(['SmartForm C1高级铝合金车架', '全碳前叉', 'Shimano 105液压碟刹', 'Fulcrum Racing轮组']),
      isNew: false,
      isFeatured: true,
      discount: 7,
    },
  ];
  
  // 创建城市车产品
  const cityBikes = [
    {
      name: 'Giant Escape 3 城市通勤车',
      description: '专为城市通勤设计的多功能自行车，ALUXX铝合金车架轻巧耐用。直把设计带来舒适骑行姿态，线控碟刹提供可靠制动力。7速变速满足日常通勤需求。',
      price: 2999,
      originalPrice: 3299,
      stock: 20,
      categoryId: categoryMap['城市车'].id,
      brandId: brandMap['Giant 捷安特'].id,
      images: JSON.stringify(['https://placehold.co/600x400?text=Giant+Escape+1', 'https://placehold.co/600x400?text=Giant+Escape+2']),
      features: JSON.stringify(['ALUXX铝合金车架', '线控碟刹', '7速变速', '舒适骑行姿态']),
      isNew: false,
      isFeatured: true,
      discount: 9,
    },
  ];
  
  // 创建儿童车产品
  const kidsBikes = [
    {
      name: 'Trek Precaliber 20 儿童车',
      description: '专为6-8岁儿童设计的高品质自行车，铝合金车架轻便耐用。配备安全护链罩和防滑轮胎，7速变速系统让孩子轻松掌握骑行技巧。多种缤纷色彩可选。',
      price: 1999,
      originalPrice: 2199,
      stock: 12,
      categoryId: categoryMap['儿童车'].id,
      brandId: brandMap['Trek 崔克'].id,
      images: JSON.stringify(['https://placehold.co/600x400?text=Trek+Precaliber+1', 'https://placehold.co/600x400?text=Trek+Precaliber+2']),
      features: JSON.stringify(['铝合金车架', '安全护链罩', '7速变速', '侧支撑轮选配']),
      isNew: true,
      isFeatured: false,
      discount: 9,
    },
  ];
  
  // 创建所有产品
  const products = [
    ...mountainBikes,
    ...roadBikes,
    ...cityBikes,
    ...kidsBikes,
  ];
  
  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    });
    console.log(`Created product: ${product.name}`);
  }
  
  console.log(`Created ${products.length} products`);
  console.log('Seeding finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 