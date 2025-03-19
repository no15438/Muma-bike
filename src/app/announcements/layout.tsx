import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '最新公告 | 牧马单车',
  description: '查看牧马单车的最新公告，了解店铺活动、营业时间和服务变更等重要信息。',
}

export default function AnnouncementsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 