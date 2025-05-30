"use client"

import { useRouter } from "next/navigation"
import NewsCard from "./news-card"
import type { Article } from "@/app/api/articles/route"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewsFeed() {
  const router = useRouter()
  const [newsData, setNewsData] = useState<Article[]>([])
  useEffect(() => {
    const fetchNewsData = async () => {
      const response = await fetch("/api/articles")
      const data = await response.json()
      setNewsData(data)
    }
    fetchNewsData()
  }, [])
  return (<>
    {newsData.length > 0 ? (
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
