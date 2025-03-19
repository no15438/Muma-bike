import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '文章专栏 | 牧马单车',
  description: '浏览牧马单车的文章专栏，了解最新自行车资讯、骑行技巧和装备评测。',
}

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 