# 沐马自行车管理系统

![沐马自行车管理系统](public/logo.png)

沐马自行车是一个专业的自行车店管理系统，提供销售、库存、维修和会员管理等功能。

## 🚀 快速开始

### 环境要求

- Node.js v16.14.0+
- npm v8.3.0+
- MySQL v8.0+

### 安装与运行

```bash
# 安装依赖
npm install

# 初始化数据库
npx prisma migrate dev

# 加载测试数据
npx prisma db seed

# 启动开发服务器
npm run dev
```

应用将在 http://localhost:3000 上运行。

## 🔑 用户账号

| 角色 | 用户名 | 密码 | 说明 |
|------|--------|------|------|
| 管理员 | admin@mumabike.com | admin123 | 拥有全部权限 |
| 店长 | manager@mumabike.com | manager123 | 拥有大部分管理权限 |
| 技师 | tech1@mumabike.com | tech123 | 负责维修管理 |
| 销售 | sales1@mumabike.com | sales123 | 负责销售和库存 |
| 前台 | receptionist@mumabike.com | front123 | 负责接待和基础功能 |

## 📚 功能模块

- **销售管理**: 订单处理、库存查询、促销活动
- **库存管理**: 商品管理、库存跟踪、进货管理
- **维修管理**: 维修单处理、配件管理、技师排班
- **会员管理**: 会员信息、积分系统、会员优惠
- **数据报表**: 销售统计、绩效分析、库存报警

## 📖 文档

详细的开发和部署文档请参考 [DEVELOPMENT.md](DEVELOPMENT.md)。

## 🛠️ 技术栈

- **前端**: Next.js 14, React, TailwindCSS
- **后端**: Next.js API Routes
- **数据库**: MySQL
- **ORM**: Prisma
- **认证**: 基于JWT的认证系统
- **语言**: TypeScript

## 📱 系统截图

![管理后台](public/screenshots/dashboard.png)

![维修管理](public/screenshots/repair.png)

![会员管理](public/screenshots/customer.png)

## 🤝 贡献指南

欢迎贡献代码或提出问题！请参考[贡献指南](CONTRIBUTING.md)。

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE)。 