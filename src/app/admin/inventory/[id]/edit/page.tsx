'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import {
  Product,
  ProductStatus,
  Category,
  Supplier,
  getAllCategories,
  getAllSuppliers
} from '@/lib/inventory/inventory-model';
import { useProducts } from '@/lib/products/ProductContext';
import { 
  ArrowLeftIcon, 
  PhotoIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  InformationCircleIcon,
  TagIcon,
  CubeIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface ProductEditPageProps {
  params: {
    id: string;
  };
}

function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = params;
  const router = useRouter();
  const { products, updateProduct } = useProducts();
  const isNewProduct = id === 'new';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'details', 'images', 'specs'
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    description: '',
    categoryId: '',
    brand: '',
    price: 0,
    costPrice: 0,
    salePrice: undefined,
    stockQuantity: 0,
    minStock: 5,
    status: ProductStatus.ACTIVE,
    supplierId: '',
    images: [],
    specifications: {},
    attributes: {},
  });
  
  // 额外的表单状态
  const [specKeys, setSpecKeys] = useState<string[]>(['颜色', '尺寸']);
  const [specValues, setSpecValues] = useState<string[]>(['', '']);
  const [attrKeys, setAttrKeys] = useState<string[]>(['材质', '重量']);
  const [attrValues, setAttrValues] = useState<string[]>(['', '']);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [categoriesData, suppliersData] = await Promise.all([
          getAllCategories(),
          getAllSuppliers(),
        ]);
        
        setCategories(categoriesData);
        setSuppliers(suppliersData);
        
        if (!isNewProduct) {
          // 使用Context中的产品数据
          const product = products.find(p => p.id === id);
          if (product) {
            setFormData(product);
            
            // 转换规格和属性为数组
            if (product.specifications) {
              const keys = Object.keys(product.specifications);
              const values = keys.map(k => product.specifications![k] || '');
              setSpecKeys(keys.length > 0 ? keys : ['颜色', '尺寸']);
              setSpecValues(values.length > 0 ? values : ['', '']);
            }
            
            if (product.attributes) {
              const keys = Object.keys(product.attributes);
              const values = keys.map(k => product.attributes![k] || '');
              setAttrKeys(keys.length > 0 ? keys : ['材质', '重量']);
              setAttrValues(values.length > 0 ? values : ['', '']);
            }
          } else {
            console.error(`Product with ID ${id} not found in context`);
            router.push('/admin/inventory');
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('加载数据失败，请重试');
      } finally {
        setLoading(false);
      }
    };
    
    if (isNewProduct || products.length > 0) {
      loadData();
    }
  }, [id, isNewProduct, router, products]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // 处理数字类型的输入
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  // 处理规格和属性的变更
  const handleSpecKeyChange = (index: number, value: string) => {
    const newKeys = [...specKeys];
    newKeys[index] = value;
    setSpecKeys(newKeys);
  };
  
  const handleSpecValueChange = (index: number, value: string) => {
    const newValues = [...specValues];
    newValues[index] = value;
    setSpecValues(newValues);
  };
  
  const handleAttrKeyChange = (index: number, value: string) => {
    const newKeys = [...attrKeys];
    newKeys[index] = value;
    setAttrKeys(newKeys);
  };
  
  const handleAttrValueChange = (index: number, value: string) => {
    const newValues = [...attrValues];
    newValues[index] = value;
    setAttrValues(newValues);
  };
  
  // 添加新的规格或属性字段
  const addSpecField = () => {
    setSpecKeys([...specKeys, '']);
    setSpecValues([...specValues, '']);
  };
  
  const addAttrField = () => {
    setAttrKeys([...attrKeys, '']);
    setAttrValues([...attrValues, '']);
  };
  
  // 删除规格或属性字段
  const removeSpecField = (index: number) => {
    const newKeys = specKeys.filter((_, i) => i !== index);
    const newValues = specValues.filter((_, i) => i !== index);
    setSpecKeys(newKeys);
    setSpecValues(newValues);
  };
  
  const removeAttrField = (index: number) => {
    const newKeys = attrKeys.filter((_, i) => i !== index);
    const newValues = attrValues.filter((_, i) => i !== index);
    setAttrKeys(newKeys);
    setAttrValues(newValues);
  };
  
  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // 在实际应用中，这里会上传文件到服务器并获取URL
    // 这里我们模拟上传，生成占位URL
    const newImages = [...(formData.images || [])];
    
    Array.from(files).forEach((file, index) => {
      // 创建一个临时的URL（实际应用中这会是真实的上传后的URL）
      const placeholderUrl = `https://placehold.co/400x300?text=${encodeURIComponent(file.name)}`;
      newImages.push(placeholderUrl);
    });
    
    setFormData({
      ...formData,
      images: newImages
    });
    
    // 清空input，允许重复上传同一个文件
    e.target.value = '';
  };
  
  // 删除图片
  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages
    });
  };
  
  // 手动添加图片URL
  const handleAddImageUrl = () => {
    const url = prompt('请输入图片URL');
    if (url && url.trim()) {
      const newImages = [...(formData.images || []), url.trim()];
      setFormData({
        ...formData,
        images: newImages
      });
    }
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // 转换规格和属性为对象
      const specifications: Record<string, string> = {};
      specKeys.forEach((key, index) => {
        if (key && specValues[index]) {
          specifications[key] = specValues[index];
        }
      });
      
      const attributes: Record<string, string> = {};
      attrKeys.forEach((key, index) => {
        if (key && attrValues[index]) {
          attributes[key] = attrValues[index];
        }
      });
      
      const productData = {
        ...formData,
        specifications,
        attributes,
        createdAt: isNewProduct ? new Date().toISOString() : formData.createdAt,
        updatedAt: new Date().toISOString(),
      } as Product;
      
      // 使用ProductContext中的updateProduct方法
      if (!isNewProduct && id) {
        updateProduct(id, productData);
        console.log('更新产品数据:', productData);
      } else {
        // 这里应当调用创建产品的API，暂时还是使用console.log模拟
        console.log('创建新产品数据:', productData);
      }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 保存成功后跳转到产品详情页
      window.location.href = isNewProduct ? '/admin/inventory' : `/admin/inventory/${id}`;
    } catch (error) {
      console.error('保存产品失败:', error);
      setError('保存失败，请重试');
    } finally {
      setSaving(false);
    }
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
  
  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div className="flex items-center space-x-2">
        <Link 
          href={isNewProduct ? '/admin/inventory' : `/admin/inventory/${id}`}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNewProduct ? '添加产品' : `编辑产品: ${formData.name}`}
        </h1>
      </div>
      
      {/* 表单内容 */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* 分页标签 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              className={`${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } py-4 px-1 border-b-2 font-medium text-sm focus:outline-none flex items-center`}
              onClick={() => setActiveTab('basic')}
            >
              <InformationCircleIcon className="mr-2 h-5 w-5" />
              基本信息
            </button>
            <button
              type="button"
              className={`${
                activeTab === 'price'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } py-4 px-1 border-b-2 font-medium text-sm focus:outline-none flex items-center`}
              onClick={() => setActiveTab('price')}
            >
              <BanknotesIcon className="mr-2 h-5 w-5" />
              价格库存
            </button>
            <button
              type="button"
              className={`${
                activeTab === 'specs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } py-4 px-1 border-b-2 font-medium text-sm focus:outline-none flex items-center`}
              onClick={() => setActiveTab('specs')}
            >
              <TagIcon className="mr-2 h-5 w-5" />
              规格属性
            </button>
            <button
              type="button"
              className={`${
                activeTab === 'images'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } py-4 px-1 border-b-2 font-medium text-sm focus:outline-none flex items-center`}
              onClick={() => setActiveTab('images')}
            >
              <PhotoIcon className="mr-2 h-5 w-5" />
              产品图片
            </button>
          </nav>
        </div>
        
        {/* 基本信息标签 */}
        {activeTab === 'basic' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  产品名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  品牌
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                  分类 <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">选择分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">
                  供应商
                </label>
                <select
                  id="supplierId"
                  name="supplierId"
                  value={formData.supplierId || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">选择供应商</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  状态 <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value={ProductStatus.ACTIVE}>正常销售</option>
                  <option value={ProductStatus.OUT_OF_STOCK}>缺货中</option>
                  <option value={ProductStatus.DISCONTINUED}>已停产</option>
                  <option value={ProductStatus.COMING_SOON}>即将上市</option>
                </select>
              </div>
              
              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  产品描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* 价格库存标签 */}
        {activeTab === 'price' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">
                  成本价 (元)
                </label>
                <input
                  type="number"
                  id="costPrice"
                  name="costPrice"
                  min="0"
                  step="0.01"
                  value={formData.costPrice || 0}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  销售价 (元) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price || 0}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
                  促销价 (元)
                </label>
                <input
                  type="number"
                  id="salePrice"
                  name="salePrice"
                  min="0"
                  step="0.01"
                  value={formData.salePrice || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
                  库存数量 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  min="0"
                  step="1"
                  value={formData.stockQuantity || 0}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="minStock" className="block text-sm font-medium text-gray-700">
                  库存警戒线
                </label>
                <input
                  type="number"
                  id="minStock"
                  name="minStock"
                  min="0"
                  step="1"
                  value={formData.minStock || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">当库存低于此数量时将发出警告</p>
              </div>
              
              {/* 价格利润计算 */}
              <div className="col-span-2 mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2">价格利润计算</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">成本价</p>
                    <p className="font-medium">¥{formData.costPrice || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">销售价</p>
                    <p className="font-medium">¥{formData.price || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">预计利润</p>
                    <p className="font-medium text-green-600">
                      ¥{(formData.price || 0) - (formData.costPrice || 0)} 
                      ({formData.costPrice && formData.price 
                        ? Math.round(((formData.price - formData.costPrice) / formData.price) * 100) 
                        : 0}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 规格属性标签 */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            {/* 规格 */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">规格</h2>
                <button
                  type="button"
                  onClick={addSpecField}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  添加规格
                </button>
              </div>
              
              {specKeys.map((key, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 mb-4">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="规格名称"
                      value={key}
                      onChange={(e) => handleSpecKeyChange(index, e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="规格值"
                      value={specValues[index] || ''}
                      onChange={(e) => handleSpecValueChange(index, e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeSpecField(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
              
              {specKeys.length === 0 && (
                <p className="text-sm text-gray-500">暂无规格信息，点击"添加规格"按钮添加产品规格</p>
              )}
            </div>
            
            {/* 属性 */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">属性</h2>
                <button
                  type="button"
                  onClick={addAttrField}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  添加属性
                </button>
              </div>
              
              {attrKeys.map((key, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 mb-4">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="属性名称"
                      value={key}
                      onChange={(e) => handleAttrKeyChange(index, e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="属性值"
                      value={attrValues[index] || ''}
                      onChange={(e) => handleAttrValueChange(index, e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeAttrField(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
              
              {attrKeys.length === 0 && (
                <p className="text-sm text-gray-500">暂无属性信息，点击"添加属性"按钮添加产品属性</p>
              )}
            </div>
          </div>
        )}
        
        {/* 图片标签 */}
        {activeTab === 'images' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">产品图片</h2>
            
            {/* 上传图片区域 */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">点击上传</span> 或拖拽图片到此处
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF 等格式</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageUpload}
                  />
                </label>
                
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="h-32 flex-shrink-0 inline-flex flex-col items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <DocumentDuplicateIcon className="w-6 h-6 text-gray-400 mb-2" />
                  <span>粘贴图片URL</span>
                </button>
              </div>
            </div>
            
            {/* 图片预览区域 */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">已上传图片 ({(formData.images || []).length})</h3>
              
              {(formData.images || []).length === 0 ? (
                <p className="text-sm text-gray-500">尚未上传任何图片</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {(formData.images || []).map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                        <img 
                          src={image} 
                          alt={`产品图片 ${index + 1}`} 
                          className="object-cover object-center" 
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1.5 bg-red-600 rounded-full text-white hover:bg-red-700 focus:outline-none"
                            title="删除图片"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 truncate">图片 {index + 1}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* 表单操作 */}
        <div className="flex justify-end space-x-3">
          <Link
            href={isNewProduct ? '/admin/inventory' : `/admin/inventory/${id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
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
              '保存产品'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(ProductEditPage, Permission.MANAGE_SETTINGS); 