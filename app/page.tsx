'use client'

import NewsFeed from "@/components/news-feed"
import TrendingSidebar from "@/components/trending-sidebar"
import FloatingActionButtons from "@/components/floating-action-buttons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  return (<>
    {/* Main Header with Background */}
    <div className="relative">
      <div className="relative h-[20rem]">
        {/* 视频背景层 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://lf9-static.bytednsdoc.com/obj/eden-cn/uhbfnupkbps/video/earth_v6.mp4" type="video/mp4" />
        </video>

        {/* 遮罩层 */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />

        {/* 内容层 */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center h-full">
          <h1 className="text-white text-5xl font-bold mb-8">今日头条</h1>
          <div className="relative w-full max-w-2xl">
            <Input
              type="text"
              placeholder="AI 智能搜索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-4 pr-12 text-lg bg-white rounded-full border-0 focus:ring-2 focus:ring-red-500"
            />
            <Button size="sm" className="absolute right-2 top-2 bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 p-0">
              <Search className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <NewsFeed />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <TrendingSidebar />
        </div>
      </div>
    </main>

    {/* Floating Action Buttons */}
    <FloatingActionButtons />
  </>)
}
