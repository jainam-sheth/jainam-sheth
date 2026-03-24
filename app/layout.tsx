import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GlobalFiltersProvider } from '@/contexts/global-filters-context'
import './globals.css'

const _inter = Inter({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IEM Dashboard | Integrated Economics for Healthcare IDNs',
  description:
    'Analytics dashboard for Integrated Delivery Networks - Track financial performance, operational KPIs, and network health indicators.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        <GlobalFiltersProvider>
          {children}
        </GlobalFiltersProvider>
        <Analytics />
      </body>
    </html>
  )
}
