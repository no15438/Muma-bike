'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import { 
  ArrowLeftIcon, 
  WrenchScrewdriverIcon, 
  CalendarIcon, 
  UserIcon,
  PhoneIcon,
  DocumentTextIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { 
  RepairStatus, 
  RepairPriority,
  getRepairStatusLabel,
  getRepairPriorityLabel,
  sampleRepairOrders
} from '@/lib/repairs/repair-model';

// Helper function to format date
function formatDate(dateString: string | null | undefined) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD for input fields
}

function RepairEditPage() {
  const router = useRouter();
  const params = useParams();
  const repairId = params?.id as string;
  
  const [repair, setRepair] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    bikeModel: '',
    bikeSerialNumber: '',
    bikeColor: '',
    problemDescription: '',
    priority: RepairPriority.MEDIUM,
    status: RepairStatus.PENDING,
    estimatedCompletionDate: '',
    notes: '',
    assignedTechnicianId: '',
  });

  // Load repair data
  useEffect(() => {
    const loadRepair = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find the repair in our mock data
        const data = sampleRepairOrders.find(r => r.id === repairId);
        
        if (data) {
          setRepair(data);
          // Initialize form data with repair data
          setFormData({
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail || '',
            bikeModel: data.bikeModel,
            bikeSerialNumber: data.bikeSerialNumber || '',
            bikeColor: data.bikeColor || '',
            problemDescription: data.problemDescription,
            priority: data.priority,
            status: data.status,
            estimatedCompletionDate: formatDate(data.estimatedCompletionDate) || '',
            notes: data.notes || '',
            assignedTechnicianId: data.assignedTechnicianId || '',
          });
        } else {
          setError('找不到维修单数据');
        }
      } catch (err) {
        console.error('Failed to load repair', err);
        setError('加载维修单数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    if (repairId) {
      loadRepair();
    }
  }, [repairId]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // In a real app, this would be an API call to update the repair
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state for demo purposes
      const timestamp = new Date().toISOString();
      const updatedRepair = {
        ...repair,
        ...formData,
        updatedAt: timestamp
      };
      
      // Show success message and navigate back to repair detail
      alert('维修单已更新');
      router.push(`/admin/repairs/${repair.id}`);
    } catch (err) {
      console.error('Failed to update repair', err);
      alert('更新维修单失败');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">加载中...</div>;
  }

  if (error || !repair) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">维修单不存在</h1>
        <p className="text-gray-500 mb-6">{error || `找不到ID为 ${repairId} 的维修单`}</p>
        <button
          type="button"
          onClick={() => router.push('/admin/repairs')}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          返回维修列表
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link 
            href={`/admin/repairs/${repair.id}`}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">编辑维修单: {repair.id}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 客户信息 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">客户信息</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                  客户姓名 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="customerName"
                    id="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
                  联系电话 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="tel"
                    name="customerPhone"
                    id="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
                  邮箱
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="customerEmail"
                    id="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 自行车信息 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">自行车信息</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bikeModel" className="block text-sm font-medium text-gray-700">
                  自行车型号 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="bikeModel"
                    id="bikeModel"
                    required
                    value={formData.bikeModel}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="bikeSerialNumber" className="block text-sm font-medium text-gray-700">
                  序列号
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="bikeSerialNumber"
                    id="bikeSerialNumber"
                    value={formData.bikeSerialNumber}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="bikeColor" className="block text-sm font-medium text-gray-700">
                  车身颜色
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="bikeColor"
                    id="bikeColor"
                    value={formData.bikeColor}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="problemDescription" className="block text-sm font-medium text-gray-700">
                  问题描述 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea
                    name="problemDescription"
                    id="problemDescription"
                    rows={3}
                    required
                    value={formData.problemDescription}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 维修信息 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">维修信息</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  维修状态
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    {Object.values(RepairStatus).map(status => (
                      <option key={status} value={status}>
                        {getRepairStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  优先级
                </label>
                <div className="mt-1">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    {Object.values(RepairPriority).map(priority => (
                      <option key={priority} value={priority}>
                        {getRepairPriorityLabel(priority)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="estimatedCompletionDate" className="block text-sm font-medium text-gray-700">
                  预计完成时间
                </label>
                <div className="mt-1 flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="date"
                    name="estimatedCompletionDate"
                    id="estimatedCompletionDate"
                    value={formData.estimatedCompletionDate}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="assignedTechnicianId" className="block text-sm font-medium text-gray-700">
                  负责技师
                </label>
                <div className="mt-1 flex items-center">
                  <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    id="assignedTechnicianId"
                    name="assignedTechnicianId"
                    value={formData.assignedTechnicianId}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">未分配</option>
                    <option value="1">张师傅</option>
                    <option value="2">李师傅</option>
                    <option value="3">王师傅</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  备注
                </label>
                <div className="mt-1">
                  <textarea
                    name="notes"
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-3">
          <Link
            href={`/admin/repairs/${repair.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                保存中...
              </>
            ) : (
              <>
                <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                保存
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(RepairEditPage, Permission.MANAGE_REPAIRS); 