# 沐马自行车管理系统开发与部署指南

## 项目概述

沐马自行车管理系统是一个全栈应用，为自行车店提供销售、库存、维修和会员管理功能。本文档详细介绍了如何设置开发环境、进行测试和部署系统。

## 技术栈

- **前端**: Next.js 14, React, TailwindCSS
- **后端**: Next.js API Routes
- **数据库**: MySQL
- **ORM**: Prisma
- **认证**: 基于JWT的认证系统
- **语言**: TypeScript

## 开发环境设置

### 前提条件

- Node.js v16.14.0+
- npm v8.3.0+
- MySQL v8.0+
- Git

### 初始设置

1. **克隆仓库**

```bash
git clone https://github.com/your-organization/muma-bike.git
cd muma-bike
```

2. **安装依赖**

```bash
npm install
```

3. **环境变量配置**

复制`.env.example`文件并创建`.env.local`文件:

```bash
cp .env.example .env.local
```

编辑`.env.local`并填入必要的配置信息:

```
# 数据库连接
DATABASE_URL="mysql://username:password@localhost:3306/muma_bike"

# 认证
JWT_SECRET="your-secret-key"
```

4. **设置数据库**

创建MySQL数据库:

```sql
CREATE DATABASE muma_bike CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

初始化Prisma:

```bash
npx prisma migrate dev --name init
```

加载测试数据:

```bash
npx prisma db seed
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 上运行。

### Prisma Studio (数据库管理工具)

启动Prisma Studio以可视化管理数据库:

```bash
npx prisma studio
```

Prisma Studio将在 http://localhost:5555 上运行。

## 开发工作流程

### 分支策略

- `main`: 生产就绪代码
- `develop`: 开发分支，包含下一版本的功能
- `feature/*`: 新功能开发
- `bugfix/*`: 错误修复
- `release/*`: 发布准备分支

### 开发新功能

```bash
git checkout develop
git pull
git checkout -b feature/your-feature-name
# 开发你的功能
git add .
git commit -m "feat: 添加X功能"
git push origin feature/your-feature-name
# 创建Pull Request到develop分支
```

### 代码规范

项目使用ESLint和Prettier进行代码格式化:

```bash
# 运行检查
npm run lint

# 修复格式问题
npm run format
```

## 测试

### 单元测试

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- -t "test name"

# 监视模式
npm test -- --watch
```

### 端到端测试

```bash
# 运行端到端测试
npm run test:e2e
```

## 构建与部署

### 本地构建

```bash
npm run build
```

构建的文件将在`.next`目录中。

### 测试生产版本

```bash
# 先构建项目
npm run build

# 运行生产服务器
npm start
```

### 部署环境

#### 测试环境

项目测试环境使用以下配置:

- **服务器**: AWS EC2 t3.medium
- **数据库**: RDS MySQL 8.0
- **部署方式**: GitHub Actions自动部署

1. 当代码合并到`develop`分支时，自动触发部署
2. 测试环境URL: https://test.mumabike.com

#### 生产环境

生产环境使用以下配置:

- **服务器**: AWS EC2 m5.large
- **数据库**: RDS MySQL 8.0 (高可用配置)
- **CDN**: Cloudfront
- **部署方式**: GitHub Actions自动部署

1. 当代码合并到`main`分支时，自动触发部署
2. 生产环境URL: https://www.mumabike.com

### 手动部署

如需手动部署:

```bash
# 登录到服务器
ssh user@your-server

# 拉取最新代码
cd /path/to/app
git pull

# 安装依赖
npm install --production

# 迁移数据库
npx prisma migrate deploy

# 构建应用
npm run build

# 重启服务
pm2 restart muma-bike
```

## 环境特有配置

### 生产环境配置

生产环境需要以下附加配置:

```
NODE_ENV=production
DATABASE_URL="mysql://prod_user:password@prod-db.example.com:3306/muma_bike_prod"
NEXT_PUBLIC_API_URL="https://api.mumabike.com"
```

### 测试环境配置

测试环境需要以下配置:

```
NODE_ENV=test
DATABASE_URL="mysql://test_user:password@test-db.example.com:3306/muma_bike_test"
NEXT_PUBLIC_API_URL="https://api-test.mumabike.com"
```

## 常见问题与解决方案

### 端口冲突

如果3000端口被占用，可以使用以下命令指定其他端口:

```bash
npm run dev -- -p 3001
```

### 数据库连接问题

如果遇到数据库连接问题:

1. 确保MySQL服务正在运行
2. 检查`.env.local`中的DATABASE_URL是否正确
3. 确认用户具有正确的数据库权限

```bash
# 检查数据库连接
npx prisma db pull
```

### API错误调试

使用开发工具中的Network选项卡可以查看API请求和响应详情。所有API端点位于`src/app/api`目录下。

## 常用开发命令

```bash
# 开发服务器
npm run dev

# 构建
npm run build

# 启动生产服务
npm start

# 运行测试
npm test

# 数据库迁移
npx prisma migrate dev

# Prisma Studio
npx prisma studio

# 代码检查
npm run lint

# 格式化代码
npm run format
```

## 项目结构

```
muma-bike/
├── public/                 # 静态资源
├── prisma/                 # Prisma配置和迁移
│   ├── migrations/         # 数据库迁移文件
│   ├── schema.prisma       # 数据库模型定义
│   └── seed.ts             # 种子数据
├── src/
│   ├── app/                # Next.js 应用目录
│   │   ├── api/            # API路由
│   │   ├── admin/          # 管理后台页面
│   │   ├── services/       # 前台服务页面
│   │   └── ...
│   ├── components/         # React组件
│   ├── lib/                # 实用函数和库
│   │   ├── auth/           # 认证相关
│   │   ├── prisma.ts       # Prisma客户端
│   │   └── ...
│   └── styles/             # 样式文件
├── .env.example            # 环境变量示例
├── .gitignore              # Git忽略文件
├── package.json            # 依赖和脚本
└── tsconfig.json           # TypeScript配置
```

## 联系与支持
