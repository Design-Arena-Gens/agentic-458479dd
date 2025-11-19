import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track your daily expenses with ease',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#6366f1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
