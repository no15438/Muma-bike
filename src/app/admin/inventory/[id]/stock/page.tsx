'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import {
  Product,
  getProductById,
} from '@/lib/inventory/inventory-model';
import { useAuth } from '@/lib/auth/auth-context';
import { ArrowLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

interface StockManagementPageProps {
  params: {
    id: string;
  };
}

// 库存变动类型
enum StockMovementType {
  IN = 'in', // 入库
  OUT = 'out', // 出库
}

// 库存变动原因
enum StockMovementReason {
  PURCHASE = 'purchase', // 采购
  SALE = 'sale', // 销售
  RETURN = 'return', // 退货
  DAMAGE = 'damage', // 损坏
  ADJUSTMENT = 'adjustment', // 库存调整
}

// 库存变动记录
interface StockMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  quantity: number;
  reason: StockMovementReason;
  notes?: string;
  performedBy: string;
  performedAt: string;
}

// 模拟历史库存变动数据
const sampleStockMovements: StockMovement[] = [
  {
    id: 'SM001',
    productId: 'prod1',
    type: StockMovementType.IN,
    quantity: 10,
    reason: StockMovementReason.PURCHASE,
    notes: '初始库存入库',
    performedBy: '1',
    performedAt: '2023-03-01T10:00:00Z',
  },
  {
    id: 'SM002',
    productId: 'prod1',
    type: StockMovementType.OUT,
    quantity: 2,
    reason: StockMovementReason.SALE,
    notes: '销售订单 #ORD10001',
    performedBy: '5',
    performedAt: '2023-03-05T14:30:00Z',
  },
  {
    id: 'SM003',
    productId: 'prod1',
    type: StockMovementType.IN,
    quantity: 8,
    reason: StockMovementReason.PURCHASE,
    notes: '补充库存',
    performedBy: '2',
    performedAt: '2023-03-10T09:15:00Z',
  },
  {
    id: 'SM004',
    productId: 'prod1',
    type: StockMovementType.OUT,
    quantity: 1,
    reason: StockMovementReason.DAMAGE,
    notes: '产品损坏，无法销售',
    performedBy: '3',
    performedAt: '2023-03-15T16:45:00Z',
  },
];

