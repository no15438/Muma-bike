'use client'

import { categories } from '@/lib/data'
import { useCart } from '@/lib/cart/CartContext'
import { useUser } from '@/lib/auth/UserContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

export default function Navbar() {
  const { itemsCount } = useCart()
  const { user, isAuthenticated, logout } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false)
  const [showServicesDropdown, setShowServicesDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showNewsDropdown, setShowNewsDropdown] = useState(false)
  const pathname = usePathname()
  
  const categoriesRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const newsDropdownRef = useRef<HTMLDivElement>(null)

  // 处理点击外部区域关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setShowCategoriesDropdown(false)
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setShowServicesDropdown(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
      if (newsDropdownRef.current && !newsDropdownRef.current.contains(event.target as Node)) {
        setShowNewsDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // 检查当前路径是否是活动状态
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }
  
  // 切换下拉菜单显示状态
  const toggleCategoriesDropdown = () => {
    setShowCategoriesDropdown(!showCategoriesDropdown)
    setShowServicesDropdown(false)
    setShowUserDropdown(false)
    setShowNewsDropdown(false)
  }
  
  const toggleServicesDropdown = () => {
    setShowServicesDropdown(!showServicesDropdown)
    setShowCategoriesDropdown(false)
    setShowUserDropdown(false)
    setShowNewsDropdown(false)
  }
  
  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown)
    setShowCategoriesDropdown(false)
    setShowServicesDropdown(false)
    setShowNewsDropdown(false)
  }
  
  const toggleNewsDropdown = () => {
    setShowNewsDropdown(!showNewsDropdown)
    setShowCategoriesDropdown(false)
    setShowServicesDropdown(false)
    setShowUserDropdown(false)
  }

  return (
    <nav className="bg-white shadow-nav sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-2xl text-primary">牧马单车</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div 
              ref={categoriesRef}
              className="relative"
            >
              <button
                type="button"
                className={`text-dark hover:text-primary transition-colors focus:outline-none flex items-center ${isActive('/products') ? 'text-primary font-medium' : ''}`}
                onClick={toggleCategoriesDropdown}
              >
                <span>商品</span>
                <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* 分类下拉菜单 */}
              {showCategoriesDropdown && (
                <div 
                  className="absolute left-0 top-full pt-2 w-max"
                >
                  <div className="bg-white shadow-lg rounded-md py-2 min-w-[160px]">
                    <Link 
                      href="/products" 
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      所有商品
                    </Link>
                    {categories.map(category => (
                      <Link 
                        key={category.id} 
                        href={`/products?category=${category.id}`} 
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div
              ref={servicesRef}
              className="relative"
            >
              <button
                type="button"
                className={`text-dark hover:text-primary transition-colors focus:outline-none flex items-center ${isActive('/services') ? 'text-primary font-medium' : ''}`}
                onClick={toggleServicesDropdown}
              >
                <span>服务</span>
                <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* 服务下拉菜单 */}
              {showServicesDropdown && (
                <div 
                  className="absolute left-0 top-full pt-2 w-max"
                >
                  <div className="bg-white shadow-lg rounded-md py-2 min-w-[160px]">
                    <Link 
                      href="/services" 
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      所有服务
                    </Link>
                    <Link 
                      href="/services/repair/book" 
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      预约维修服务
                    </Link>
                    <Link 
                      href="/services/fitting/book" 
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      预约Bike Fitting
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div
              ref={newsDropdownRef}
              className="relative"
            >
              <button
                type="button"
                className={`text-dark hover:text-primary transition-colors focus:outline-none flex items-center ${isActive('/articles') || isActive('/announcements') ? 'text-primary font-medium' : ''}`}
                onClick={toggleNewsDropdown}
              >
                <span>资讯</span>
                <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* 资讯下拉菜单 */}
              {showNewsDropdown && (
                <div 
                  className="absolute left-0 top-full pt-2 w-max"
                >
                  <div className="bg-white shadow-lg rounded-md py-2 min-w-[160px]">
                    <Link 
                      href="/articles" 
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      文章专栏
                    </Link>
                    <Link 
                      href="/announcements" 
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      最新公告
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              href="/events" 
              className={`text-dark hover:text-primary transition-colors ${isActive('/events') ? 'text-primary font-medium' : ''}`}
            >
              活动
            </Link>
            
            <Link 
              href="/about" 
              className={`text-dark hover:text-primary transition-colors ${isActive('/about') ? 'text-primary font-medium' : ''}`}
            >
              关于我们
            </Link>
            <Link 
              href="/contact" 
              className={`text-dark hover:text-primary transition-colors ${isActive('/contact') ? 'text-primary font-medium' : ''}`}
            >
              联系我们
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/cart" 
              className={`text-dark hover:text-primary transition-colors ${isActive('/cart') ? 'text-primary' : ''}`}
            >
              <span className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-xs text-dark px-1.5 py-0.5 rounded-full">
                    {itemsCount}
                  </span>
                )}
              </span>
            </Link>
            
            {isAuthenticated ? (
              <div 
                ref={userDropdownRef}
                className="relative"
              >
                <button
                  type="button"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-primary focus:outline-none"
                  onClick={toggleUserDropdown}
                >
                  <span className="mr-2">{user?.name}</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserDropdown && (
                  <div
                    className="absolute right-0 top-full pt-2 w-48"
                  >
                    <div className="bg-white shadow-lg rounded-md py-2">
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        个人中心
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        我的订单
                      </Link>
                      <Link
                        href="/account/appointments"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        我的预约
                      </Link>
                      <Link
                        href="/account/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        账户设置
                      </Link>
                      <button
                        type="button"
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn text-sm">登录 / 注册</Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link 
              href="/cart" 
              className="mr-4 relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-xs text-dark px-1.5 py-0.5 rounded-full">
                  {itemsCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-4 space-y-1">
            {isAuthenticated && (
              <div className="px-3 py-2 text-primary font-medium">
                你好，{user?.name}
              </div>
            )}
            
            <Link href="/products" className="block px-3 py-2 text-dark hover:bg-gray-100 rounded">商品</Link>
            {/* 移动端分类菜单 */}
            <div className="pl-4">
              {isMobileMenuOpen && categories.map(category => (
                <Link 
                  key={category.id} 
                  href={`/products?category=${category.id}`} 
                  className="block px-3 py-2 text-dark text-sm hover:bg-gray-100 rounded"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <Link href="/services" className="block px-3 py-2 text-dark hover:bg-gray-100 rounded">服务</Link>
            {/* 移动端服务菜单 */}
            <div className="pl-4">
              {isMobileMenuOpen && (
                <>
                  <Link 
                    href="/services/repair/book" 
                    className="block px-3 py-2 text-dark text-sm hover:bg-gray-100 rounded"
                  >
                    预约维修服务
                  </Link>
                  <Link 
                    href="/services/fitting/book" 
                    className="block px-3 py-2 text-dark text-sm hover:bg-gray-100 rounded"
                  >
                    预约Bike Fitting
                  </Link>
                </>
              )}
            </div>
            
            {/* 添加移动端资讯菜单 */}
            <Link href="/articles" className="block px-3 py-2 text-dark hover:bg-gray-100 rounded">文章专栏</Link>
            <Link href="/announcements" className="block px-3 py-2 text-dark hover:bg-gray-100 rounded">最新公告</Link>
            
            <Link href="/events" className="block px-3 py-2 text-dark hover:bg-gray-100 rounded">活动</Link>
            
            <Link href="/about" className="block px-3 py-2 text-dark hover:bg-gray-100 rounded">关于我们</Link>
            <Link href="/contact" className="block px-3 py-2 text-dark hover:bg-gray-100 rounded">联系我们</Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/account" className="block px-3 py-2 text-dark hover:bg-gray-100 rounded">个人中心</Link>
                <Link href="/account/orders" className="block px-3 py-2 text-dark hover:bg-gray-100 rounded">我的订单</Link>
                <Link href="/account/appointments" className="block px-3 py-2 text-dark hover:bg-gray-100 rounded">我的预约</Link>
                <Link href="/account/settings" className="block px-3 py-2 text-dark hover:bg-gray-100 rounded">账户设置</Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded"
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-3 py-2 text-dark hover:bg-gray-100 rounded">登录 / 注册</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 