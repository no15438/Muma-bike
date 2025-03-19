'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/lib/auth/UserContext'
import { useOrders } from '@/lib/orders/OrderContext'
import { useCoupons } from '@/lib/coupons/CouponContext'

// 模拟用户数据库（来自 UserContext.tsx）
const mockUsers = [
  {
    id: 'user1',
    name: '张三',
    email: 'zhangsan@example.com',
    password: 'password123',
    phone: '13800138000'
  },
  {
    id: 'user2',
    name: '李四',
    email: 'lisi@example.com',
    password: 'password123',
    phone: '13900139000'
  }
]

export default function TestToolPage() {
  const { user, login, logout, isAuthenticated } = useUser()
  const { orders, getUserOrders, updateOrderStatus } = useOrders()
  const { coupons, getAvailableCoupons, addCoupon } = useCoupons()
  
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [selectedTab, setSelectedTab] = useState<'users' | 'orders' | 'coupons' | 'local-storage'>('users')
  const [storageKeys, setStorageKeys] = useState<string[]>([])
  const [storageContent, setStorageContent] = useState<Record<string, any>>({})
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })
  const [newCouponCode, setNewCouponCode] = useState('')
  
  // 加载 localStorage 内容
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage)
      setStorageKeys(keys)
      
      const content: Record<string, any> = {}
      keys.forEach(key => {
        try {
          content[key] = JSON.parse(localStorage.getItem(key) || '')
        } catch {
          content[key] = localStorage.getItem(key)
        }
      })
      setStorageContent(content)
    }
  }, [selectedTab])
  
  // 快速登录
  const handleQuickLogin = (email: string, password: string) => {
    login(email, password)
  }
  
  // 清除指定的 localStorage 项
  const clearStorageItem = (key: string) => {
    localStorage.removeItem(key)
    setStorageKeys(keys => keys.filter(k => k !== key))
    const newContent = { ...storageContent }
    delete newContent[key]
    setStorageContent(newContent)
  }
  
  // 清除所有 localStorage 
  const clearAllStorage = () => {
    localStorage.clear()
    setStorageKeys([])
    setStorageContent({})
  }
  
  // 添加测试用户
  const handleAddUser = () => {
    if (!addUserForm.name || !addUserForm.email || !addUserForm.password) {
      alert('请填写必要的用户信息')
      return
    }
    
    // 这里模拟添加用户，实际项目中可能需要调用API
    const newUser = {
      id: `user${Date.now()}`,
      name: addUserForm.name,
      email: addUserForm.email,
      password: addUserForm.password,
      phone: addUserForm.phone
    }
    
    alert(`已添加测试用户：${newUser.name} (${newUser.email})`)
    
    // 重置表单
    setAddUserForm({
      name: '',
      email: '',
      password: '',
      phone: ''
    })
  }
  
  // 渲染用户选项卡
  const renderUsersTab = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">用户管理</h2>
        
        {/* 当前登录用户信息 */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2">当前登录用户</h3>
          {isAuthenticated ? (
            <div>
              <p><span className="font-medium">用户名：</span> {user?.name}</p>
              <p><span className="font-medium">邮箱：</span> {user?.email}</p>
              <p><span className="font-medium">ID：</span> {user?.id}</p>
              <button 
                onClick={() => logout()}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                退出登录
              </button>
            </div>
          ) : (
            <p className="text-gray-600">未登录</p>
          )}
        </div>
        
        {/* 快速登录 */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">快速登录</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockUsers.map(mockUser => (
              <div key={mockUser.id} className="border p-3 rounded">
                <p><span className="font-medium">用户名：</span> {mockUser.name}</p>
                <p><span className="font-medium">邮箱：</span> {mockUser.email}</p>
                <p><span className="font-medium">密码：</span> {mockUser.password}</p>
                <button 
                  onClick={() => handleQuickLogin(mockUser.email, mockUser.password)}
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  登录此用户
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* 添加测试用户 */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">添加测试用户</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">用户名</label>
              <input 
                type="text" 
                value={addUserForm.name}
                onChange={e => setAddUserForm({...addUserForm, name: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="用户名"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">邮箱</label>
              <input 
                type="email" 
                value={addUserForm.email}
                onChange={e => setAddUserForm({...addUserForm, email: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">密码</label>
              <input 
                type="text" 
                value={addUserForm.password}
                onChange={e => setAddUserForm({...addUserForm, password: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="密码"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">手机号</label>
              <input 
                type="text" 
                value={addUserForm.phone}
                onChange={e => setAddUserForm({...addUserForm, phone: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="手机号"
              />
            </div>
            <button 
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              添加用户
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // 渲染订单选项卡
  const renderOrdersTab = () => {
    // 获取用户的订单
    const userOrders = isAuthenticated ? getUserOrders() : []
    const allOrders = orders
    
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">订单管理</h2>
        
        {/* 当前用户订单 */}
        {isAuthenticated && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">当前用户的订单 ({userOrders.length})</h3>
            {userOrders.length > 0 ? (
              <div className="space-y-4">
                {userOrders.map(order => (
                  <div key={order.id} className="border rounded p-3">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">订单号: {order.id}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'pending' ? '待支付' :
                         order.status === 'paid' ? '已支付' :
                         order.status === 'shipped' ? '已发货' :
                         order.status === 'delivered' ? '已送达' :
                         order.status === 'completed' ? '已完成' : '已取消'}
                      </span>
                    </div>
                    <p><span className="text-gray-600">总金额:</span> ¥{order.totalAmount.toFixed(2)}</p>
                    <p><span className="text-gray-600">下单时间:</span> {new Date(order.createdAt).toLocaleString()}</p>
                    
                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-1">商品项 ({order.items.length})</h4>
                      <ul className="text-sm">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.name} x {item.quantity} (¥{item.price.toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'paid')}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                        disabled={order.status !== 'pending'}
                      >
                        标记为已支付
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="px-2 py-1 text-xs bg-purple-500 text-white rounded"
                        disabled={order.status !== 'paid'}
                      >
                        标记为已发货
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                        disabled={order.status !== 'shipped'}
                      >
                        标记为已送达
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                        disabled={!['pending', 'paid'].includes(order.status)}
                      >
                        取消订单
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">当前用户没有订单</p>
            )}
          </div>
        )}
        
        {/* 所有订单 */}
        <div>
          <h3 className="font-medium mb-3">所有订单 ({allOrders.length})</h3>
          {allOrders.length > 0 ? (
            <div className="space-y-4">
              {allOrders.map(order => (
                <div key={order.id} className="border rounded p-3">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">订单号: {order.id}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'pending' ? '待支付' :
                       order.status === 'paid' ? '已支付' :
                       order.status === 'shipped' ? '已发货' :
                       order.status === 'delivered' ? '已送达' :
                       order.status === 'completed' ? '已完成' : '已取消'}
                    </span>
                  </div>
                  <p><span className="text-gray-600">用户ID:</span> {order.userId}</p>
                  <p><span className="text-gray-600">总金额:</span> ¥{order.totalAmount.toFixed(2)}</p>
                  <p><span className="text-gray-600">下单时间:</span> {new Date(order.createdAt).toLocaleString()}</p>
                  
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">商品项 ({order.items.length})</h4>
                    <ul className="text-sm">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} x {item.quantity} (¥{item.price.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'paid')}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                      disabled={order.status !== 'pending'}
                    >
                      标记为已支付
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                      className="px-2 py-1 text-xs bg-purple-500 text-white rounded"
                      disabled={order.status !== 'paid'}
                    >
                      标记为已发货
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                      disabled={order.status !== 'shipped'}
                    >
                      标记为已送达
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                      disabled={!['pending', 'paid'].includes(order.status)}
                    >
                      取消订单
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">暂无订单数据</p>
          )}
        </div>
      </div>
    )
  }
  
  // 渲染优惠券选项卡
  const renderCouponsTab = () => {
    const availableCoupons = getAvailableCoupons()
    
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">优惠券管理</h2>
        
        {/* 添加新优惠券 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">添加优惠券</h3>
          <div className="flex">
            <input 
              type="text" 
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value)}
              className="flex-grow p-2 border rounded-l"
              placeholder="输入优惠券代码"
            />
            <button 
              onClick={() => {
                if (newCouponCode.trim()) {
                  const success = addCoupon(newCouponCode)
                  if (success) {
                    alert(`成功添加优惠券: ${newCouponCode}`)
                    setNewCouponCode('')
                  } else {
                    alert('优惠券添加失败，可能是无效的代码或该优惠券已被添加')
                  }
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-r"
            >
              添加
            </button>
          </div>
        </div>
        
        {/* 优惠券列表 */}
        <div>
          <h3 className="font-medium mb-3">优惠券列表 ({coupons.length})</h3>
          {coupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coupons.map(coupon => (
                <div key={coupon.id} className="border rounded p-3">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{coupon.name}</span>
                    {coupon.isUsed && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                        已使用
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
                  <p className="text-sm">
                    <span className="text-gray-600">代码:</span> 
                    <span className="font-mono font-medium ml-1">{coupon.code}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">优惠:</span> 
                    <span className="ml-1">
                      {coupon.discountType === 'amount' 
                        ? `¥${coupon.discountValue}` 
                        : `${coupon.discountValue}%`}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">最低消费:</span> 
                    <span className="ml-1">¥{coupon.minPurchase}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">有效期:</span> 
                    <span className="ml-1">
                      {new Date(coupon.startDate).toLocaleDateString()} - 
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">暂无优惠券数据</p>
          )}
        </div>
      </div>
    )
  }
  
  // 渲染本地存储选项卡
  const renderLocalStorageTab = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">本地存储管理</h2>
        
        <div className="mb-4 flex">
          <button 
            onClick={clearAllStorage}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            清除所有本地存储
          </button>
        </div>
        
        {storageKeys.length > 0 ? (
          <div className="space-y-4">
            {storageKeys.map(key => (
              <div key={key} className="border rounded p-3">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{key}</h3>
                  <button 
                    onClick={() => clearStorageItem(key)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    删除
                  </button>
                </div>
                <div className="bg-gray-50 p-3 rounded overflow-auto max-h-60">
                  <pre className="text-xs">{JSON.stringify(storageContent[key], null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">本地存储中没有数据</p>
        )}
      </div>
    )
  }
  
  return (
    <div className="container-custom py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold mb-6">管理员测试工具</h1>
        
        {/* 标签页切换 */}
        <div className="flex border-b mb-6">
          <button
            className={`pb-2 px-4 font-medium ${selectedTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('users')}
          >
            用户管理
          </button>
          <button
            className={`pb-2 px-4 font-medium ${selectedTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('orders')}
          >
            订单管理
          </button>
          <button
            className={`pb-2 px-4 font-medium ${selectedTab === 'coupons' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('coupons')}
          >
            优惠券管理
          </button>
          <button
            className={`pb-2 px-4 font-medium ${selectedTab === 'local-storage' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('local-storage')}
          >
            本地存储
          </button>
        </div>
        
        {/* 选项卡内容 */}
        {selectedTab === 'users' && renderUsersTab()}
        {selectedTab === 'orders' && renderOrdersTab()}
        {selectedTab === 'coupons' && renderCouponsTab()}
        {selectedTab === 'local-storage' && renderLocalStorageTab()}
      </div>
    </div>
  )
} 