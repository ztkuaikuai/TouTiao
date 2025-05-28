"use client"

import { Search, Bell, Edit, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useUserProfile } from "@/contexts/user-profile-context"
import Link from "next/link"

export default function UserCenterHeader() {
  const supabase = createClient()
  const router = useRouter()
  const { profile } = useUserProfile()

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
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-red-500">
              <Search className="w-4 h-4 mr-1" />
              搜索
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-red-500">
              <Edit className="w-4 h-4 mr-1" />
              发布
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-red-500">
                  <User className="w-4 h-4 mr-1" />
                  {profile?.name}
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
