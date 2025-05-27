"use client"

import { useUser } from "@/hooks/use-user"
import { ChevronRight } from "lucide-react"

export default function UserProfileSection() {
  const [user] = useUser()

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <div className="text-2xl">🐧</div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{user?.email?.split("@")[0] || "ztkk"}</h1>

            {/* Stats */}
            <div className="flex items-center space-x-8 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-500">获赞</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-500">粉丝</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-500">关注</div>
              </div>
            </div>

            {/* More Info Link */}
            <button className="flex items-center text-gray-500 hover:text-gray-700 text-sm">
              更多信息
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
