# 牧马单车网站

牧马单车是一个专业的自行车商店网站，提供高品质自行车和配件销售，以及专业的维修和调校服务。

## 项目技术栈

- **前端框架**：Next.js (React)
- **样式**：Tailwind CSS
- **语言**：TypeScript

## 主要功能

- 商品展示与购物车
- 预约维修服务
- Bike Fitting个性化服务
- 会员系统（积分和优惠券）
- 支付系统（支付宝和微信支付）
- 物流追踪

## 运行项目

1. 确保已安装Node.js（推荐v18或更高版本）
2. 克隆项目
3. 安装依赖

```bash
npm install
```

4. 运行开发服务器

```bash
npm run dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

- `/src/app` - Next.js App Router页面和路由
- `/src/components` - 可复用组件
- `/src/lib` - 工具函数和API调用
- `/src/styles` - 全局样式

## 部署

项目可以部署在Vercel、AWS、GCP等平台上。 