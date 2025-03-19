'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Permission, Role, sampleStaff, hasPermission } from './permissions';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('admin_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          localStorage.removeItem('admin_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user by email (simulating authentication)
      const user = sampleStaff.find(u => u.email === email);
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('admin_user', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('admin_user');
  };

  // Check if user has permission
  const checkPermission = (permission: Permission) => {
    if (!currentUser) return false;
    return hasPermission(currentUser.role, permission);
  };

  const authValue = {
    currentUser,
    login,
    logout,
    hasPermission: checkPermission,
    isAuthenticated: !!currentUser,
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: Permission | Permission[] | null
) {
  return function ProtectedRoute(props: P) {
    const { isAuthenticated, hasPermission } = useAuth();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    if (!isClient) return null;

    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/admin/login';
      return null;
    }

    // 如果没有指定权限，或者权限为null，则允许访问
    if (!requiredPermission) {
      return <Component {...props} />;
    }
    
    // 检查是否有权限访问
    // 如果requiredPermission是数组，检查是否有任一权限
    // 如果是单个权限，直接检查
    const hasAccess = Array.isArray(requiredPermission)
      ? requiredPermission.some(perm => hasPermission(perm))
      : hasPermission(requiredPermission);
      
    if (!hasAccess) {
      // Handle unauthorized access
      return <div className="p-6">您没有访问此页面的权限</div>;
    }

    return <Component {...props} />;
  };
} 