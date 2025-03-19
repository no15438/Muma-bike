'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

// 从内容管理中导入模拟文章数据
const mockArticles = [
  {
    id: 'article1',
    title: '2024年最新自行车装备推荐',
    content: '随着2024年的到来，自行车装备市场也迎来了一波新品，本文将为您推荐几款值得购买的高性价比装备...',
    author: '张小明',
    publishDate: '2024-03-01',
    category: '装备推荐',
    tags: ['装备', '2024新品', '推荐'],
    imageUrl: '/images/articles/gear2024.jpg',
    isPublished: true
  },
  {
    id: 'article2',
    title: '初学者自行车保养指南',
    content: '对于刚接触自行车的新手来说，正确的保养习惯能够延长爱车的使用寿命，本文将从清洁、润滑、调整三个方面详细介绍...',
    author: '李维修',
    publishDate: '2024-02-15',
    category: '保养维修',
    tags: ['保养', '新手指南', '维修'],
    imageUrl: '/images/articles/maintenance.jpg',
    isPublished: true
  },
  {
    id: 'article3',
    title: '2024春季骑行路线精选',
    content: '春暖花开，正是骑行的好时节。本文为大家推荐几条风景优美、难度适中的春季骑行路线...',
    author: '王旅行',
    publishDate: '2024-03-10',
    category: '骑行路线',
    tags: ['骑行路线', '春季', '户外'],
    imageUrl: '/images/articles/spring-routes.jpg',
    isPublished: true
  }
];

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [articles, setArticles] = useState(mockArticles.filter(article => article.isPublished));
  
  // 获取所有分类
  const categories = Array.from(new Set(articles.map(article => article.category)));
  
  // 按分类筛选文章
  const filterByCategory = (category: string | null) => {
    setSelectedCategory(category);
    if (category === null) {
      setArticles(mockArticles.filter(article => article.isPublished));
    } else {
      setArticles(mockArticles.filter(article => article.isPublished && article.category === category));
    }
  };
  
  return (
    <main className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">文章专栏</h1>
        <p className="text-gray-600">探索骑行世界的最新资讯、骑行技巧和装备评测</p>
      </div>
      
      {/* 分类筛选 */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="text-gray-700 font-medium">分类：</span>
        <button
          onClick={() => filterByCategory(null)}
          className={`px-3 py-1 text-sm rounded-full ${
            selectedCategory === null 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => filterByCategory(category)}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedCategory === category 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <Link key={article.id} href={`/articles/${article.id}`} className="group">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="relative h-48 bg-gray-100">
                {/* 暂时用颜色块代替图片 */}
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                  {article.imageUrl ? '图片: ' + article.title : '无图片'}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">{article.publishDate}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {article.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">作者: {article.author}</span>
                  <span className="text-primary text-sm font-medium">阅读更多</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {articles.length === 0 && (
        <div className="py-12 text-center bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">暂无相关文章</h3>
          <p className="text-gray-600">请尝试选择其他分类，或稍后再查看</p>
        </div>
      )}
    </main>
  );
} 