function StockManagementPage({ params }: StockManagementPageProps) {
  const { id } = params;
  const router = useRouter();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [movementType, setMovementType] = useState<StockMovementType>(StockMovementType.IN);
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState<StockMovementReason>(StockMovementReason.PURCHASE);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
          
          // 过滤出当前产品的库存变动记录
          const movements = sampleStockMovements.filter(m => m.productId === id);
          // 按时间倒序排列
          movements.sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
          setStockMovements(movements);
        } else {
          router.push('/admin/inventory');
        }
      } catch (error) {
        console.error('Failed to load product data:', error);
        setError('加载数据失败，请重试');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, router]);
  
  // 处理库存变动表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !currentUser) return;
    
    if (quantity <= 0) {
      setError('数量必须大于0');
      return;
    }
    
    if (movementType === StockMovementType.OUT && quantity > product.stockQuantity) {
      setError('出库数量不能大于当前库存');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // 创建新的库存变动记录
      const newMovement: StockMovement = {
        id: `SM${Date.now()}`,
        productId: product.id,
        type: movementType,
        quantity,
        reason,
        notes,
        performedBy: currentUser.id,
        performedAt: new Date().toISOString(),
      };
      
      // 更新产品库存
      const newStockQuantity = movementType === StockMovementType.IN
        ? product.stockQuantity + quantity
        : product.stockQuantity - quantity;
      
      // 在实际应用中，这里会调用API
      console.log('新库存变动:', newMovement);
      console.log('更新后的库存:', newStockQuantity);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 更新本地状态
      setStockMovements([newMovement, ...stockMovements]);
      setProduct({
        ...product,
        stockQuantity: newStockQuantity,
      });
      
      // 重置表单
      setQuantity(1);
      setNotes('');
    } catch (error) {
      console.error('库存变动失败:', error);
      setError('操作失败，请重试');
    } finally {
      setSaving(false);
    }
  };
  
  // 获取库存变动类型标签
  const getMovementTypeLabel = (type: StockMovementType): string => {
    const typeLabels: Record<StockMovementType, string> = {
      [StockMovementType.IN]: '入库',
      [StockMovementType.OUT]: '出库',
    };
    
    return typeLabels[type] || type;
  };
  
  // 获取库存变动原因标签
  const getMovementReasonLabel = (reasonType: StockMovementReason): string => {
    const reasonLabels: Record<StockMovementReason, string> = {
      [StockMovementReason.PURCHASE]: '采购',
      [StockMovementReason.SALE]: '销售',
      [StockMovementReason.RETURN]: '退货',
      [StockMovementReason.DAMAGE]: '损坏',
      [StockMovementReason.ADJUSTMENT]: '调整',
    };
    
    return reasonLabels[reasonType] || reasonType;
  };
  
  // 格式化日期
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('zh-CN');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">找不到产品</p>
        <Link href="/admin/inventory" className="mt-4 text-blue-500 hover:text-blue-700">
          返回库存列表
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div className="flex items-center space-x-2">
        <Link href={`/admin/inventory/${id}`} className="p-1 rounded-md hover:bg-gray-100">
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">库存管理: {product.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧 - 当前库存和库存变动表单 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 当前库存信息 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">当前库存</h2>
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-gray-900">{product.stockQuantity}</div>
              <div className="mt-2 text-sm text-gray-500">当前库存数量</div>
              
              {product.minStock !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-500">库存警戒线: {product.minStock}</span>
                    <span className="text-xs font-medium text-gray-500">
                      {product.stockQuantity === 0 ? (
                        <span className="text-red-600">缺货</span>
                      ) : product.stockQuantity <= product.minStock ? (
                        <span className="text-amber-600">库存偏低</span>
                      ) : (
                        <span className="text-green-600">正常</span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 ${
                        product.stockQuantity === 0 ? 'bg-red-500' : 
                        product.stockQuantity <= product.minStock ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(product.stockQuantity / (product.minStock * 2) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800">SKU</div>
                <div className="mt-1 text-xs text-blue-600">{product.sku}</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800">销售价格</div>
                <div className="mt-1 text-xs text-green-600">¥{product.price.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          {/* 库存变动表单 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">库存变动</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="movementType" className="block text-sm font-medium text-gray-700">
                  变动类型 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <button
                    type="button"
                    className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 ${
                      movementType === StockMovementType.IN
                        ? 'bg-blue-50 text-blue-700 z-10 border-blue-500'
                        : 'bg-white text-gray-700'
                    } text-sm font-medium focus:outline-none`}
                    onClick={() => setMovementType(StockMovementType.IN)}
                  >
                    <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                    入库
                  </button>
                  <button
                    type="button"
                    className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 ${
                      movementType === StockMovementType.OUT
                        ? 'bg-red-50 text-red-700 z-10 border-red-500'
                        : 'bg-white text-gray-700'
                    } text-sm font-medium focus:outline-none`}
                    onClick={() => setMovementType(StockMovementType.OUT)}
                  >
                    <MinusIcon className="-ml-1 mr-2 h-4 w-4" />
                    出库
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  数量 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  原因 <span className="text-red-500">*</span>
                </label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value as StockMovementReason)}
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {Object.values(StockMovementReason).map((r) => (
                    <option key={r} value={r}>
                      {getMovementReasonLabel(r)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  备注
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="可选备注信息"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    movementType === StockMovementType.IN
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } focus:outline-none disabled:opacity-50`}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      处理中...
                    </>
                  ) : (
                    `确认${getMovementTypeLabel(movementType)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* 右侧 - 库存变动历史记录 */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">库存变动记录</h2>
            
            {stockMovements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无库存变动记录
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        时间
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        数量
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        原因
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        备注
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockMovements.map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(movement.performedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            movement.type === StockMovementType.IN
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {getMovementTypeLabel(movement.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getMovementReasonLabel(movement.reason)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {movement.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(StockManagementPage, Permission.MANAGE_SETTINGS); 