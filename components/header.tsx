"use client"

import { useState } from "react"
import { Search, Bell, Edit, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="relative">
      {/* Top Navigation Bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-gray-300">
              下载头条APP
            </a>
            <a href="#" className="hover:text-gray-300">
              深圳头条
            </a>
            <a href="#" className="hover:text-gray-300">
              关于头条
            </a>
            <a href="#" className="hover:text-gray-300">
              反馈
            </a>
            <a href="#" className="hover:text-gray-300">
              侵权投诉
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>北京</span>
              <span className="text-yellow-400">☀️</span>
              <span>多云 25°C</span>
              <span className="text-gray-400">霾</span>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
              <Bell className="w-4 h-4 mr-1" />
              消息
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
              <Edit className="w-4 h-4 mr-1" />
              发布作品
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                  <User className="w-4 h-4 mr-1" />
                  ztkk
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>个人中心</DropdownMenuItem>
                <DropdownMenuItem>设置</DropdownMenuItem>
                <DropdownMenuItem>退出登录</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Header with Background */}
      <div className="relative h-64">
        {/* 视频背景层 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/toutiao-bg.png"
        >
          <source src="https://lf9-static.bytednsdoc.com/obj/eden-cn/uhbfnupkbps/video/earth_v6.mp4" type="video/mp4" />
        </video>

        {/* 遮罩层 */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />

        {/* 内容层 */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center h-full">
          <h1 className="text-white text-6xl font-bold mb-8">今日头条</h1>
          <div className="relative w-full max-w-2xl">
            <Input
              type="text"
              placeholder="搜索：鼓励带薪年假与代休并举体"
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
    </header>
  )
}
