# 牧马单车网站 - 后端实现文档

本文档详细说明了牧马单车网站的后端和数据库实现，基于技术设计文档中的需求。

## 技术栈

- **数据库**: MySQL (通过 Prisma ORM 访问)
- **后端框架**: Next.js API Routes (用于创建 RESTful API)
- **ORM**: Prisma (用于数据库操作)
- **认证**: 基于 Cookie 的会话管理

## 数据库设计

我们使用了 Prisma 来定义和管理数据库模型。主要模型包括：

### 核心模型

1. **User** (用户): 存储用户信息，包括用户名、邮箱、密码哈希等。
2. **Product** (商品): 包含商品详情、价格、库存等信息。
3. **Category** (分类): 商品分类信息。
4. **Brand** (品牌): 商品品牌信息。
5. **CartItem** (购物车项): 用户购物车中的商品。
6. **Wishlist** (收藏): 用户收藏的商品。
7. **Order** (订单): 用户提交的订单信息。
8. **OrderItem** (订单项): 订单中包含的商品明细。
9. **Payment** (支付): 订单支付记录。
10. **Shipment** (物流): 订单物流记录。

### 增值服务模型

11. **Appointment** (预约): 维修和Bike Fitting预约服务。
12. **PointHistory** (积分历史): 用户积分变动记录。
13. **Coupon** (优惠券): 优惠券信息。
14. **UserCoupon** (用户优惠券): 用户领取的优惠券记录。
15. **Event** (活动): 车店组织的活动信息。
16. **EventRegistration** (活动报名): 用户活动报名记录。

## API 实现

我们实现了遵循 RESTful 设计的 API 接口，主要包括以下功能：

### 商品管理

- `GET /api/products`: 获取商品列表，支持分页、筛选和搜索
- `GET /api/products/:id`: 获取单个商品详情
- `POST /api/products`: 创建新商品
- `PUT /api/products/:id`: 更新商品信息
- `DELETE /api/products/:id`: 删除商品
- `PATCH /api/products/:id/toggle-featured`: 切换商品特色状态

### 分类管理

- `GET /api/categories`: 获取分类列表
- `GET /api/categories/:id`: 获取单个分类及其商品
- `POST /api/categories`: 创建新分类
- `PUT /api/categories/:id`: 更新分类信息
- `DELETE /api/categories/:id`: 删除分类
- `PATCH /api/categories/:id/toggle-homepage`: 切换分类首页显示状态

### 用户认证

- `POST /api/auth/register`: 用户注册
- `POST /api/auth/login`: 用户登录
- `POST /api/auth/logout`: 用户登出

### 购物车

- `GET /api/cart`: 获取用户购物车
- `POST /api/cart`: 添加商品到购物车
- `PUT /api/cart/:id`: 更新购物车商品数量
- `DELETE /api/cart/:id`: 从购物车删除商品

## 权限管理

我们通过 `auth-utils.ts` 实现了基本的权限管理：

1. **身份验证**: 基于 cookie 和请求头中的 token 验证用户身份
2. **授权检查**: 验证用户是否有权限执行特定操作
3. **管理员权限**: 特殊检查用户是否拥有管理员权限

## 数据处理

对于复杂数据类型，我们采用了以下策略：

1. **数组和对象**: 在数据库中以 JSON 字符串存储，在 API 层进行序列化和反序列化
2. **图片 URL**: 以 JSON 数组形式存储多个图片 URL
3. **敏感数据**: 密码使用 SHA-256 哈希存储，确保安全性

## 购物流程实现

用户购物流程包括以下步骤：

1. 浏览商品 → 添加到购物车 → 结算 → 提交订单 → 支付 → 完成

每个步骤都有相应的 API 支持，确保整个流程的顺畅性和数据一致性。

## 数据关系

通过 Prisma 的关系定义，我们实现了以下主要数据关系：

- 一个用户可以有多个购物车项、收藏、订单和预约
- 一个商品属于一个分类和一个品牌
- 一个订单包含多个订单项
- 一个用户可以领取多个优惠券
- 一个用户可以报名参加多个活动

这些关系确保了数据的一致性和完整性，便于业务逻辑的实现。

## 自动化测试

可以使用 Jest 编写单元测试和集成测试，覆盖关键的 API 功能和业务逻辑。测试用例应包括正常路径和错误路径，确保系统在各种情况下的稳定性。

## 部署说明

1. **环境变量**: 需要设置 `DATABASE_URL` 环境变量指向 MySQL 数据库
2. **数据库迁移**: 使用 `npx prisma db push` 或 `npx prisma migrate dev` 创建数据库结构
3. **初始数据**: 可以使用 Prisma 的 seed 功能填充初始数据

## 后续优化

1. **性能优化**: 针对高频查询添加索引，使用缓存减轻数据库负担
2. **安全增强**: 实现更完善的 JWT 验证，CSRF 保护等
3. **第三方集成**: 完成支付宝和微信支付的完整集成
4. **监控与日志**: 添加详细的日志和性能监控 