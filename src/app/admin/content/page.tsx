'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// 模拟数据 - 文章
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
    isPublished: false
  }
]

// 模拟数据 - 公告
const mockAnnouncements = [
  {
    id: 'announcement1',
    title: '五一假期营业时间调整公告',
    content: '尊敬的顾客，应商场管理要求，五一假期期间（5月1日至5月5日）本店营业时间调整为10:00-21:00，敬请知悉。',
    publishDate: '2024-04-25',
    expireDate: '2024-05-06',
    priority: 'high',
    isActive: true
  },
  {
    id: 'announcement2',
    title: '新品到店：Giant 2024款公路车系列',
    content: 'Giant 2024款全新公路车系列已经到店，欢迎各位车友前来体验试骑！',
    publishDate: '2024-03-20',
    expireDate: '2024-04-20',
    priority: 'medium',
    isActive: true
  },
  {
    id: 'announcement3',
    title: '会员积分规则调整通知',
    content: '自2024年4月1日起，本店会员积分规则将进行调整，每消费1元累计1积分，积分可用于兑换礼品或抵扣消费。',
    publishDate: '2024-03-15',
    expireDate: '2024-04-15',
    priority: 'low',
    isActive: false
  }
]

// 模拟数据 - 图片库
const mockImages = [
  {
    id: 'image1',
    title: '首页轮播图1',
    url: '/images/banner/banner1.jpg',
    uploadDate: '2024-01-15',
    size: '1920x600',
    fileSize: '350KB',
    category: 'banner',
    alt: '春季促销活动'
  },
  {
    id: 'image2',
    title: '首页轮播图2',
    url: '/images/banner/banner2.jpg',
    uploadDate: '2024-01-15',
    size: '1920x600',
    fileSize: '420KB',
    category: 'banner',
    alt: '新品上市'
  },
  {
    id: 'image3',
    title: '品牌Logo - Giant',
    url: '/images/brands/giant.png',
    uploadDate: '2023-12-10',
    size: '300x200',
    fileSize: '45KB',
    category: 'logo',
    alt: 'Giant品牌logo'
  },
  {
    id: 'image4',
    title: '品牌Logo - Trek',
    url: '/images/brands/trek.png',
    uploadDate: '2023-12-10',
    size: '300x200',
    fileSize: '42KB',
    category: 'logo',
    alt: 'Trek品牌logo'
  },
  {
    id: 'image5',
    title: '维修服务图片',
    url: '/images/services/repair.jpg',
    uploadDate: '2024-02-20',
    size: '800x600',
    fileSize: '250KB',
    category: 'service',
    alt: '专业维修服务'
  }
]

