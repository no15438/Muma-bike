'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission, sampleStaff } from '@/lib/auth/permissions';
import { 
  RepairOrder, 
  RepairStatus, 
  RepairPriority,
  getRepairStatusLabel,
  getRepairStatusColor,
  getRepairPriorityLabel,
  getRepairPriorityColor,
  searchRepairOrders
} from '@/lib/repairs/repair-model';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

function RepairsListPage() {
  const router = useRouter();
  const [repairs, setRepairs] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    technicianId: '',
    customerName: '',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load repair orders
  const loadRepairs = async () => {
    setLoading(true);
    try {
      const cleanFilters: any = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) cleanFilters[key] = value;
      });
      
      const data = await searchRepairOrders(cleanFilters);
      setRepairs(data);
    } catch (error) {
      console.error('Failed to load repairs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepairs();
  }, []);

  // Apply filters
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    loadRepairs();
    setIsFilterOpen(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      technicianId: '',
      customerName: '',
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
  };

  // Get technician name by ID
  const getTechnicianName = (id?: string) => {
    if (!id) return '未分配';
    const tech = sampleStaff.find(staff => staff.id === id);
    return tech ? tech.name : '未知技师';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">维修管理</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadRepairs}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md"
            title="刷新"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <Link
            href="/admin/repairs/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            新建维修单
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
              placeholder="搜索客户名称..."
              value={filters.customerName}
              onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && loadRepairs()}
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
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  状态
                </label>
                <select
                  id="status"
                  name="status"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">全部状态</option>
                  {Object.values(RepairStatus).map((status) => (
                    <option key={status} value={status}>
                      {getRepairStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  优先级
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                >
                  <option value="">全部优先级</option>
                  {Object.values(RepairPriority).map((priority) => (
                    <option key={priority} value={priority}>
                      {getRepairPriorityLabel(priority)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="technician" className="block text-sm font-medium text-gray-700">
                  技师
                </label>
                <select
                  id="technician"
                  name="technician"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.technicianId}
                  onChange={(e) => setFilters({ ...filters, technicianId: e.target.value })}
                >
                  <option value="">全部技师</option>
                  {sampleStaff
                    .filter(staff => staff.role === 'technician')
                    .map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-end space-x-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  应用筛选
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  重置
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Repairs list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="py-12 flex justify-center">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : repairs.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            没有找到匹配的维修订单
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {repairs.map((repair) => (
              <li key={repair.id}>
                <Link 
                  href={`/admin/repairs/${repair.id}`}
                  className="block hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {repair.id} - {repair.customerName}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRepairStatusColor(repair.status)}`}>
                            {getRepairStatusLabel(repair.status)}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRepairPriorityColor(repair.priority)}`}>
                            {getRepairPriorityLabel(repair.priority)}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 text-xs text-gray-500">
                          {getTechnicianName(repair.assignedTechnicianId)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {repair.bikeModel}
                          {repair.bikeColor && ` - ${repair.bikeColor}`}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {repair.problemDescription.length > 50
                            ? `${repair.problemDescription.substring(0, 50)}...`
                            : repair.problemDescription}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>创建于 {formatDate(repair.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default withAuth(RepairsListPage, Permission.VIEW_REPAIRS); 