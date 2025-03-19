'use client';

import FeaturedProducts from '@/components/FeaturedProducts'
import Image from 'next/image'
import Link from 'next/link'
import { useCategories } from '@/lib/categories/CategoryContext'

export default function Home() {
  const { categories } = useCategories();
  
  return (
    <main className="min-h-screen">
      {/* 英雄区 */}
      <section className="relative bg-primary text-white py-20 md:py-32">
        <div className="container-custom relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">开启您的骑行之旅</h1>
            <p className="text-xl mb-8">牧马单车提供高品质自行车和专业服务，让每一段骑行都充满乐趣和激情。</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-accent">
                浏览商品
              </Link>
              <Link href="/services" className="btn-secondary">
                预约服务
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3" 
            alt="Hero background" 
            className="object-cover"
            fill
            priority
          />
        </div>
      </section>

      {/* 分类导航 */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-10">浏览分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories
              .filter(category => category.showOnHomepage)
              .map(category => (
              <Link 
                key={category.id} 
                href={`/products?category=${category.id}`}
                className="card group hover:shadow-lg transition-all p-5 text-center flex flex-col items-center justify-center h-32"
              >
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{category.description.split('，')[0]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 特色商品 */}
      <FeaturedProducts />

      {/* 服务介绍 */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">我们的服务</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              牧马单车提供专业的自行车服务，从常规维护到个性化调校，满足您的所有骑行需求。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="h-48 bg-light rounded-t-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">维修保养</h3>
                <p className="text-gray-600 mb-4">
                  我们提供专业的自行车维修和保养服务，包括调整变速器、更换刹车片、轮胎更换等，让您的爱车始终保持最佳状态。
                </p>
                <Link href="/services" className="text-primary font-medium hover:underline flex items-center">
                  了解更多
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="card">
              <div className="h-48 bg-light rounded-t-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Bike Fitting</h3>
                <p className="text-gray-600 mb-4">
                  通过专业的Bike Fitting服务，我们会根据您的身体测量数据和骑行习惯，调整您的自行车，使其与您的身体完美匹配，提高舒适度和效率。
                </p>
                <Link href="/services" className="text-primary font-medium hover:underline flex items-center">
                  了解更多
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="card">
              <div className="h-48 bg-light rounded-t-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">预约系统</h3>
                <p className="text-gray-600 mb-4">
                  通过我们便捷的在线预约系统，您可以随时安排维修或Bike Fitting服务，选择适合您的时间，无需排队等待。
                </p>
                <Link href="/services" className="text-primary font-medium hover:underline flex items-center">
                  了解更多
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 会员专区 */}
      <section className="py-16 bg-primary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">加入牧马单车会员</h2>
            <p className="text-xl mb-8">
              会员专享各种优惠和服务，包括积分奖励、专属优惠券、生日礼品和优先维修服务。
            </p>
            <Link href="/membership" className="btn-accent">
              立即加入
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">牧马单车</h3>
              <p>您的专业自行车商店</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">联系我们</h4>
              <p>地址：北京市朝阳区某某路88号</p>
              <p>电话：010-12345678</p>
              <p>邮箱：info@mumabike.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">营业时间</h4>
              <p>周一至周五：9:00 - 18:00</p>
              <p>周六至周日：10:00 - 17:00</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">关注我们</h4>
              <div className="flex gap-4">
                <span>微信</span>
                <span>微博</span>
                <span>抖音</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>© 2023 牧马单车 版权所有</p>
          </div>
        </div>
      </footer>
    </main>
  )
} 