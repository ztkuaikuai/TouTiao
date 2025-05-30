"use client"

import { Edit, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useUserProfile } from "@/contexts/user-profile-context"
import Link from "next/link"

export default function Header() {
  const { profile } = useUserProfile()

  const supabase = createClient()
  const router = useRouter()
  const signout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <header className="relative">
      {/* Top Navigation Bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end sm:justify-between items-center">
          <div className="hidden sm:flex items-center space-x-6">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-red-500 text-xl font-bold">
                今日头条
              </Link>
            </div>
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
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 hover:text-white" onClick={() => router.push('/publish')}>
              <Edit className="w-4 h-4 mr-1" />
              发布作品
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 hover:text-white">
                  <User className="w-4 h-4 mr-1" />
                  {profile?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push('/user-center')}>个人中心</DropdownMenuItem>
                <DropdownMenuItem onClick={signout}>退出登录</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
