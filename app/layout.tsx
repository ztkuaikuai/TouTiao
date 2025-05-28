import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProfileProvider } from "@/contexts/user-profile-context"

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
    <html lang="zh-CN" className="light" style={{colorScheme:"light"}}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <UserProfileProvider>
            {children}
          </UserProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