export default function ContentManagementPage() {
  const [selectedTab, setSelectedTab] = useState<'articles' | 'announcements' | 'images' | 'categories'>('articles')
  const [articles, setArticles] = useState(mockArticles)
  const [announcements, setAnnouncements] = useState(mockAnnouncements)
  const [images, setImages] = useState(mockImages)
  
  // 文章相关状态
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)
  const [articleForm, setArticleForm] = useState({
    id: '',
    title: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    imageUrl: '',
    isPublished: true
  })
  
  // 公告相关状态
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<string | null>(null)
  const [announcementForm, setAnnouncementForm] = useState({
    id: '',
    title: '',
    content: '',
    priority: 'medium',
    isActive: true,
    publishDate: '',
    expireDate: ''
  })
  
  // 图片相关状态
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageForm, setImageForm] = useState({
    id: '',
    title: '',
    url: '',
    category: '',
    alt: ''
  })
  
  // 当选择文章时
  const handleSelectArticle = (articleId: string) => {
    const article = articles.find(a => a.id === articleId)
    if (article) {
      setSelectedArticle(articleId)
      setArticleForm({
        id: article.id,
        title: article.title,
        content: article.content,
        author: article.author,
        category: article.category,
        tags: article.tags.join(', '),
        imageUrl: article.imageUrl,
        isPublished: article.isPublished
      })
    }
  }
  
  // 当选择公告时
  const handleSelectAnnouncement = (announcementId: string) => {
    const announcement = announcements.find(a => a.id === announcementId)
    if (announcement) {
      setSelectedAnnouncement(announcementId)
      setAnnouncementForm({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        isActive: announcement.isActive,
        publishDate: announcement.publishDate,
        expireDate: announcement.expireDate
      })
    }
  }
  
  // 当选择图片时
  const handleSelectImage = (imageId: string) => {
    const image = images.find(i => i.id === imageId)
    if (image) {
      setSelectedImage(imageId)
      setImageForm({
        id: image.id,
        title: image.title,
        url: image.url,
        category: image.category,
        alt: image.alt
      })
    }
  }
  
  // 保存文章
  const handleSaveArticle = () => {
    if (!articleForm.title || !articleForm.content) {
      alert('请填写文章标题和内容')
      return
    }
    
    if (selectedArticle) {
      // 更新现有文章
      setArticles(articles.map(article => 
        article.id === selectedArticle 
          ? {
              ...article,
              title: articleForm.title,
              content: articleForm.content,
              author: articleForm.author,
              category: articleForm.category,
              tags: articleForm.tags.split(',').map(tag => tag.trim()),
              imageUrl: articleForm.imageUrl,
              isPublished: articleForm.isPublished
            }
          : article
      ))
      alert('文章更新成功')
    } else {
      // 添加新文章
      const newArticle = {
        id: `article${Date.now()}`,
        title: articleForm.title,
        content: articleForm.content,
        author: articleForm.author,
        publishDate: new Date().toISOString().split('T')[0],
        category: articleForm.category,
        tags: articleForm.tags.split(',').map(tag => tag.trim()),
        imageUrl: articleForm.imageUrl,
        isPublished: articleForm.isPublished
      }
      setArticles([...articles, newArticle])
      alert('文章添加成功')
    }
    
    // 重置表单
    resetArticleForm()
  }
  
  // 保存公告
  const handleSaveAnnouncement = () => {
    if (!announcementForm.title || !announcementForm.content) {
      alert('请填写公告标题和内容')
      return
    }
    
    if (selectedAnnouncement) {
      // 更新现有公告
      setAnnouncements(announcements.map(announcement => 
        announcement.id === selectedAnnouncement 
          ? {
              ...announcement,
              title: announcementForm.title,
              content: announcementForm.content,
              priority: announcementForm.priority,
              isActive: announcementForm.isActive,
              publishDate: announcementForm.publishDate,
              expireDate: announcementForm.expireDate
            }
          : announcement
      ))
      alert('公告更新成功')
    } else {
      // 添加新公告
      const newAnnouncement = {
        id: `announcement${Date.now()}`,
        title: announcementForm.title,
        content: announcementForm.content,
        priority: announcementForm.priority,
        isActive: announcementForm.isActive,
        publishDate: announcementForm.publishDate || new Date().toISOString().split('T')[0],
        expireDate: announcementForm.expireDate
      }
      setAnnouncements([...announcements, newAnnouncement])
      alert('公告添加成功')
    }
    
    // 重置表单
    resetAnnouncementForm()
  }
  
  // 保存图片
  const handleSaveImage = () => {
    if (!imageForm.title || !imageForm.url) {
      alert('请填写图片标题和URL')
      return
    }
    
    if (selectedImage) {
      // 更新现有图片
      setImages(images.map(image => 
        image.id === selectedImage 
          ? {
              ...image,
              title: imageForm.title,
              url: imageForm.url,
              category: imageForm.category,
              alt: imageForm.alt
            }
          : image
      ))
      alert('图片信息更新成功')
    } else {
      // 添加新图片
      const newImage = {
        id: `image${Date.now()}`,
        title: imageForm.title,
        url: imageForm.url,
        uploadDate: new Date().toISOString().split('T')[0],
        size: '待定',
        fileSize: '待定',
        category: imageForm.category,
        alt: imageForm.alt
      }
      setImages([...images, newImage])
      alert('图片添加成功')
    }
    
    // 重置表单
    resetImageForm()
  }
  
  // 重置文章表单
  const resetArticleForm = () => {
    setSelectedArticle(null)
    setArticleForm({
      id: '',
      title: '',
      content: '',
      author: '',
      category: '',
      tags: '',
      imageUrl: '',
      isPublished: true
    })
  }
  
  // 重置公告表单
  const resetAnnouncementForm = () => {
    setSelectedAnnouncement(null)
    setAnnouncementForm({
      id: '',
      title: '',
      content: '',
      priority: 'medium',
      isActive: true,
      publishDate: '',
      expireDate: ''
    })
  }
  
  // 重置图片表单
  const resetImageForm = () => {
    setSelectedImage(null)
    setImageForm({
      id: '',
      title: '',
      url: '',
      category: '',
      alt: ''
    })
  }
  
  // 删除文章
  const handleDeleteArticle = (articleId: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      setArticles(articles.filter(article => article.id !== articleId))
      if (selectedArticle === articleId) {
        resetArticleForm()
      }
    }
  }
  
  // 删除公告
  const handleDeleteAnnouncement = (announcementId: string) => {
    if (confirm('确定要删除这条公告吗？')) {
      setAnnouncements(announcements.filter(announcement => announcement.id !== announcementId))
      if (selectedAnnouncement === announcementId) {
        resetAnnouncementForm()
      }
    }
  }
  
  // 删除图片
  const handleDeleteImage = (imageId: string) => {
    if (confirm('确定要删除这张图片吗？')) {
      setImages(images.filter(image => image.id !== imageId))
      if (selectedImage === imageId) {
        resetImageForm()
      }
    }
  }
  
  // 渲染文章管理选项卡
  const renderArticlesTab = () => {
    return (
      <div className="flex flex-col md:flex-row gap-6">
        {/* 文章列表 */}
        <div className="w-full md:w-2/5">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">文章列表</h2>
            <button 
              onClick={resetArticleForm} 
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              新建文章
            </button>
          </div>
          
          <div className="space-y-3 overflow-auto max-h-[70vh]">
            {articles.map(article => (
              <div 
                key={article.id} 
                className={`border rounded p-3 cursor-pointer ${selectedArticle === article.id ? 'border-primary border-2' : ''}`}
                onClick={() => handleSelectArticle(article.id)}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{article.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs ${article.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {article.isPublished ? '已发布' : '草稿'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.content}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>{article.author}</span>
                  <span>{article.publishDate}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{article.category}</span>
                  {article.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-blue-50 px-2 py-0.5 rounded ml-1">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mt-3 flex justify-end">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteArticle(article.id);
                    }}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
            
            {articles.length === 0 && (
              <p className="text-gray-500 text-center py-4">暂无文章</p>
            )}
          </div>
        </div>
        
        {/* 文章编辑表单 */}
        <div className="w-full md:w-3/5">
          <h2 className="text-xl font-semibold mb-4">
            {selectedArticle ? '编辑文章' : '新建文章'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">文章标题 *</label>
              <input 
                type="text" 
                value={articleForm.title}
                onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="输入文章标题"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">文章内容 *</label>
              <textarea 
                value={articleForm.content}
                onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                className="w-full p-2 border rounded min-h-[200px]"
                placeholder="输入文章内容"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">作者</label>
                <input 
                  type="text" 
                  value={articleForm.author}
                  onChange={(e) => setArticleForm({...articleForm, author: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="输入作者名称"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">分类</label>
                <input 
                  type="text" 
                  value={articleForm.category}
                  onChange={(e) => setArticleForm({...articleForm, category: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="输入文章分类"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">标签（多个标签用逗号分隔）</label>
              <input 
                type="text" 
                value={articleForm.tags}
                onChange={(e) => setArticleForm({...articleForm, tags: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="例如：骑行, 装备, 新品"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">封面图片URL</label>
              <input 
                type="text" 
                value={articleForm.imageUrl}
                onChange={(e) => setArticleForm({...articleForm, imageUrl: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="输入图片URL"
              />
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="isPublished"
                checked={articleForm.isPublished}
                onChange={(e) => setArticleForm({...articleForm, isPublished: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isPublished">发布文章</label>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={handleSaveArticle}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600"
              >
                保存
              </button>
              <button 
                onClick={resetArticleForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // 渲染公告管理选项卡
  const renderAnnouncementsTab = () => {
    return (
      <div className="flex flex-col md:flex-row gap-6">
        {/* 公告列表 */}
        <div className="w-full md:w-2/5">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">公告列表</h2>
            <button 
              onClick={resetAnnouncementForm} 
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              新建公告
            </button>
          </div>
          
          <div className="space-y-3 overflow-auto max-h-[70vh]">
            {announcements.map(announcement => (
              <div 
                key={announcement.id} 
                className={`border rounded p-3 cursor-pointer ${selectedAnnouncement === announcement.id ? 'border-primary border-2' : ''}`}
                onClick={() => handleSelectAnnouncement(announcement.id)}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{announcement.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    announcement.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {announcement.isActive ? '已激活' : '已停用'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcement.content}</p>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>开始日期: {announcement.publishDate}</span>
                  <span>结束日期: {announcement.expireDate}</span>
                </div>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                    announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {announcement.priority === 'high' ? '高优先级' :
                     announcement.priority === 'medium' ? '中优先级' : '低优先级'}
                  </span>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAnnouncement(announcement.id);
                    }}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
            
            {announcements.length === 0 && (
              <p className="text-gray-500 text-center py-4">暂无公告</p>
            )}
          </div>
        </div>
        
        {/* 公告编辑表单 */}
        <div className="w-full md:w-3/5">
          <h2 className="text-xl font-semibold mb-4">
            {selectedAnnouncement ? '编辑公告' : '新建公告'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">公告标题 *</label>
              <input 
                type="text" 
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="输入公告标题"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">公告内容 *</label>
              <textarea 
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                className="w-full p-2 border rounded min-h-[150px]"
                placeholder="输入公告内容"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">开始日期</label>
                <input 
                  type="date" 
                  value={announcementForm.publishDate}
                  onChange={(e) => setAnnouncementForm({...announcementForm, publishDate: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">结束日期</label>
                <input 
                  type="date" 
                  value={announcementForm.expireDate}
                  onChange={(e) => setAnnouncementForm({...announcementForm, expireDate: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">优先级</label>
              <select 
                value={announcementForm.priority}
                onChange={(e) => setAnnouncementForm({...announcementForm, priority: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="high">高优先级</option>
                <option value="medium">中优先级</option>
                <option value="low">低优先级</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="isActive"
                checked={announcementForm.isActive}
                onChange={(e) => setAnnouncementForm({...announcementForm, isActive: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isActive">激活公告</label>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={handleSaveAnnouncement}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600"
              >
                保存
              </button>
              <button 
                onClick={resetAnnouncementForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // 渲染图片管理选项卡
  const renderImagesTab = () => {
    return (
      <div className="flex flex-col md:flex-row gap-6">
        {/* 图片列表 */}
        <div className="w-full md:w-2/5">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">图片库</h2>
            <button 
              onClick={resetImageForm} 
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              添加图片
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 overflow-auto max-h-[70vh]">
            {images.map(image => (
              <div 
                key={image.id} 
                className={`border rounded p-2 cursor-pointer ${selectedImage === image.id ? 'border-primary border-2' : ''}`}
                onClick={() => handleSelectImage(image.id)}
              >
                <div className="relative w-full h-32 bg-gray-100 mb-2">
                  {/* <Image
                    src={image.url}
                    alt={image.alt || image.title}
                    fill
                    className="object-contain"
                  /> */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    [图片预览：{image.title}]
                  </div>
                </div>
                
                <h4 className="font-medium text-sm truncate">{image.title}</h4>
                <p className="text-xs text-gray-500 mb-1">类型: {image.category}</p>
                <p className="text-xs text-gray-500">上传时间: {image.uploadDate}</p>
                
                <div className="mt-2 flex justify-end">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.id);
                    }}
                    className="px-2 py-0.5 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
            
            {images.length === 0 && (
              <p className="text-gray-500 text-center py-4 col-span-2">图片库为空</p>
            )}
          </div>
        </div>
        
        {/* 图片编辑表单 */}
        <div className="w-full md:w-3/5">
          <h2 className="text-xl font-semibold mb-4">
            {selectedImage ? '编辑图片信息' : '添加新图片'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">图片标题 *</label>
              <input 
                type="text" 
                value={imageForm.title}
                onChange={(e) => setImageForm({...imageForm, title: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="输入图片标题"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">图片URL *</label>
              <input 
                type="text" 
                value={imageForm.url}
                onChange={(e) => setImageForm({...imageForm, url: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="输入图片URL"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">图片分类</label>
              <select 
                value={imageForm.category}
                onChange={(e) => setImageForm({...imageForm, category: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="">-- 选择分类 --</option>
                <option value="banner">轮播图</option>
                <option value="logo">品牌Logo</option>
                <option value="product">产品图片</option>
                <option value="service">服务图片</option>
                <option value="article">文章配图</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">替代文本 (Alt)</label>
              <input 
                type="text" 
                value={imageForm.alt}
                onChange={(e) => setImageForm({...imageForm, alt: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="输入图片的替代文本，有助于SEO和无障碍访问"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">上传新图片</label>
              <div className="border-dashed border-2 border-gray-300 rounded p-4 text-center">
                <p className="text-sm text-gray-500 mb-2">点击选择图片或拖放图片到这里</p>
                <input 
                  type="file" 
                  accept="image/*"
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-2">支持JPG、PNG格式，大小不超过2MB</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={handleSaveImage}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600"
              >
                保存
              </button>
              <button 
                onClick={resetImageForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // 渲染内容分类管理选项卡
  const renderCategoriesTab = () => {
    // 收集所有分类
    const articleCategories = [...new Set(articles.map(a => a.category))].filter(Boolean)
    const imageCategories = [...new Set(images.map(i => i.category))].filter(Boolean)
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 文章分类 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">文章分类</h2>
          <div className="border rounded p-4">
            <div className="mb-4">
              <div className="flex">
                <input 
                  type="text" 
                  className="flex-grow p-2 border rounded-l"
                  placeholder="添加新分类"
                />
                <button className="px-4 py-2 bg-primary text-white rounded-r">
                  添加
                </button>
              </div>
            </div>
            
            <ul className="space-y-2">
              {articleCategories.map((category, index) => (
                <li key={index} className="flex justify-between items-center p-2 border-b">
                  <span>{category}</span>
                  <div className="flex space-x-2">
                    <button className="text-xs text-blue-500">编辑</button>
                    <button className="text-xs text-red-500">删除</button>
                  </div>
                </li>
              ))}
              
              {articleCategories.length === 0 && (
                <li className="text-gray-500 text-center py-2">暂无分类</li>
              )}
            </ul>
          </div>
        </div>
        
        {/* 图片分类 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">图片分类</h2>
          <div className="border rounded p-4">
            <div className="mb-4">
              <div className="flex">
                <input 
                  type="text" 
                  className="flex-grow p-2 border rounded-l"
                  placeholder="添加新分类"
                />
                <button className="px-4 py-2 bg-primary text-white rounded-r">
                  添加
                </button>
              </div>
            </div>
            
            <ul className="space-y-2">
              {imageCategories.map((category, index) => (
                <li key={index} className="flex justify-between items-center p-2 border-b">
                  <span>{category}</span>
                  <div className="flex space-x-2">
                    <button className="text-xs text-blue-500">编辑</button>
                    <button className="text-xs text-red-500">删除</button>
                  </div>
                </li>
              ))}
              
              {imageCategories.length === 0 && (
                <li className="text-gray-500 text-center py-2">暂无分类</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container-custom py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold mb-6">内容管理系统</h1>
        
        {/* 标签页切换 */}
        <div className="flex border-b mb-6 overflow-x-auto pb-1">
          <button
            className={`pb-2 px-4 font-medium whitespace-nowrap ${selectedTab === 'articles' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('articles')}
          >
            文章管理
          </button>
          <button
            className={`pb-2 px-4 font-medium whitespace-nowrap ${selectedTab === 'announcements' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('announcements')}
          >
            公告管理
          </button>
          <button
            className={`pb-2 px-4 font-medium whitespace-nowrap ${selectedTab === 'images' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('images')}
          >
            图片库
          </button>
          <button
            className={`pb-2 px-4 font-medium whitespace-nowrap ${selectedTab === 'categories' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('categories')}
          >
            分类管理
          </button>
        </div>
        
        {/* 选项卡内容 */}
        {selectedTab === 'articles' && renderArticlesTab()}
        {selectedTab === 'announcements' && renderAnnouncementsTab()}
        {selectedTab === 'images' && renderImagesTab()}
        {selectedTab === 'categories' && renderCategoriesTab()}
      </div>
    </div>
  )
} 