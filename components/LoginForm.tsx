import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  setError: (error: string | null) => void;
}

const LoginForm = ({ onLogin, setError }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = '邮箱不能为空';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '邮箱格式不正确';
    }
    
    if (!password) {
      newErrors.password = '密码不能为空';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (validateForm()) {
      onLogin(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">登录</h2>
      
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">邮箱</label>
        <input
          id="email"
          type="text" // 改为text而不是email以便我们自己处理验证
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="邮箱"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
      </div>
      
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">密码</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="密码"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
      </div>
      
      <button 
        type="submit" 
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        登录
      </button>
    </form>
  );
};

export default LoginForm; 