'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import {
  Product,
  getAllCategories,
  getAllSuppliers,
  Category,
  Supplier,
  getProductStatusLabel,
  getProductStatusColor
} from '@/lib/inventory/inventory-model';
import { useProducts } from '@/lib/products/ProductContext';
import {
  ArrowLeftIcon,
  PencilIcon,
  CurrencyYenIcon,
  TagIcon,
  InformationCircleIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;
  const router = useRouter();
  const { products } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 使用Context中的数据查找产品
        const productData = products.find(p => p.id === id) || null;
        const [categoriesData, suppliersData] = await Promise.all([
          getAllCategories(),
          getAllSuppliers(),
        ]);
        
        setProduct(productData);
        setCategories(categoriesData);
        setSuppliers(suppliersData);
        
        if (!productData) {
          console.error(`Product with ID ${id} not found in context`);
          router.push('/admin/inventory');
        }
      } catch (error) {
        console.error('Failed to load product data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (products.length > 0) {
      loadData();
    }
  }, [id, router, products]);
  
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '未分类';
  };
  
  const getSupplierName = (supplierId?: string): string => {
    if (!supplierId) return '未指定';
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : '未知供应商';
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center space-x-2">
          <Link href="/admin/inventory" className="p-1 rounded-md hover:bg-gray-100">
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <div className="ml-2 flex-shrink-0 flex">
            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getProductStatusColor(product.status)}`}>
              {getProductStatusLabel(product.status)}
            </p>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 flex space-x-2">
          <Link
            href={`/admin/inventory/${product.id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <PencilIcon className="-ml-1 mr-1 h-4 w-4" />
            编辑
          </Link>
          <Link
            href={`/admin/inventory/${product.id}/stock`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <TagIcon className="-ml-1 mr-1 h-4 w-4" />
            库存变更
          </Link>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <DocumentDuplicateIcon className="-ml-1 mr-1 h-4 w-4" />
            复制
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左栏 - 产品详情 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 产品图片 */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">产品图片</h2>
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={image}
                        alt={`${product.name} - 图片 ${index + 1}`}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">暂无图片</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 产品信息 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">产品信息</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">SKU</h3>
                <p className="mt-1 text-sm text-gray-900">{product.sku}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">品牌</h3>
                <p className="mt-1 text-sm text-gray-900">{product.brand}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">分类</h3>
                <p className="mt-1 text-sm text-gray-900">{getCategoryName(product.categoryId)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">供应商</h3>
                <p className="mt-1 text-sm text-gray-900">{getSupplierName(product.supplierId)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500">产品描述</h3>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{product.description}</p>
            </div>
          </div>
          
          {/* 规格和属性 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 规格 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">规格</h2>
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <dl className="divide-y divide-gray-200">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">{key}</dt>
                      <dd className="text-sm text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-gray-500">暂无规格信息</p>
              )}
            </div>
            
            {/* 属性 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">属性</h2>
              {product.attributes && Object.keys(product.attributes).length > 0 ? (
                <dl className="divide-y divide-gray-200">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">{key}</dt>
                      <dd className="text-sm text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-gray-500">暂无属性信息</p>
              )}
            </div>
          </div>
        </div>
        
        {/* 右栏 - 价格和库存信息 */}
        <div className="space-y-6">
          {/* 价格信息 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">价格信息</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">成本价</dt>
                <dd className="text-sm text-gray-900">¥{(product.costPrice ?? 0).toFixed(2)}</dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">销售价</dt>
                <dd className="text-sm text-gray-900">¥{(product.price ?? 0).toFixed(2)}</dd>
              </div>
              
              {product.salePrice && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">促销价</dt>
                  <dd className="text-sm text-red-600">¥{product.salePrice.toFixed(2)}</dd>
                </div>
              )}
              
              {product.costPrice != null && product.price != null && (
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <dt className="text-sm font-medium text-gray-500">毛利率</dt>
                  <dd className="text-sm text-green-600">
                    {(((product.price - product.costPrice) / product.price) * 100).toFixed(2)}%
                  </dd>
                </div>
              )}
            </dl>
          </div>
          
          {/* 库存信息 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">库存信息</h2>
            <dl className="space-y-3">
              <div className="flex justify-between items-center">
                <dt className="text-sm font-medium text-gray-500">当前库存</dt>
                <dd className={`text-sm font-semibold ${product.stockQuantity === 0 ? 'text-red-600' : product.stockQuantity <= (product.minStock || 0) ? 'text-amber-600' : 'text-gray-900'}`}>
                  {product.stockQuantity} 件
                </dd>
              </div>
              
              {product.minStock !== undefined && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">库存警戒线</dt>
                  <dd className="text-sm text-gray-900">{product.minStock} 件</dd>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        库存状态
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {product.stockQuantity === 0 ? '缺货' : product.stockQuantity <= (product.minStock || 0) ? '库存偏低' : '正常'}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div 
                      style={{ 
                        width: `${Math.min((product.stockQuantity || 0) / ((product.minStock ? product.minStock * 2 : 10) || 1) * 100, 100)}%` 
                      }} 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        product.stockQuantity === 0 ? 'bg-red-500' : 
                        product.stockQuantity <= (product.minStock || 0) ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </dl>
            
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push(`/admin/inventory/${product.id}/stock`)}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <TagIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                管理库存
              </button>
            </div>
          </div>
          
          {/* 时间信息 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">时间信息</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">创建时间</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(product.createdAt).toLocaleString('zh-CN')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">最后更新</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(product.updatedAt).toLocaleString('zh-CN')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProductDetailPage, Permission.VIEW_CONTENT); 