import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProfileProvider } from "@/contexts/user-profile-context"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "今日头条 - 你关心的，才是头条",
  description: "今日头条是一个通用信息平台，致力于连接人与信息，让优质丰富的信息得到高效精准的分发",
  generator: 'ztkuaikuai/v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="light" style={{ colorScheme: "light" }}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <UserProfileProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              {children}
              {/* Footer */}
              <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm text-gray-600">
                    <a href="#" className="hover:text-gray-900">
                      加入头条
                    </a>
                    <a href="#" className="hover:text-gray-900">
                      用户协议
                    </a>
                    <a href="#" className="hover:text-gray-300">
                      隐私政策
                    </a>
                    <a href="#" className="hover:text-gray-900">
                      媒体合作
                    </a>
                    <a href="#" className="hover:text-gray-900">
                      广告合作
                    </a>
                    <a href="#" className="hover:text-gray-900">
                      友情链接
                    </a>
                    <a href="#" className="hover:text-gray-900">
                      更多
                    </a>
                    <a href="#" className="hover:text-gray-900">
                      下载今日头条APP
                    </a>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500">
                    <p>北京科技有限公司版权所有 违法和不良信息举报：400-140-2108 举报邮箱：jubao@toutiao.com</p>
                  </div>
                </div>
              </footer>
            </div>
          </UserProfileProvider>
          <Toaster />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
