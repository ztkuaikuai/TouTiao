'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/use-user'

interface FavoriteButtonProps {
  articleId: number
  initialFavoritesCount?: number
}

export default function FavoriteButton({ articleId, initialFavoritesCount = 0 }: FavoriteButtonProps) {
  const [user] = useUser()
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(initialFavoritesCount)
  const [isLoading, setIsLoading] = useState(false)

  // 检查用户是否已收藏
  useEffect(() => {
    if (!user || !articleId) return

    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/api/articles/favorites?user_id=${user.id}&article_id=${articleId}`)
        const data = await response.json()
        setIsFavorited(data.is_favorited)
      } catch (error) {
        console.error('检查收藏状态失败:', error)
      }
    }

    checkFavoriteStatus()
  }, [user, articleId])

  // 处理收藏/取消收藏
  const handleFavoriteToggle = async () => {
    if (isLoading || !user) return

    setIsLoading(true)
    try {
      if (isFavorited) {
        // 取消收藏
        const response = await fetch(`/api/articles/favorites?user_id=${user.id}&article_id=${articleId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          const data = await response.json()
          setIsFavorited(false)
          setFavoritesCount(data.favorites_count)
        }
      } else {
        // 添加收藏
        const response = await fetch('/api/articles/favorites', {
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
          setIsFavorited(true)
          setFavoritesCount(data.favorites_count)
        }
      }
    } catch (error) {
      console.error('收藏操作失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      className={`flex flex-col items-center transition-colors ${
        isFavorited ? 'text-yellow-500' : 'text-gray-700 hover:text-yellow-500'
      }`}
      onClick={handleFavoriteToggle}
      disabled={isLoading || !user}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-7 w-7" 
        fill={isFavorited ? "currentColor" : "none"} 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.846 5.671a1 1 0 00.95.69h5.969c.969 0 1.371 1.24.588 1.81l-4.827 3.525a1 1 0 00-.364 1.118l1.846 5.671c.3.921-.755 1.688-1.539 1.118l-4.826-3.525a1 1 0 00-1.176 0l-4.827 3.525c-.784.57-1.838-.197-1.539-1.118l1.846-5.671a1 1 0 00-.364-1.118L2.05 11.1c-.783-.57-.38-1.81.588-1.81h5.969a1 1 0 00.95-.69l1.846-5.671z" 
        />
      </svg>
      <span className="text-xs mt-1">{favoritesCount}</span>
    </button>
  )
} 