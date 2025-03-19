'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// 从文章列表页导入模拟文章数据
const mockArticles = [
  {
    id: 'article1',
    title: '2024年最新自行车装备推荐',
    content: `随着2024年的到来，自行车装备市场也迎来了一波新品。本文将为您推荐几款值得购买的高性价比装备。

## 头盔推荐

安全第一，高品质的头盔是每位骑行者的必备装备。2024年，多家品牌推出了具有更好通风性能和更轻量化设计的新款头盔。特别推荐Giro新款Syntax MIPS头盔，它在保证安全性的同时，重量仅为260克，非常适合长时间骑行。

## 骑行服推荐

温度适宜的春季骑行，建议选择透气性好的短袖骑行服。Rapha推出的Essential系列骑行服采用新型面料，吸湿排汗效果出色，同时价格也比旗舰系列更为亲民。

## 车灯系统

夜间骑行安全至关重要，推荐Magicshine新款RN1200前灯，亮度高达1200流明，续航时间长达3小时（高亮模式），支持USB-C快充，10分钟充电可应急使用30分钟。

## 骑行电脑

数据记录对提升训练效果很有帮助。Garmin推出的Edge 540是今年值得关注的新品，除了基本的速度、距离、高度等数据记录，还新增了训练建议和恢复时间评估功能，帮助骑行者更科学地规划训练。

无论您是通勤骑行还是周末休闲，合适的装备都能让骑行体验更加愉悦。欢迎到牧马单车店内体验这些新品！`,
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
    content: `对于刚接触自行车的新手来说，正确的保养习惯能够延长爱车的使用寿命。本文将从清洁、润滑、调整三个方面详细介绍基础的保养知识。

## 清洁篇

### 什么时候需要清洁自行车？

- 淋雨后：雨水可能带有污染物，对金属部件有腐蚀作用
- 泥泞路况骑行后：泥沙会加速传动系统的磨损
- 长时间放置后：灰尘和水汽会对链条等部件造成锈蚀

### 基本清洁步骤

1. 准备工具：自行车专用清洁剂、软毛刷、抹布、水桶
2. 冲洗：用低压水流冲掉表面泥沙（注意避开轴承部位）
3. 清洁：从上到下，使用清洁剂和软毛刷清洁各部件
4. 冲洗并擦干：彻底冲洗掉清洁剂，并用干布擦干各个部件

## 润滑篇

正确的润滑能减少摩擦，延长零件寿命。

### 需要润滑的部位

- 链条：最需要定期润滑的部件
- 变速拨链器枢轴：影响变速顺畅度
- 刹车拉杆枢轴：影响刹车手感

### 润滑步骤

1. 确保部件干燥清洁
2. 适量涂抹润滑油（链条润滑应滴在内侧，每个链节一滴）
3. 转动几圈后，用干布擦去多余的润滑油

## 调整篇

定期检查调整能保证骑行安全和舒适度。

### 定期检查项目

- 刹车系统：确保刹车片与轮圈的间隙适当
- 胎压：根据胎侧标示的推荐气压范围打气
- 变速系统：确保变速顺畅，无异响

### 何时寻求专业帮助

如果出现以下情况，建议到车店寻求专业技师帮助：
- 异常声响无法排除
- 刹车失灵或效果显著变差
- 车把或坐管松动
- 车轮不正或出现跳动

记住，定期的基础保养可以避免大多数常见问题，也能帮助您更好地了解自己的爱车。如果您对保养有任何疑问，欢迎到牧马单车咨询我们的技师！`,
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
    content: `春暖花开，正是骑行的好时节。本文为大家推荐几条风景优美、难度适中的春季骑行路线。

## 城市公园环线（初级难度，约15公里）

这条路线主要沿着城市绿道和公园规划，全程基本无坡度，非常适合刚接触骑行的朋友。

**路线亮点：**
- 樱花公园：3月中旬至4月初，可以欣赏到盛开的樱花
- 滨河绿道：沿途绿树成荫，河畔景色宜人
- 文化广场：中途可停留休息，周末还有文艺表演

**骑行提示：**
- 周末人流量大，请注意避让行人
- 全程有共享单车站点，也可以选择租用公共自行车

## 郊区山水线（中级难度，约35公里）

这条路线延伸至城市郊区，包含一定的爬坡路段，但坡度平缓，风景绝佳。

**路线亮点：**
- 田园风光：骑行穿越大片油菜花田和果园
- 山间溪流：中段沿着清澈的溪流前行，空气清新
- 古村落：路线经过一个保存完好的明清古村，可以停下来品尝农家美食

**骑行提示：**
- 请带足饮用水和能量补给
- 部分路段手机信号较弱，建议提前下载离线地图
- 春季天气多变，建议携带防风防雨外套

## 环湖精品路线（中高级难度，约50公里）

这条路线环绕城郊大湖一周，沿途风景如画，但包含几段较陡的爬坡。

**路线亮点：**
- 湖景观赏：多个观景台可俯瞰整个湖面
- 野生动植物：春季是观鸟的好时节，湖边芦苇丛中有多种水鸟栖息
- 山顶寺庙：最高点有一座古寺，是休息和补给的好地方

**骑行提示：**
- 建议使用公路车或山地车挑战此路线
- 部分碎石路段需要小心骑行
- 全程骑行时间约4-5小时，请合理安排出发时间

以上路线均以牧马单车店为起终点。每周六早上8点，我们会组织固定骑行活动，欢迎新老车友参与！详情可在店内咨询或关注我们的公众号获取最新活动信息。`,
    author: '王旅行',
    publishDate: '2024-03-10',
    category: '骑行路线',
    tags: ['骑行路线', '春季', '户外'],
    imageUrl: '/images/articles/spring-routes.jpg',
    isPublished: true
  }
];

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<any | null>(null);
  
  useEffect(() => {
    // 在客户端获取文章数据
    const foundArticle = mockArticles.find(a => a.id === params.id);
    
    if (foundArticle) {
      setArticle(foundArticle);
    }
  }, [params.id]);
  
  // 文章未找到
  if (!article) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">文章加载中...</h1>
        <p className="text-gray-600 mb-6">如果长时间未加载，可能是文章不存在</p>
        <Link href="/articles" className="btn">
          返回文章列表
        </Link>
      </div>
    );
  }
  
  // 将Markdown格式的内容转换为HTML（简单版本）
  const formatContent = (content: string) => {
    // 分割成段落
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // 标题处理
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold mt-6 mb-3">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      
      // 子标题处理
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-semibold mt-4 mb-2">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      
      // 列表处理
      if (paragraph.includes('\n- ')) {
        const listItems = paragraph.split('\n- ');
        const title = listItems.shift();
        
        return (
          <div key={index}>
            {title && <p className="mb-2">{title}</p>}
            <ul className="list-disc pl-6 mb-4 space-y-1">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
        );
      }
      
      // 数字列表处理
      if (paragraph.includes('\n1. ')) {
        const listItems = paragraph.split('\n');
        const title = listItems[0].startsWith('1. ') ? null : listItems.shift();
        
        return (
          <div key={index}>
            {title && <p className="mb-2">{title}</p>}
            <ol className="list-decimal pl-6 mb-4 space-y-1">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-700">{item.replace(/^\d+\.\s/, '')}</li>
              ))}
            </ol>
          </div>
        );
      }
      
      // 普通段落
      return (
        <p key={index} className="mb-4">
          {paragraph}
        </p>
      );
    });
  };
  
  return (
    <main className="container-custom py-8">
      <Link href="/articles" className="inline-flex items-center text-primary hover:underline mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        返回文章列表
      </Link>
      
      <article className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {article.author}
            </span>
            
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              {article.publishDate}
            </span>
            
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              {article.category}
            </span>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag: string) => (
              <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </header>
        
        <div className="relative h-64 sm:h-80 md:h-96 mb-8 bg-gray-100 rounded overflow-hidden">
          {/* 实际项目中应该使用 Image 组件加载图片 */}
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
            {article.imageUrl ? '文章封面图片' : '无封面图片'}
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          {formatContent(article.content)}
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <Link href="/articles" className="btn-outline">
              返回文章列表
            </Link>
            <button className="btn-outline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              分享文章
            </button>
          </div>
        </div>
      </article>
    </main>
  );
} 