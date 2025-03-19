'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import {
  Product,
  ProductStatus,
  getAllCategories,
  Category
} from '@/lib/inventory/inventory-model';
import { useProducts } from '@/lib/products/ProductContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  TagIcon,
  ArchiveBoxIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

function InventoryPage() {
  const router = useRouter();
  const { products, toggleFeatured } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    categoryId: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    isFeatured: false,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 加载分类数据
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    
    loadCategories();
  }, []);

  // 应用筛选器
  useEffect(() => {
    setLoading(true);
    
    try {
      let filtered = [...products];
      
      // 应用筛选条件
      if (filters.name) {
        const searchTerm = filters.name.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchTerm) || 
          (product.sku && product.sku.toLowerCase().includes(searchTerm))
        );
      }
      
      if (filters.categoryId) {
        filtered = filtered.filter(product => product.categoryId === filters.categoryId);
      }
      
      if (filters.status) {
        filtered = filtered.filter(product => product.status === filters.status);
      }
      
      if (filters.minPrice) {
        const minPrice = parseFloat(filters.minPrice);
        filtered = filtered.filter(product => product.price >= minPrice);
      }
      
      if (filters.maxPrice) {
        const maxPrice = parseFloat(filters.maxPrice);
        filtered = filtered.filter(product => product.price <= maxPrice);
      }
      
      if (filters.inStock) {
        filtered = filtered.filter(product => product.stockQuantity > 0);
      }
      
      if (filters.isFeatured) {
        filtered = filtered.filter(product => product.isFeatured);
      }
      
      setFilteredProducts(filtered);
    } catch (error) {
      console.error('Error filtering products:', error);
    } finally {
      setLoading(false);
    }
  }, [products, filters]);

  // 应用筛选
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFilterOpen(false);
  };

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({
      name: '',
      categoryId: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      isFeatured: false,
    });
  };

  // 切换特色商品状态
  const handleToggleFeatured = (product: Product) => {
    toggleFeatured(product.id);
  };

  // 获取状态标签
  const getStatusLabel = (status: ProductStatus): string => {
    const statusLabels: Record<ProductStatus, string> = {
      [ProductStatus.ACTIVE]: '正常销售',
      [ProductStatus.OUT_OF_STOCK]: '缺货中',
      [ProductStatus.DISCONTINUED]: '已停产',
      [ProductStatus.COMING_SOON]: '即将上市',
    };
    
    return statusLabels[status] || status;
  };

  // 获取状态颜色
  const getStatusColor = (status: ProductStatus): string => {
    const statusColors: Record<ProductStatus, string> = {
      [ProductStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [ProductStatus.OUT_OF_STOCK]: 'bg-red-100 text-red-800',
      [ProductStatus.DISCONTINUED]: 'bg-gray-100 text-gray-800',
      [ProductStatus.COMING_SOON]: 'bg-blue-100 text-blue-800',
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // 获取分类名称
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">库存管理</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLoading(true)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md"
            title="刷新"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <Link
            href="/admin/inventory/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            添加产品
          </Link>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative rounded-md shadow-sm flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="搜索产品名称或SKU..."
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
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

        {/* 筛选面板 */}
        {isFilterOpen && (
          <div className="mt-4 border-t pt-4">
            <form onSubmit={handleApplyFilters} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                  产品分类
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.categoryId}
                  onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                >
                  <option value="">全部分类</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  产品状态
                </label>
                <select
                  id="status"
                  name="status"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">全部状态</option>
                  {Object.values(ProductStatus).map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                  最低价格
                </label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                  最高价格
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="inStock"
                    name="inStock"
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="inStock" className="font-medium text-gray-700">仅显示有库存</label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={filters.isFeatured}
                    onChange={(e) => setFilters({ ...filters, isFeatured: e.target.checked })}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isFeatured" className="font-medium text-gray-700">仅显示特色商品</label>
                </div>
              </div>

              <div className="flex items-end space-x-3 col-span-full">
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

      {/* 产品列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {loading ? (
          <div className="py-6 px-4 text-center text-gray-500">加载中...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-6 px-4 text-center text-gray-500">
            <div className="flex flex-col items-center justify-center">
              <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">未找到符合条件的产品</h3>
              <p className="mt-1 text-gray-500">请尝试使用其他搜索条件或清除筛选器。</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    产品名称
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分类
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    价格 (元)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    库存
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    特色
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="h-full w-full object-cover object-center"
                            />
                          ) : (
                            <ArchiveBoxIcon className="h-full w-full text-gray-300 p-1" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TagIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {getCategoryName(product.categoryId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ¥ {product.price.toLocaleString()}
                      </div>
                      {product.salePrice && (
                        <div className="text-xs text-gray-500 line-through">
                          ¥ {product.salePrice.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${product.stockQuantity <= 0 ? 'text-red-600' : product.stockQuantity <= (product.minStock || 5) ? 'text-yellow-600' : 'text-gray-900'}`}>
                        {product.stockQuantity} {product.minStock && product.stockQuantity <= product.minStock && (
                          <span className="inline-flex items-center ml-1 text-xs text-yellow-600">
                            <ExclamationTriangleIcon className="h-3 w-3 mr-0.5" />
                            低库存
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {getStatusLabel(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleToggleFeatured(product)}
                        className="text-gray-600 hover:text-yellow-500 focus:outline-none"
                        title={product.isFeatured ? "移除特色商品" : "设为特色商品"}
                      >
                        {product.isFeatured ? (
                          <StarIconSolid className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <StarIcon className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => window.location.href = `/admin/inventory/${product.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => window.location.href = `/admin/inventory/${product.id}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(InventoryPage, Permission.MANAGE_INVENTORY); 