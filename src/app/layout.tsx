import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prequal Application',
  description: 'Modern prequal application form built with Next.js',
  icons: {
    icon: [
      { url: '/img/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/favicon.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/img/favicon.png',
    apple: '/img/favicon.png'
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            </div>
          </div>
        }>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
