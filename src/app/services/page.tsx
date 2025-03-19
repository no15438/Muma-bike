import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { serviceItems } from '@/lib/services/data'

export const metadata: Metadata = {
  title: '服务 | 牧马单车',
  description: '牧马单车提供专业的自行车维修服务和Bike Fitting服务，让您的骑行更舒适、更高效。',
}

export default function ServicesPage() {
  // 按类型分组服务项目
  const repairServices = serviceItems.filter(item => item.type === 'repair');
  const fittingServices = serviceItems.filter(item => item.type === 'fitting');
  
  return (
    <main className="min-h-screen">
      {/* 服务页面英雄区 */}
      <section className="relative bg-primary text-white py-20 md:py-32">
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">专业的自行车服务</h1>
            <p className="text-xl mb-8">牧马单车提供专业的自行车维修和调校服务，让您的爱车始终保持最佳状态。</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services/repair/book" className="btn-accent">
                预约维修服务
              </Link>
              <Link href="/services/fitting/book" className="btn-secondary">
                预约Bike Fitting
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1572111504021-40abd3479ddb?ixlib=rb-4.0.3" 
            alt="自行车维修服务" 
            className="object-cover"
            fill
            priority
          />
        </div>
      </section>
      
      {/* 服务概述 */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">我们的服务</h2>
            <p className="text-gray-600">
              牧马单车提供全方位的自行车服务，从基础的维修保养到专业的骑行姿态调校，满足您所有的自行车服务需求。
              我们的技师都经过专业培训，能够处理各种品牌和类型的自行车。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* 维修服务 */}
            <div className="bg-light rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">维修服务</h3>
              <p className="text-gray-600 mb-6">
                我们提供全方位的自行车维修和保养服务，包括调整变速器、修复刹车系统、更换轮胎等。无论是日常保养还是深度检修，我们都能让您的爱车恢复最佳状态。
              </p>
              <div className="flex justify-between items-center">
                <Link 
                  href="#repair-services" 
                  className="text-primary font-medium flex items-center hover:underline"
                >
                  查看详情
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
                <Link 
                  href="/services/repair/book" 
                  className="btn-primary text-sm py-2"
                >
                  立即预约
                </Link>
              </div>
            </div>
            
            {/* Bike Fitting */}
            <div className="bg-light rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Bike Fitting</h3>
              <p className="text-gray-600 mb-6">
                我们的Bike Fitting服务可以根据您的身体尺寸、骑行习惯和骑行目标，对自行车进行精确调校，让您的骑行更舒适、更高效。适合所有级别的骑行者，特别是长途骑行和竞赛选手。
              </p>
              <div className="flex justify-between items-center">
                <Link 
                  href="#fitting-services" 
                  className="text-primary font-medium flex items-center hover:underline"
                >
                  查看详情
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
                <Link 
                  href="/services/fitting/book" 
                  className="btn-primary text-sm py-2"
                >
                  立即预约
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 维修服务项目 */}
      <section id="repair-services" className="py-16 bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">维修服务项目</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              我们提供多种维修服务，满足您的各种需求。从简单的调整到复杂的维修，我们的专业技师都能为您提供高质量的服务。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repairServices.map(service => (
              <div key={service.id} className="card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">¥{service.price}</span>
                    <span className="text-gray-500 text-sm">{service.duration}分钟</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/services/repair/book" className="btn-primary px-8 py-3">
              预约维修服务
            </Link>
          </div>
        </div>
      </section>
      
      {/* Bike Fitting 服务项目 */}
      <section id="fitting-services" className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Bike Fitting 服务项目</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              我们的Bike Fitting服务可以帮助您找到最舒适和高效的骑行姿势，减少疼痛和疲劳，提高骑行表现。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fittingServices.map(service => (
              <div key={service.id} className="card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">¥{service.price}</span>
                    <span className="text-gray-500 text-sm">{service.duration}分钟</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/services/fitting/book" className="btn-primary px-8 py-3">
              预约Bike Fitting
            </Link>
          </div>
        </div>
      </section>
      
      {/* 预约服务 */}
      <section id="appointment" className="py-16 bg-primary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">预约服务</h2>
            <p className="text-xl mb-8">
              选择您需要的服务，我们会安排专业技师为您服务。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/services/repair/book" className="btn-accent">
                预约维修服务
              </Link>
              <Link href="/services/fitting/book" className="btn-secondary">
                预约Bike Fitting
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* 服务保障 */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">我们的服务保障</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              我们致力于提供高质量的服务，让每一位客户都满意。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">专业技师</h3>
              <p className="text-gray-600">
                我们的技师都经过专业培训和认证，拥有丰富的经验，能够处理各种复杂的问题。
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">准时服务</h3>
              <p className="text-gray-600">
                我们尊重客户的时间，服务会按照预约的时间准时开始，高效完成。
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">质量保障</h3>
              <p className="text-gray-600">
                我们提供服务质量保障，如有任何问题，我们会免费重新调整，直到您满意为止。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 