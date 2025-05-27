"use client"

import { Search, Bell, Edit, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import Link from "next/link"

const categories = [
  { name: "关注", href: "/" },
  { name: "推荐", href: "/" },
  { name: "北京", href: "/" },
  { name: "视频", href: "/" },
  { name: "财经", href: "/" },
  { name: "科技", href: "/" },
  { name: "热点", href: "/" },
  { name: "军事", href: "/" },
  { name: "更多", href: "/" },
]

export default function UserCenterHeader() {
  const supabase = createClient()
  const router = useRouter()
  const [user] = useUser()

  const signout = async () => {
    await supabase.auth.signOut()
    router.replace("/login")
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-red-500 text-xl font-bold">
              今日头条
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {categories.map((category) => (
                <Link key={category.name} href={category.href} className="text-gray-700 hover:text-red-500 text-sm">
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-red-500">
              <Search className="w-4 h-4 mr-1" />
              搜索
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-red-500">
              <Bell className="w-4 h-4 mr-1" />
              消息
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-red-500">
              <Edit className="w-4 h-4 mr-1" />
              发布
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-red-500">
                  <User className="w-4 h-4 mr-1" />
                  {user?.email?.split("@")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/user-center")}>个人中心</DropdownMenuItem>
                <DropdownMenuItem onClick={signout}>退出登录</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
