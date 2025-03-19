'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import { Category } from '@/lib/inventory/inventory-model';
import { useCategories } from '@/lib/categories/CategoryContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon,
  FolderIcon,
  TagIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

function CategoriesPage() {
  const router = useRouter();
  const { categories, toggleHomepageVisibility } = useCategories();
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    parentId: '',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [draggedCategory, setDraggedCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('tree');
  const [batchActionModalOpen, setBatchActionModalOpen] = useState(false);
  
  // 应用筛选器到分类
  useEffect(() => {
    setLoading(true);
    
    // 应用筛选器
    let filtered = [...categories];
    
    if (filters.name) {
      filtered = filtered.filter(category => 
        category.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.parentId) {
      if (filters.parentId === 'none') {
        filtered = filtered.filter(category => !category.parentId);
      } else {
        filtered = filtered.filter(category => 
          category.parentId === filters.parentId
        );
      }
    }
    
    setFilteredCategories(filtered);
    setLoading(false);
  }, [categories, filters]);

  // 应用筛选
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    // 当应用筛选器的时候，这里不再需要loadCategories，只需设置filters，将在useEffect中应用
    setIsFilterOpen(false);
  };

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({
      name: '',
      parentId: '',
    });
  };

  // Toggle category expansion
  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Toggle category selection
  const toggleSelect = (e: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    e.stopPropagation();
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  // Select all categories
  const selectAll = () => {
    if (selectedCategories.size === filteredCategories.length) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories(new Set(filteredCategories.map(c => c.id)));
    }
  };

  // 切换分类在主页的显示状态
  const handleToggleHomepageVisibility = (category: Category) => {
    toggleHomepageVisibility(category.id);
    console.log(`分类 "${category.name}" 在主页显示状态已更改为: ${!category.showOnHomepage}`);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (category: Category, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  // Delete category - 这个部分先保留原样，后续可实现真实的删除功能
  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if category has children
      const hasChildren = categories.some(cat => cat.parentId === selectedCategory.id);
      if (hasChildren) {
        alert('无法删除此分类，因为它包含子分类。请先删除所有子分类。');
        setDeleteModalOpen(false);
        return;
      }
      
      // Filter out the deleted category - 实际应用中这里应调用API
      setFilteredCategories(filteredCategories.filter(category => category.id !== selectedCategory.id));
      setDeleteModalOpen(false);
      setSelectedCategory(null);
      
      // Success message
      alert(`分类 ${selectedCategory.name} 已删除`);
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('删除分类失败，请重试');
    }
  };

  // Get parent category name
  const getParentName = (parentId?: string): string => {
    if (!parentId) return '顶级分类';
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : '未知分类';
  };

  // Handle drag start
  const handleDragStart = (category: Category, e: React.DragEvent) => {
    setIsDragging(true);
    setDraggedCategory(category);
    e.dataTransfer.setData('text/plain', category.id);
    // Use a ghost image that makes it more obvious what's being dragged
    const ghost = document.createElement('div');
    ghost.classList.add('bg-blue-100', 'p-2', 'rounded', 'border', 'border-blue-300');
    ghost.textContent = category.name;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  // Handle drag over
  const handleDragOver = (category: Category, e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50');
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-50');
  };

  // Handle drop
  const handleDrop = (targetCategory: Category | null, e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50');
    
    if (!draggedCategory) return;
    
    const sourceId = draggedCategory.id;
    const targetId = targetCategory?.id;
    
    // Can't drop onto itself
    if (sourceId === targetId) return;
    
    // Can't drop onto its own child (prevent circular references)
    if (targetId) {
      let current = targetCategory;
      while (current?.parentId) {
        if (current.parentId === sourceId) {
          alert('无法将分类移动到其子分类中');
          return;
        }
        current = categories.find(c => c.id === current?.parentId);
      }
    }
    
    // Update the category's parent
    const updatedCategories = categories.map(cat => {
      if (cat.id === sourceId) {
        return { ...cat, parentId: targetId };
      }
      return cat;
    });
    
    setFilteredCategories(updatedCategories);
    setIsDragging(false);
    setDraggedCategory(null);
    
    // Expand the target category if it's a drop target
    if (targetId) {
      setExpandedCategories(prev => new Set([...prev, targetId]));
    }
  };

  // Handle drop on root (to make a top-level category)
  const handleDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedCategory) return;
    
    // Update the category to be a top-level category
    const updatedCategories = categories.map(cat => {
      if (cat.id === draggedCategory.id) {
        return { ...cat, parentId: undefined };
      }
      return cat;
    });
    
    setFilteredCategories(updatedCategories);
    setIsDragging(false);
    setDraggedCategory(null);
  };

  // Build tree structure for rendering
  const buildCategoryTree = () => {
    const topLevelCategories = filteredCategories.filter(cat => !cat.parentId);
    
    const buildTree = (category: Category) => {
      const children = filteredCategories.filter(cat => cat.parentId === category.id);
      return {
        ...category,
        children: children.map(buildTree)
      };
    };
    
    return topLevelCategories.map(buildTree);
  };

  // Recursive rendering of category tree
  const renderCategoryTree = (
    category: Category & { children?: (Category & { children?: any })[] },
    depth = 0
  ) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    
    return (
      <div key={category.id} className="category-tree-item">
        <div 
          className={`flex items-center p-2 hover:bg-gray-50 ${depth > 0 ? 'ml-' + (depth * 4) : ''} 
                      ${isDragging ? 'cursor-move' : 'cursor-pointer'}`}
          onClick={() => toggleExpand(category.id)}
          draggable={isDragging}
          onDragStart={(e) => handleDragStart(category, e)}
          onDragOver={(e) => handleDragOver(category, e)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(category, e)}
        >
          <div className="flex items-center flex-1">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-blue-600 rounded"
              checked={selectedCategories.has(category.id)}
              onChange={(e) => toggleSelect(e, category.id)}
              onClick={(e) => e.stopPropagation()}
            />
            
            {hasChildren ? (
              <button 
                className="mr-1 p-1 hover:bg-gray-200 rounded-md"
                onClick={(e) => { e.stopPropagation(); toggleExpand(category.id); }}
              >
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>
            ) : (
              <span className="ml-6"></span>
            )}
            
            {category.parentId ? (
              <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
            ) : (
              <FolderIcon className="h-5 w-5 text-blue-500 mr-2" />
            )}
            
            <span className="font-medium">{category.name}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="text-xs text-gray-400 mr-2">
              {category.children?.length || 0} 个子分类
            </span>
            
            <label className="relative inline-flex items-center cursor-pointer mr-2" title="显示在主页">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={category.showOnHomepage || false}
                onChange={(e) => {
                  e.stopPropagation();
                  handleToggleHomepageVisibility(category);
                }}
              />
              <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer 
                ${category.showOnHomepage ? 'peer-checked:bg-blue-600' : ''}
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 
                after:transition-all ${category.showOnHomepage ? 'peer-checked:after:translate-x-full' : ''}`}>
              </div>
            </label>
            
            <Link
              href={`/admin/categories/edit?id=${category.id}`}
              className="p-1.5 hover:bg-gray-200 rounded-md"
              onClick={(e) => e.stopPropagation()}
            >
              <PencilIcon className="h-4 w-4" />
            </Link>
            
            <button
              onClick={(e) => handleDeleteClick(category, e)}
              className="p-1.5 hover:bg-gray-200 rounded-md"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="category-children">
            {category.children!.map(child => renderCategoryTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const categoryTree = buildCategoryTree();

  // 批量删除选定分类
  const handleBatchDelete = async () => {
    try {
      // 检查是否有任何选定的分类有子分类
      const hasChildren = categories.some(cat => 
        selectedCategories.has(cat.id) && 
        categories.some(child => child.parentId === cat.id)
      );
      
      if (hasChildren) {
        alert('无法删除包含子分类的分类。请先删除所有子分类。');
        return;
      }
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 删除操作 - 在实际应用中应调用API
      // 这里暂时模拟操作
      setFilteredCategories(prev => prev.filter(category => !selectedCategories.has(category.id)));
      
      // 清除选择
      setSelectedCategories(new Set());
      setBatchActionModalOpen(false);
      
      // 显示成功信息
      alert(`已删除 ${selectedCategories.size} 个分类`);
    } catch (error) {
      console.error('删除分类失败:', error);
      alert('批量删除失败，请重试');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLoading(true)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md"
            title="刷新"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            添加分类
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
              placeholder="搜索分类名称..."
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && setLoading(true)}
            />
          </div>

          <div className="flex space-x-2">
            <div className="flex border border-gray-300 rounded-md">
              <button
                type="button"
                className={`px-3 py-2 text-sm leading-4 font-medium ${
                  viewMode === 'tree' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } rounded-l-md focus:outline-none`}
                onClick={() => setViewMode('tree')}
              >
                树形视图
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm leading-4 font-medium ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } rounded-r-md focus:outline-none`}
                onClick={() => setViewMode('list')}
              >
                列表视图
              </button>
            </div>
            
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FunnelIcon className="-ml-0.5 mr-2 h-4 w-4" />
              筛选
            </button>
            
            {selectedCategories.size > 0 && (
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                onClick={() => setBatchActionModalOpen(true)}
              >
                批量操作 ({selectedCategories.size})
              </button>
            )}
          </div>
        </div>

        {/* Filter panel */}
        {isFilterOpen && (
          <div className="mt-4 border-t pt-4">
            <form onSubmit={handleApplyFilters} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
                  父级分类
                </label>
                <select
                  id="parentId"
                  name="parentId"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.parentId}
                  onChange={(e) => setFilters({ ...filters, parentId: e.target.value })}
                >
                  <option value="">所有分类</option>
                  <option value="none">仅顶级分类</option>
                  {categories
                    .filter(cat => !cat.parentId)
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}的子分类</option>
                    ))
                  }
                </select>
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

      {/* Categories content */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="py-6 px-4 text-center text-gray-500">加载中...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-6 px-4 text-center text-gray-500">没有找到匹配的分类</div>
        ) : (
          <div className="p-4">
            {/* Tree View */}
            {viewMode === 'tree' && (
              <div 
                className="category-tree border rounded-md"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropOnRoot}
              >
                <div className="flex items-center p-3 bg-gray-50 border-b">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 text-blue-600 rounded"
                    checked={selectedCategories.size === filteredCategories.length}
                    onChange={selectAll}
                  />
                  <span className="font-medium">所有分类</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {selectedCategories.size > 0 && `(已选择 ${selectedCategories.size} 项)`}
                  </span>
                  <div className="ml-auto flex items-center text-sm">
                    <button 
                      className="text-blue-600 hover:text-blue-800 mr-4 flex items-center" 
                      onClick={() => setExpandedCategories(new Set(filteredCategories.map(c => c.id)))}
                    >
                      <ChevronDownIcon className="h-4 w-4 mr-1" />
                      展开全部
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                      onClick={() => setExpandedCategories(new Set())}
                    >
                      <ChevronUpIcon className="h-4 w-4 mr-1" />
                      收起全部
                    </button>
                  </div>
                </div>
                
                {categoryTree.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">没有找到分类</div>
                ) : (
                  <div className="category-tree-content">
                    {categoryTree.map(category => renderCategoryTree(category))}
                  </div>
                )}
              </div>
            )}
            
            {/* List View */}
            {viewMode === 'list' && (
              <div className="overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-6">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded"
                          checked={selectedCategories.size === filteredCategories.length}
                          onChange={selectAll}
                        />
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        分类名称
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        父级分类
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        子分类数量
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        描述
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        显示在主页
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCategories.map((category) => {
                      const childrenCount = filteredCategories.filter(c => c.parentId === category.id).length;
                      
                      return (
                        <tr 
                          key={category.id}
                          className="hover:bg-gray-50"
                          draggable={isDragging}
                          onDragStart={(e) => handleDragStart(category, e)}
                          onDragOver={(e) => handleDragOver(category, e)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(category, e)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap w-6">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 rounded"
                              checked={selectedCategories.has(category.id)}
                              onChange={(e) => toggleSelect(e, category.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {category.parentId ? (
                                <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
                              ) : (
                                <FolderIcon className="h-5 w-5 text-blue-500 mr-2" />
                              )}
                              <div className="ml-2">
                                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                <div className="text-xs text-gray-500">ID: {category.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{getParentName(category.parentId)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{childrenCount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {category.description || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <label className="inline-flex relative items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={category.showOnHomepage || false}
                                  onChange={(e) => handleToggleHomepageVisibility(category)}
                                />
                                <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                                  ${category.showOnHomepage ? 'peer-checked:bg-blue-600' : ''}
                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                                  after:transition-all ${category.showOnHomepage ? 'peer-checked:after:translate-x-full' : ''}`}>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link
                                href={`/admin/categories/edit?id=${category.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(category)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      删除分类
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        确定要删除分类 "{selectedCategory?.name}" 吗？此操作无法撤销。
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

      {/* Batch action modal */}
      {batchActionModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      批量操作 ({selectedCategories.size} 个分类)
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        onClick={handleBatchDelete}
                      >
                        <TrashIcon className="h-5 w-5 text-red-500 mr-2" />
                        删除选中分类
                      </button>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        onClick={() => {
                          setBatchActionModalOpen(false);
                          // 导出逻辑，示例中仅关闭弹窗
                        }}
                      >
                        <DocumentDuplicateIcon className="h-5 w-5 text-green-500 mr-2" />
                        导出选中分类
                      </button>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        onClick={() => {
                          setBatchActionModalOpen(false);
                          // 移动逻辑，示例中仅关闭弹窗
                        }}
                      >
                        <ArrowsUpDownIcon className="h-5 w-5 text-blue-500 mr-2" />
                        移动选中分类
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setBatchActionModalOpen(false)}
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

// ExclamationIcon component for the modal
function ExclamationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

export default withAuth(CategoriesPage, Permission.MANAGE_CONTENT); 