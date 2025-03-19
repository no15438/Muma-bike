'use client'

import { createContext, useState, useContext, useEffect, ReactNode } from 'react'

type User = {
  id: string
  name: string
  email: string
  phone?: string
}

type UserContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// 模拟用户数据库
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

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 从localStorage初始化用户状态
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user from localStorage', error)
        setUser(null)
        setIsAuthenticated(false)
      }
    }
  }, [])

  // 登录函数
  const login = async (email: string, password: string): Promise<boolean> => {
    // 模拟API调用
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      const { password, ...userWithoutPassword } = user
      setUser(userWithoutPassword)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  // 注销函数
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  // 注册函数
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // 检查邮箱是否已被注册
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      return false
    }

    // 模拟API调用 - 在实际应用中，这会向后端发送请求
    const newUser = {
      id: `user${Date.now()}`,
      name,
      email,
      password
    }

    // 模拟添加到数据库
    mockUsers.push(newUser)
    
    // 自动登录
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
    
    return true
  }

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAuthenticated
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 