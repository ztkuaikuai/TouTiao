'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import NewsFeed from "@/components/news-feed"
import TrendingSidebar from "@/components/trending-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useRouter } from 'next/navigation'
import CozeResponse from '../../components/coze-response'
import { useUserProfile } from "@/contexts/user-profile-context"

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { profile } = useUserProfile()
  const keyword = searchParams.get('keyword') || ''
  const [searchQuery, setSearchQuery] = useState(keyword)
  const userId = profile?.user_id ? String(profile.user_id) : 'anonymous'

  useEffect(() => {
    setSearchQuery(keyword);
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* 搜索框 */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="搜索你感兴趣的内容"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-4 pr-12 text-lg rounded-full border-2 border-red-500 focus:ring-2 focus:ring-red-500"
            />
            <Button 
              type="submit"
              size="sm" 
              className="absolute right-2 top-2 bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 p-0"
            >
              <Search className="w-4 h-4 text-white" />
            </Button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 搜索结果 */}
        <div className="lg:col-span-3">
          {keyword ? (
            <>
              <h2 className="text-xl font-medium mb-4">
                <span className="text-red-500">{keyword}</span> 的搜索结果
              </h2>
              <CozeResponse
                keyword={keyword}
                userId={userId}
              />
              <div className="mt-6">
                <NewsFeed />
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-12">
              请输入搜索关键词
            </div>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <TrendingSidebar />
        </div>
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}   