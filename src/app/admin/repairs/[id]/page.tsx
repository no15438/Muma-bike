'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import { 
  ArrowLeftIcon, 
  WrenchScrewdriverIcon, 
  DocumentTextIcon, 
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { 
  RepairStatus, 
  RepairPriority,
  getRepairStatusLabel,
  getRepairStatusColor,
  getRepairPriorityLabel,
  getRepairPriorityColor,
  sampleRepairOrders
} from '@/lib/repairs/repair-model';

// Helper function to format date
function formatDate(dateString: string | null | undefined) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function RepairDetailPage() {
  const router = useRouter();
  const params = useParams();
  const repairId = params?.id as string;
  
  const [repair, setRepair] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [tab, setTab] = useState('details'); // 'details', 'services', 'logs'
  const [newLogMessage, setNewLogMessage] = useState('');

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
        } else {
          // For demo purposes, use the first repair
          setRepair({...sampleRepairOrders[0], id: repairId});
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

  // Handle status change
  const handleStatusChange = async (newStatus: RepairStatus) => {
    setUpdating(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update status and add a log entry
      if (repair) {
        const timestamp = new Date().toISOString();
        const newLog = {
          id: `log-${Date.now()}`,
          repairId: repair.id,
          timestamp,
          technicianId: repair.assignedTechnicianId || '1', // Default to admin if no technician
          technician: repair.assignedTechnician || { id: '1', name: '管理员', email: 'admin@mumabike.com', role: 'admin' },
          message: `维修状态已更新为: ${getRepairStatusLabel(newStatus)}`,
          statusChange: newStatus
        };
        
        // Add record for completion date if completed
        let updatedRepair = { 
          ...repair, 
          status: newStatus,
          logs: [newLog, ...repair.logs],
          updatedAt: timestamp
        };
        
        if (newStatus === RepairStatus.COMPLETED) {
          updatedRepair.actualCompletionDate = timestamp;
        }
        
        setRepair(updatedRepair);
      }
      
      // Show success message
      alert(`维修状态已更新为: ${getRepairStatusLabel(newStatus)}`);
    } catch (err) {
      console.error('Failed to update repair status', err);
      alert('更新维修状态失败');
    } finally {
      setUpdating(false);
    }
  };

  // Add a new log entry
  const handleAddLog = async () => {
    if (!newLogMessage.trim()) {
      alert('请输入日志内容');
      return;
    }

    setUpdating(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (repair) {
        const timestamp = new Date().toISOString();
        const newLog = {
          id: `log-${Date.now()}`,
          repairId: repair.id,
          timestamp,
          technicianId: repair.assignedTechnicianId || '1',
          technician: repair.assignedTechnician || { id: '1', name: '管理员', email: 'admin@mumabike.com', role: 'admin' },
          message: newLogMessage,
          hoursSpent: 0 // Could add UI for tracking hours
        };
        
        setRepair({
          ...repair,
          logs: [newLog, ...repair.logs],
          updatedAt: timestamp
        });
        
        setNewLogMessage('');
      }
    } catch (err) {
      console.error('Failed to add log', err);
      alert('添加日志失败');
    } finally {
      setUpdating(false);
    }
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    if (!repair) return 0;
    
    const serviceCost = repair.services.reduce(
      (sum: number, service: any) => sum + service.price, 
      0
    );
    
    const partsCost = repair.parts.reduce(
      (sum: number, part: any) => sum + (part.price * part.quantity), 
      0
    );
    
    return serviceCost + partsCost;
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
            href="/admin/repairs"
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">维修单: {repair.id}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRepairStatusColor(repair.status)}`}>
            {getRepairStatusLabel(repair.status)}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRepairPriorityColor(repair.priority)}`}>
            {getRepairPriorityLabel(repair.priority)}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setTab('details')}
            className={`${
              tab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            维修信息
          </button>
          <button
            onClick={() => setTab('services')}
            className={`${
              tab === 'services'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            服务与配件
          </button>
          <button
            onClick={() => setTab('logs')}
            className={`${
              tab === 'logs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            维修日志
          </button>
          {repair.images && repair.images.length > 0 && (
            <button
              onClick={() => setTab('photos')}
              className={`${
                tab === 'photos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              照片
            </button>
          )}
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content - changes based on active tab */}
        <div className="lg:col-span-2 space-y-6">
          {tab === 'details' && (
            <>
              {/* 客户信息 */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">客户信息</h2>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">客户姓名</p>
                      <div className="mt-1 flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-900">{repair.customerName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">联系电话</p>
                      <div className="mt-1 flex items-center">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-900">{repair.customerPhone}</p>
                      </div>
                    </div>
                    {repair.customerEmail && (
                      <div>
                        <p className="text-sm text-gray-500">邮箱</p>
                        <p className="mt-1 text-sm text-gray-900">{repair.customerEmail}</p>
                      </div>
                    )}
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
                      <p className="text-sm text-gray-500">自行车型号</p>
                      <p className="mt-1 text-sm text-gray-900">{repair.bikeModel}</p>
                    </div>
                    {repair.bikeSerialNumber && (
                      <div>
                        <p className="text-sm text-gray-500">序列号</p>
                        <p className="mt-1 text-sm text-gray-900">{repair.bikeSerialNumber}</p>
                      </div>
                    )}
                    {repair.bikeColor && (
                      <div>
                        <p className="text-sm text-gray-500">车身颜色</p>
                        <p className="mt-1 text-sm text-gray-900">{repair.bikeColor}</p>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">问题描述</p>
                      <p className="mt-1 text-sm text-gray-900">{repair.problemDescription}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 维修进度 */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">维修进度</h2>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">创建时间</p>
                        <div className="mt-1 flex items-center">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <p className="text-sm text-gray-900">{formatDate(repair.createdAt)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">预计完成时间</p>
                        <div className="mt-1 flex items-center">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <p className="text-sm text-gray-900">{formatDate(repair.estimatedCompletionDate)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">实际完成时间</p>
                        <div className="mt-1 flex items-center">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <p className="text-sm text-gray-900">{formatDate(repair.actualCompletionDate)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">负责技师</p>
                        <div className="mt-1 flex items-center">
                          <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <p className="text-sm text-gray-900">
                            {repair.assignedTechnician ? repair.assignedTechnician.name : '未分配'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {repair.notes && (
                      <div>
                        <p className="text-sm text-gray-500">备注</p>
                        <p className="mt-1 text-sm text-gray-900">{repair.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'services' && (
            <>
              {/* 维修服务 */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">维修服务</h2>
                  <button 
                    type="button"
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" />
                    添加服务
                  </button>
                </div>
                <div className="px-6 py-4">
                  {repair.services.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {repair.services.map((service: any) => (
                        <li key={service.id} className="py-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                              <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">¥{service.price.toLocaleString()}</p>
                              <p className="mt-1 text-xs text-gray-500">预计 {service.estimatedHours} 小时</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">暂无维修服务</p>
                  )}
                </div>
              </div>

              {/* 使用配件 */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">使用配件</h2>
                  <button 
                    type="button"
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" />
                    添加配件
                  </button>
                </div>
                <div className="px-6 py-4">
                  {repair.parts.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {repair.parts.map((part: any) => (
                        <li key={part.id} className="py-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">{part.name}</h3>
                              {part.description && (
                                <p className="mt-1 text-sm text-gray-500">{part.description}</p>
                              )}
                              <p className="mt-1 text-sm text-gray-500">数量: {part.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                ¥{part.price.toLocaleString()} × {part.quantity} = 
                                ¥{(part.price * part.quantity).toLocaleString()}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {part.isAvailable ? (
                                  <span className="text-green-600">库存充足</span>
                                ) : (
                                  <span className="text-red-600">
                                    缺货 (预计 {formatDate(part.estimatedDelivery)})
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">暂无使用配件</p>
                  )}
                </div>
              </div>
            </>
          )}

          {tab === 'logs' && (
            <>
              {/* 维修日志 */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">维修日志</h2>
                </div>
                <div className="px-6 py-4">
                  <div className="mb-4">
                    <label htmlFor="log" className="sr-only">添加日志</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow focus-within:z-10">
                        <input
                          type="text"
                          name="log"
                          id="log"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                          placeholder="添加维修日志记录..."
                          value={newLogMessage}
                          onChange={(e) => setNewLogMessage(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddLog}
                        disabled={updating}
                        className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                      >
                        {updating ? (
                          <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
                        ) : (
                          <PlusIcon className="h-5 w-5 text-gray-400" />
                        )}
                        <span>添加</span>
                      </button>
                    </div>
                  </div>

                  {repair.logs.length > 0 ? (
                    <ul className="space-y-4">
                      {repair.logs.map((log: any) => (
                        <li key={log.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              {log.statusChange ? (
                                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${log.statusChange === RepairStatus.COMPLETED ? 'bg-green-100' : log.statusChange === RepairStatus.CANCELLED ? 'bg-red-100' : 'bg-blue-100'}`}>
                                  {log.statusChange === RepairStatus.COMPLETED ? (
                                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                  ) : log.statusChange === RepairStatus.CANCELLED ? (
                                    <XCircleIcon className="h-5 w-5 text-red-600" />
                                  ) : (
                                    <ArrowPathIcon className="h-5 w-5 text-blue-600" />
                                  )}
                                </div>
                              ) : (
                                <div className="rounded-full h-8 w-8 bg-gray-200 flex items-center justify-center">
                                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {log.technician.name} {log.hoursSpent ? `(工时: ${log.hoursSpent}小时)` : ''}
                              </div>
                              <div className="mt-1 text-sm text-gray-700">
                                {log.message}
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                {formatDate(log.timestamp)}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">暂无维修日志</p>
                  )}
                </div>
              </div>
            </>
          )}

          {tab === 'photos' && (
            <>
              {/* 维修照片 */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">维修照片</h2>
                  <button 
                    type="button"
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" />
                    上传照片
                  </button>
                </div>
                <div className="px-6 py-4">
                  {repair.images && repair.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {repair.images.map((image: any) => (
                        <div key={image.id} className="group">
                          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={image.url}
                              alt={image.caption || '维修照片'}
                              className="object-cover"
                            />
                            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
                              <button className="text-white p-2 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-75">
                                查看
                              </button>
                            </div>
                          </div>
                          {image.caption && (
                            <p className="mt-2 text-sm text-gray-500 truncate">{image.caption}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">暂无维修照片</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 维修状态 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">维修状态</h2>
            </div>
            <div className="px-6 py-4 space-y-6">
              {repair.status !== RepairStatus.COMPLETED && repair.status !== RepairStatus.CANCELLED && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">更新维修状态</p>
                  <div className="flex flex-wrap gap-2">
                    {repair.status === RepairStatus.PENDING && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(RepairStatus.DIAGNOSED)}
                        disabled={updating}
                        className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                      >
                        已诊断
                      </button>
                    )}
                    {(repair.status === RepairStatus.DIAGNOSED || repair.status === RepairStatus.WAITING_PARTS) && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(RepairStatus.IN_PROGRESS)}
                        disabled={updating}
                        className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                      >
                        开始维修
                      </button>
                    )}
                    {repair.status === RepairStatus.IN_PROGRESS && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(RepairStatus.WAITING_PARTS)}
                        disabled={updating}
                        className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none disabled:opacity-50"
                      >
                        等待零件
                      </button>
                    )}
                    {repair.status === RepairStatus.IN_PROGRESS && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(RepairStatus.COMPLETED)}
                        disabled={updating}
                        className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50"
                      >
                        完成维修
                      </button>
                    )}
                    {repair.status === RepairStatus.COMPLETED && !repair.isPaid && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(RepairStatus.DELIVERED)}
                        disabled={updating}
                        className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50"
                      >
                        已交付
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(RepairStatus.CANCELLED)}
                      disabled={updating}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                    >
                      取消维修
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 支付信息 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">支付信息</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">维修服务费</p>
                <p className="text-sm font-medium text-gray-900">
                  ¥{repair.services.reduce((sum: number, s: any) => sum + s.price, 0).toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">配件费用</p>
                <p className="text-sm font-medium text-gray-900">
                  ¥{repair.parts.reduce((sum: number, p: any) => sum + (p.price * p.quantity), 0).toLocaleString()}
                </p>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <p className="text-sm font-medium text-gray-900">总计</p>
                <p className="text-sm font-medium text-gray-900">¥{repair.estimatedCost.toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">已付定金</p>
                <p className="text-sm font-medium text-gray-900">
                  {repair.deposit ? `¥${repair.deposit.toLocaleString()}` : '无'}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">支付状态</p>
                <p className={`text-sm font-medium ${repair.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                  {repair.isPaid ? '已付款' : '待付款'}
                </p>
              </div>
              {!repair.isPaid && (
                <button
                  type="button"
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none mt-4"
                >
                  标记为已付款
                </button>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-6 py-4 space-y-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" />
                打印维修单
              </button>
              <Link
                href={`/admin/repairs/edit/${repair.id}`}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
                编辑维修单
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(RepairDetailPage, Permission.VIEW_REPAIRS);

// Added for TypeScript compatibility
function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  );
} 