import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '关于我们 | 牧马单车',
  description: '了解牧马单车的历史、使命和价值观。我们致力于为骑行爱好者提供高品质的自行车和专业服务。',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* 英雄区 */}
      <section className="relative bg-primary text-white py-20 md:py-32">
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">关于牧马单车</h1>
            <p className="text-xl mb-8">我们热爱骑行，更热爱为骑行者提供最好的服务体验</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3" 
            alt="关于牧马单车" 
            className="object-cover"
            fill
            priority
          />
        </div>
      </section>

      {/* 品牌故事 */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">我们的故事</h2>
              <p className="text-gray-600 mb-4">
                牧马单车成立于2010年，由一群热爱骑行的自行车爱好者创立。我们最初只是一家小型的自行车维修店，坐落在北京的一个小胡同里。
              </p>
              <p className="text-gray-600 mb-4">
                创始人张志远在大学时就是校自行车队的队长，毕业后在知名自行车品牌工作多年。他发现市场上很难找到既有专业技术支持又能提供个性化服务的自行车店。
              </p>
              <p className="text-gray-600">
                就这样，牧马单车诞生了。取名"牧马"，源自中国古诗"牧马频来去，官军久在城"，寓意自由奔放、追求远方的精神。12年来，我们从一家小店发展成为拥有多家门店的连锁企业，但我们始终坚持初心：为骑行爱好者提供最好的产品和服务。
              </p>
            </div>
            <div className="relative h-80 md:h-full min-h-[320px] rounded-lg overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1596731498067-42e610ae9c8d?ixlib=rb-4.0.3" 
                alt="牧马单车的故事" 
                className="object-cover"
                fill
              />
            </div>
          </div>
        </div>
      </section>

      {/* 使命与价值观 */}
      <section className="py-16 bg-light">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">我们的使命与价值观</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">品质承诺</h3>
              <p className="text-gray-600">
                我们只提供经过严格筛选的高品质产品，每一辆自行车和每一个配件都经过专业测试和认证，确保您获得最佳体验。
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">骑行社区</h3>
              <p className="text-gray-600">
                我们不仅是一家商店，更是骑行爱好者的社区。定期举办骑行活动、技术讲座和交流会，帮助骑手们相互连接，分享骑行的乐趣。
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">专业服务</h3>
              <p className="text-gray-600">
                我们的技师团队都经过专业培训和认证，能够提供从基础保养到高级调校的全方位服务，让您的骑行更加安全、舒适。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 团队介绍 */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">我们的团队</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto relative">
                <Image 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3" 
                  alt="张志远 - 创始人兼CEO" 
                  className="object-cover"
                  fill
                />
              </div>
              <h3 className="text-xl font-bold">张志远</h3>
              <p className="text-gray-600">创始人兼CEO</p>
            </div>
            <div className="text-center">
              <div className="mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto relative">
                <Image 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3" 
                  alt="李梦华 - 技术总监" 
                  className="object-cover"
                  fill
                />
              </div>
              <h3 className="text-xl font-bold">李梦华</h3>
              <p className="text-gray-600">技术总监</p>
            </div>
            <div className="text-center">
              <div className="mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto relative">
                <Image 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3" 
                  alt="王晓雯 - 营销经理" 
                  className="object-cover"
                  fill
                />
              </div>
              <h3 className="text-xl font-bold">王晓雯</h3>
              <p className="text-gray-600">营销经理</p>
            </div>
            <div className="text-center">
              <div className="mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto relative">
                <Image 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3" 
                  alt="陈文浩 - 骑行教练" 
                  className="object-cover"
                  fill
                />
              </div>
              <h3 className="text-xl font-bold">陈文浩</h3>
              <p className="text-gray-600">骑行教练</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 