'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/use-user'

interface LikeButtonProps {
  articleId: number
  initialLikesCount?: number
}

export default function LikeButton({ articleId, initialLikesCount = 0 }: LikeButtonProps) {
  const [user] = useUser()
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLoading, setIsLoading] = useState(false)

  // 检查用户是否已点赞
  useEffect(() => {
    if (!user || !articleId) return

    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`/api/articles/like?user_id=${user.id}&article_id=${articleId}`)
        const data = await response.json()
        setIsLiked(data.is_liked)
      } catch (error) {
        console.error('检查点赞状态失败:', error)
      }
    }

    checkLikeStatus()
  }, [user, articleId])

  // 处理点赞/取消点赞
  const handleLikeToggle = async () => {
    if (isLoading || !user) return

    setIsLoading(true)
    try {
      if (isLiked) {
        // 取消点赞
        const response = await fetch(`/api/articles/like?user_id=${user.id}&article_id=${articleId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          const data = await response.json()
          setIsLiked(false)
          setLikesCount(data.likes_count)
        }
      } else {
        // 添加点赞
        const response = await fetch('/api/articles/like', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            article_id: articleId,
          }),
        })
        
        if (response.ok) {
          const data = await response.json()
          setIsLiked(true)
          setLikesCount(data.likes_count)
        }
      }
    } catch (error) {
      console.error('点赞操作失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      className={`flex flex-col items-center transition-colors ${
        isLiked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
      }`}
      onClick={handleLikeToggle}
      disabled={isLoading || !user}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-7 w-7" 
        fill={isLiked ? "currentColor" : "none"} 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M4.318 6.318a4.5 4.5 0 016.364 0l.318.318.318-.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" 
        />
      </svg>
      <span className="text-xs mt-1">{likesCount}</span>
    </button>
  )
} 