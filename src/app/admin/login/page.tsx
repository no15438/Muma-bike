'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('请输入邮箱和密码');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        router.push('/admin');
      } else {
        setError('邮箱或密码不正确');
      }
    } catch (err) {
      setError('登录失败，请稍后再试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // For demo: show sample login credentials
  const demoAccounts = [
    { role: '管理员', email: 'admin@mumabike.com', description: '可管理所有功能' },
    { role: '店长', email: 'manager@mumabike.com', description: '管理日常运营' },
    { role: '技师', email: 'tech1@mumabike.com', description: '维修管理' },
    { role: '销售', email: 'sales1@mumabike.com', description: '订单管理' },
    { role: '前台', email: 'receptionist@mumabike.com', description: '基础查询' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">管理员登录</h2>
            <p className="mt-2 text-sm text-gray-600">
              牧马单车管理系统
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    邮箱
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    密码
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
                  >
                    {loading ? '登录中...' : '登录'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Demo accounts */}
          <div className="mt-10 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-500">演示账户 (任意密码均可登录)</h3>
            <div className="mt-2 space-y-2">
              {demoAccounts.map((account) => (
                <div 
                  key={account.email} 
                  className="flex justify-between text-xs p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => setEmail(account.email)}
                >
                  <div>
                    <span className="font-medium text-gray-700">{account.role}</span>
                    <span className="text-gray-500 ml-2">({account.description})</span>
                  </div>
                  <span className="font-mono text-gray-500">{account.email}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500 bg-blue-50 p-3 rounded">
              <p>提示：这是演示系统，任意密码都可以登录以上账户，各角色权限不同</p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block lg:flex-1">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-blue-800 to-blue-500">
          <div className="text-center text-white max-w-2xl px-8">
            <h1 className="text-4xl font-bold mb-6">牧马单车管理系统</h1>
            <p className="text-xl font-light">高效管理您的自行车店</p>
          </div>
        </div>
      </div>
    </div>
  );
} 