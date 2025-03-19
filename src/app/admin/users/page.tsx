'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission, Role, User, sampleStaff } from '@/lib/auth/permissions';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    role: '',
    email: '',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Filter users based on search criteria
      let filteredUsers = [...sampleStaff];
      
      if (filters.name) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }
      
      if (filters.email) {
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(filters.email.toLowerCase())
        );
      }
      
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => 
          user.role === filters.role
        );
      }
      
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Apply filters
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
    setIsFilterOpen(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      name: '',
      role: '',
      email: '',
    });
  };

  // Format role for display
  const getRoleLabel = (role: Role): string => {
    const roleLabels: Record<Role, string> = {
      [Role.ADMIN]: '管理员',
      [Role.MANAGER]: '店长',
      [Role.TECHNICIAN]: '技师',
      [Role.SALES]: '销售',
      [Role.RECEPTIONIST]: '前台',
    };
    
    return roleLabels[role] || role;
  };

  // Get role color for display
  const getRoleColor = (role: Role): string => {
    const roleColors: Record<Role, string> = {
      [Role.ADMIN]: 'bg-red-100 text-red-800',
      [Role.MANAGER]: 'bg-purple-100 text-purple-800',
      [Role.TECHNICIAN]: 'bg-blue-100 text-blue-800',
      [Role.SALES]: 'bg-green-100 text-green-800',
      [Role.RECEPTIONIST]: 'bg-yellow-100 text-yellow-800',
    };
    
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };

  // Open delete confirmation modal
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  // Delete user
  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Filter out the deleted user
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setDeleteModalOpen(false);
      setSelectedUser(null);
      
      // Success message
      alert(`用户 ${selectedUser.name} 已删除`);
    } catch (error) {
      console.error('Failed to delete user:', error);
      
      // Error message
      alert('删除用户失败，请重试');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadUsers}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md"
            title="刷新"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <Link
            href="/admin/users/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            添加用户
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative rounded-md shadow-sm flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="搜索用户名称..."
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && loadUsers()}
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FunnelIcon className="-ml-0.5 mr-2 h-4 w-4" />
            筛选
          </button>
        </div>

        {/* Filter panel */}
        {isFilterOpen && (
          <div className="mt-4 border-t pt-4">
            <form onSubmit={handleApplyFilters} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  角色
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                >
                  <option value="">全部角色</option>
                  <option value={Role.ADMIN}>管理员</option>
                  <option value={Role.MANAGER}>店长</option>
                  <option value={Role.TECHNICIAN}>技师</option>
                  <option value={Role.SALES}>销售</option>
                  <option value={Role.RECEPTIONIST}>前台</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  邮箱
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="用户邮箱"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={filters.email}
                  onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                />
              </div>

              <div className="flex items-end space-x-3">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  应用筛选
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={handleResetFilters}
                >
                  重置
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Users list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="py-6 px-4 text-center text-gray-500">加载中...</div>
        ) : users.length === 0 ? (
          <div className="py-6 px-4 text-center text-gray-500">没有找到匹配的用户</div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                      <div className="flex space-x-2">
                        <Link href={`/admin/users/edit/${user.id}`}>
                          <button
                            className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                            title="编辑"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        </Link>
                        <button
                          className="p-1 rounded-full text-gray-400 hover:text-red-500"
                          onClick={() => handleDeleteClick(user)}
                          title="删除"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteModalOpen && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      删除用户
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        您确定要删除用户 "{selectedUser.name}" 吗？该操作无法撤销。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteConfirm}
                >
                  删除
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Check for permissions and export
export default withAuth(UsersPage, Permission.VIEW_USERS);

// Missing ExclamationIcon, import it
function ExclamationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
} 