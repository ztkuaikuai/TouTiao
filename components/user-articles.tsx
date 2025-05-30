"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import NewsCard from './news-card'
import { Skeleton } from "@/components/ui/skeleton"
import type { Article } from "@/app/api/articles/route"
import { createClient } from "@/utils/supabase/client"

const UserArticles = () => {
    const params = useParams()
    const router = useRouter()
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<string | null>(null)

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setCurrentUser(user.id)
            }
        }

        fetchCurrentUser()
    }, [])

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true)
            try {
                // 如果URL中有用户ID则使用它，否则使用当前登录用户的ID
                const userId = params?.['user-id'] || currentUser
                
                if (!userId) {
                    setLoading(false)
                    return
                }

                const response = await fetch(`/api/user-articles?user_id=${userId}`)
                if (response.ok) {
                    const data = await response.json()
                    setArticles(data)
                }
            } catch (error) {
                console.error('获取文章失败:', error)
            } finally {
                setLoading(false)
            }
        }

        if (params?.['user-id'] || currentUser) {
            fetchArticles()
        }
    }, [params, currentUser])

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
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
        )
    }

    return (
        <div className="p-6">
            {articles.length > 0 ? (
                <div className="space-y-4">
                    {articles.map((article, index) => (
                        <NewsCard
                            key={index}
                            id={article.id!}
                            title={article.title}
                            author={article.author!}
                            created_at={article.created_at!}
                            likes_count={article.likes_count!}
                            favorites_count={article.favorites_count!}
                            comments_count={article.comments_count!}
                            onClick={() => {
                                router.push(`/articles/${article.id}`)
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-32 h-32 mx-auto mb-4 opacity-50">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <circle cx="100" cy="80" r="30" fill="#e5e7eb" />
                            <path d="M70 80 Q100 50 130 80 Q130 120 100 140 Q70 120 70 80" fill="#e5e7eb" />
                            <circle cx="90" cy="75" r="3" fill="#9ca3af" />
                            <circle cx="110" cy="75" r="3" fill="#9ca3af" />
                            <path d="M95 85 Q100 90 105 85" stroke="#9ca3af" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    <p className="text-gray-500">暂无内容</p>
                </div>
            )}
        </div>
    )
}

export default UserArticles