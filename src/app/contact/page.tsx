import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '联系我们 | 牧马单车',
  description: '有任何问题或建议？欢迎联系牧马单车，我们的团队随时为您提供帮助和支持。',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* 英雄区 */}
      <section className="relative bg-primary text-white py-20 md:py-32">
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">联系我们</h1>
            <p className="text-xl mb-8">我们期待您的反馈，随时为您提供帮助和支持</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3" 
            alt="联系牧马单车" 
            className="object-cover"
            fill
            priority
          />
        </div>
      </section>

      {/* 联系信息和表单 */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 联系表单 */}
            <div>
              <h2 className="text-3xl font-bold mb-6">给我们留言</h2>
              <p className="text-gray-600 mb-8">
                无论您有任何问题、建议或合作意向，都欢迎填写下方表单联系我们。我们会在1-2个工作日内回复您。
              </p>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      邮箱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    电话
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    主题 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">请选择</option>
                    <option value="product">产品咨询</option>
                    <option value="service">服务咨询</option>
                    <option value="order">订单问题</option>
                    <option value="cooperation">商务合作</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    留言内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    提交
                  </button>
                </div>
              </form>
            </div>
            
            {/* 联系信息 */}
            <div>
              <h2 className="text-3xl font-bold mb-6">联系方式</h2>
              
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold mb-1">地址</h3>
                    <p className="text-gray-600">北京市朝阳区建国路88号<br />牧马单车总部大厦</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold mb-1">电话</h3>
                    <p className="text-gray-600">400-123-4567（客服热线）<br />010-12345678（总部）</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold mb-1">邮箱</h3>
                    <p className="text-gray-600">service@mumabike.com（客服）<br />business@mumabike.com（商务合作）</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold mb-1">营业时间</h3>
                    <p className="text-gray-600">周一至周五：9:00 - 18:00<br />周六至周日：10:00 - 17:00</p>
                  </div>
                </div>
              </div>
              
              {/* 地图 */}
              <div className="mt-10 h-64 bg-gray-100 rounded-lg relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">地图加载中...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 门店列表 */}
      <section className="py-16 bg-light">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">我们的门店</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1565951805891-281eec63be1c?ixlib=rb-4.0.3" 
                  alt="牧马单车 - 朝阳门店" 
                  className="object-cover"
                  fill
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">朝阳门店</h3>
                <p className="text-gray-600 mb-4">北京市朝阳区建国路88号</p>
                <p className="text-gray-600">电话：010-12345678</p>
                <p className="text-gray-600">营业时间：9:00 - 18:00</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1571333250630-f0230c320b6d?ixlib=rb-4.0.3" 
                  alt="牧马单车 - 海淀门店" 
                  className="object-cover"
                  fill
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">海淀门店</h3>
                <p className="text-gray-600 mb-4">北京市海淀区中关村大街1号</p>
                <p className="text-gray-600">电话：010-87654321</p>
                <p className="text-gray-600">营业时间：9:00 - 18:00</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1517691550927-7eef877818bb?ixlib=rb-4.0.3" 
                  alt="牧马单车 - 西城门店" 
                  className="object-cover"
                  fill
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">西城门店</h3>
                <p className="text-gray-600 mb-4">北京市西城区西长安街66号</p>
                <p className="text-gray-600">电话：010-23456789</p>
                <p className="text-gray-600">营业时间：9:00 - 18:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 