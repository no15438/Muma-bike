import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '车友活动 | 牧马单车',
  description: '浏览牧马单车组织的各类骑行活动、讲座和工作坊，加入车友社区，共享骑行乐趣。',
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 