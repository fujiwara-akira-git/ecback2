import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '管理画面',
  description: 'データベース管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}