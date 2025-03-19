'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import { Supplier, getAllSuppliers } from '@/lib/inventory/inventory-model';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';

function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    contactPerson: '',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Load suppliers
  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await getAllSuppliers();
      
      // Apply filters
      let filteredSuppliers = [...data];
      
      if (filters.name) {
        filteredSuppliers = filteredSuppliers.filter(supplier => 
          supplier.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }
      
      if (filters.contactPerson) {
        filteredSuppliers = filteredSuppliers.filter(supplier => 
          supplier.contactPerson.toLowerCase().includes(filters.contactPerson.toLowerCase())
        );
      }
      
      setSuppliers(filteredSuppliers);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Apply filters
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    loadSuppliers();
    setIsFilterOpen(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      name: '',
      contactPerson: '',
    });
  };

  // Open delete confirmation modal
  const handleDeleteClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDeleteModalOpen(true);
  };

  // Delete supplier
  const handleDeleteConfirm = async () => {
    if (!selectedSupplier) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter out the deleted supplier
      setSuppliers(suppliers.filter(supplier => supplier.id !== selectedSupplier.id));
      setDeleteModalOpen(false);
      setSelectedSupplier(null);
      
      // Success message
      alert(`供应商 ${selectedSupplier.name} 已删除`);
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      alert('删除供应商失败，请重试');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">供应商管理</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadSuppliers}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md"
            title="刷新"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <Link
            href="/admin/suppliers/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            添加供应商
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
              placeholder="搜索供应商名称..."
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && loadSuppliers()}
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
            <form onSubmit={handleApplyFilters} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                  联系人
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  placeholder="联系人姓名"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={filters.contactPerson}
                  onChange={(e) => setFilters({ ...filters, contactPerson: e.target.value })}
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

      {/* Suppliers list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="py-6 px-4 text-center text-gray-500">加载中...</div>
        ) : suppliers.length === 0 ? (
          <div className="py-6 px-4 text-center text-gray-500">没有找到匹配的供应商</div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <li key={supplier.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{supplier.name}</h3>
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <PhoneIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {supplier.phone}
                        </div>
                        {supplier.email && (
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {supplier.email}
                          </div>
                        )}
                        {supplier.wechat && (
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <ChatBubbleLeftEllipsisIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {supplier.wechat}
                          </div>
                        )}
                        {supplier.address && (
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {supplier.address}
                          </div>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        联系人: {supplier.contactPerson}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/admin/suppliers/edit/${supplier.id}`}>
                        <button
                          className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                          title="编辑"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </Link>
                      <button
                        className="p-1 rounded-full text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteClick(supplier)}
                        title="删除"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteModalOpen && selectedSupplier && (
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
                      删除供应商
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        您确定要删除供应商 "{selectedSupplier.name}" 吗？该操作无法撤销。
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
export default withAuth(SuppliersPage, Permission.MANAGE_CONTENT);

// Missing ExclamationIcon, add it
function ExclamationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
} 