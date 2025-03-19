'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  UserIcon, 
  ClipboardDocumentListIcon, 
  WrenchScrewdriverIcon, 
  ShoppingBagIcon,
  Cog6ToothIcon, 
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  ArchiveBoxIcon,
  BuildingStorefrontIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { AuthProvider, useAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';

const navItems = [
  { name: '控制面板', href: '/admin', icon: ChartBarIcon, permission: null },
  { name: '用户管理', href: '/admin/users', icon: UserIcon, permission: Permission.VIEW_USERS },
  { name: '订单管理', href: '/admin/orders', icon: ShoppingBagIcon, permission: Permission.VIEW_ORDERS },
  { name: '维修管理', href: '/admin/repairs', icon: WrenchScrewdriverIcon, permission: Permission.VIEW_REPAIRS },
  { name: '库存管理', href: '/admin/inventory', icon: ArchiveBoxIcon, permission: Permission.VIEW_CONTENT },
  { name: '分类管理', href: '/admin/categories', icon: TagIcon, permission: Permission.MANAGE_CONTENT },
  { name: '品牌管理', href: '/admin/brands', icon: TagIcon, permission: Permission.MANAGE_CONTENT },
  { name: '供应商管理', href: '/admin/suppliers', icon: BuildingStorefrontIcon, permission: Permission.MANAGE_CONTENT },
  { name: '内容管理', href: '/admin/content', icon: ClipboardDocumentListIcon, permission: Permission.VIEW_CONTENT },
  { name: '系统设置', href: '/admin/settings', icon: Cog6ToothIcon, permission: Permission.MANAGE_SETTINGS },
];

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, currentUser, logout, hasPermission } = useAuth();
  const router = useRouter();
  
  // If we're on the login page, just render children
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    router.push('/admin/login');
    return null;
  }
  
  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className={`text-xl font-bold text-gray-800 ${!isSidebarOpen && 'hidden'}`}>牧马单车管理</h1>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 rounded-md hover:bg-gray-100">
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
              </svg>
            )}
          </button>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              // Skip rendering items the user doesn't have permission for
              if (item.permission && !hasPermission(item.permission)) {
                return null;
              }
              
              // 为控制面板特殊处理，只有完全匹配/admin才高亮
              const isActive = item.href === '/admin' 
                ? pathname === '/admin'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* User info */}
        {currentUser && (
          <div className="border-t border-gray-200 p-4">
            <div className={`flex items-center ${!isSidebarOpen && 'justify-center'}`}>
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {currentUser.name.charAt(0)}
                </div>
              </div>
              {isSidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.role}</p>
                </div>
              )}
              {isSidebarOpen && (
                <button 
                  onClick={handleLogout}
                  className="ml-auto p-1 rounded-md text-gray-400 hover:text-gray-500"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {navItems.find(item => item.href === pathname || pathname.startsWith(`${item.href}/`))?.name || '管理系统'}
          </h2>
          {!isSidebarOpen && (
            <button 
              onClick={handleLogout}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          )}
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
} 