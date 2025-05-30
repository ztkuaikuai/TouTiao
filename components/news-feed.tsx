"use client"

import { useRouter, useSearchParams } from "next/navigation"
import NewsCard from "./news-card"
import type { Article } from "@/app/api/articles/route"
import { useEffect, useState, Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface NewsFeedProps {
  from?: 'index' | 'search'
}

function NewsFeedContent({ from = 'index' }: NewsFeedProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const [newsData, setNewsData] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewsData = async () => {
      setLoading(true)
      try {
        let response;
        
        if (from === 'index') {
          response = await fetch("/api/articles")
        } else if (from === 'search' && keyword) {
          response = await fetch(`/api/keyword-articles?keyword=${encodeURIComponent(keyword)}`)
        } else {
          response = await fetch("/api/articles")
        }
        const data = await response.json()
        
        // 处理不同接口返回的数据结构
        if (from === 'search' && data.articles) {
          setNewsData(data.articles)
        } else {
          setNewsData(data)
        }
      } catch (error) {
        console.error('获取新闻数据失败:', error)
        setNewsData([])
      } finally {
        setLoading(false)
      }
    }
    fetchNewsData()
  }, [from, keyword])

  return (<>
    {!loading && newsData.length > 0 ? (
      <div className="space-y-4">
        {newsData.map((news, index) => (
          <NewsCard
            key={index}
            id={news.id!}
            title={news.title}
            author={news.author!}
            created_at={news.created_at!}
            likes_count={news.likes_count!}
            favorites_count={news.favorites_count!}
            comments_count={news.comments_count!}
            onClick={() => {
              router.push(`/articles/${news.id}`)
            }}
          />
        ))}
      </div>
    ) : !loading && newsData.length === 0 ? (
      <div className="text-center py-8">
        <p className="text-gray-500">{from === 'search' ? '没有找到相关文章' : '暂无文章'}</p>
      </div>
    ) : (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-md shadow flex space-x-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center space-x-2 mb-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </>)
}

export default function NewsFeed(props: NewsFeedProps) {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-md shadow flex space-x-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center space-x-2 mb-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    }>
      <NewsFeedContent {...props} />
    </Suspense>
  )
}
