import '@/styles/globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { CartProvider } from '@/lib/cart/CartContext'
import { UserProvider } from '@/lib/auth/UserContext'
import { AppointmentProvider } from '@/lib/appointments/AppointmentContext'
import { OrderProvider } from '@/lib/orders/OrderContext'
import { CouponProvider } from '@/lib/coupons/CouponContext'
import { EventProvider } from '@/lib/events/EventContext'
import { BrandProvider } from '@/lib/brands/BrandContext'
import { CategoryProvider } from '@/lib/categories/CategoryContext'
import { ProductProvider } from '@/lib/products/ProductContext'

export const metadata: Metadata = {
  title: '牧马单车 | 专业自行车商店',
  description: '牧马单车是您的专业自行车商店，提供高品质自行车和配件，以及专业的维修和调校服务。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <UserProvider>
          <CartProvider>
            <OrderProvider>
              <AppointmentProvider>
                <CouponProvider>
                  <EventProvider>
                    <BrandProvider>
                      <CategoryProvider>
                        <ProductProvider>
                          <Navbar />
                          {children}
                        </ProductProvider>
                      </CategoryProvider>
                    </BrandProvider>
                  </EventProvider>
                </CouponProvider>
              </AppointmentProvider>
            </OrderProvider>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  )
} 