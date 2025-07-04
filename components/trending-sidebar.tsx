'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUserProfile } from "@/contexts/user-profile-context"
import Followers from "./follow/followers"
import Following from "./follow/following"

const trendingTopics = [
  { rank: 1, title: "习近平向中国西部国际博览会致贺信", isHot: true },
  { rank: 2, title: "国台办回应台湾黑客网攻", isNew: true },
  { rank: 3, title: "300多万元错误征收补偿区189万" },
  { rank: 4, title: '中国经济率先"顶住了压力"' },
  { rank: 5, title: "副部级刘灵芝被查" },
  { rank: 6, title: "85后干部被严重警告两年后执掌提拔" },
  { rank: 7, title: "网警重拳出击堵塞网络水军团伙" },
  { rank: 8, title: "雨果：王廷芝是现实版世界最佳", isNew: true },
  { rank: 9, title: "英教学员被害无人机空战" },
  { rank: 10, title: "重庆菜园坝火车站将…", isHot: true },
]

export default function TrendingSidebar() {
  const router = useRouter()
  const { profile } = useUserProfile()

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer overflow-hidden" onClick={() => router.push('/user-center')}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="User avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold">{profile?.name?.slice(0, 1)}</span>
              )}
            </div>
            <div className="flex gap-1 items-center  cursor-pointer" onClick={() => router.push('/user-center')}>
              <h3 className="font-medium">{profile?.name}</h3>
              <p className="text-sm text-gray-500">&gt;</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            {profile && <Followers userId={profile.user_id} />}
            {profile && <Following userId={profile.user_id} />}
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4">
            <div className="text-center cursor-pointer" onClick={() => router.push('/publish')}>
              <div className="w-24 h-8 bg-blue-100 rounded mx-auto mb-1 flex items-center justify-center">
                <span className="text-blue-600 text-xs">写</span>
              </div>
              <span className="text-xs">写文章</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Course Ad */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <span className="text-red-600 mr-2">🛡️</span>
            安全课堂
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded p-2 text-center">
              <div className="text-xs font-medium text-red-600">头条反诈指南</div>
              <div className="text-xs text-gray-500 mt-1">警方提醒防诈骗</div>
            </div>
            <div className="bg-white rounded p-2 text-center">
              <div className="text-xs font-medium text-orange-600">帐号违规说明</div>
              <div className="text-xs text-gray-500 mt-1">平台规范说明</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Flame className="w-5 h-5 text-orange-500 mr-2" />
            头条热榜
            <button className="ml-auto text-sm text-gray-500 hover:text-gray-700">换一换</button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {trendingTopics.map((topic) => (
              <div key={topic.rank} className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer">
                <span className={`text-sm font-bold w-4 ${topic.rank <= 3 ? "text-red-500" : "text-gray-500"}`}>
                  {topic.rank}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 line-clamp-2 hover:text-red-600">{topic.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {topic.isHot && (
                      <Badge variant="destructive" className="text-xs px-1 py-0">
                        热
                      </Badge>
                    )}
                    {topic.isNew && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 bg-blue-100 text-blue-600">
                        新
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
