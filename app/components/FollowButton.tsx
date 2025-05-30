'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/use-user'

interface FollowButtonProps {
  authorId: string
}

export default function FollowButton({ authorId }: FollowButtonProps) {
  const [user] = useUser()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 检查是否已关注
  useEffect(() => {
    if (!user || !authorId || user.id === authorId) return

    const checkFollowStatus = async () => {
      try {
        const response = await fetch(`/api/folo/is-follow?follower_id=${user.id}&followed_id=${authorId}`)
        const data = await response.json()
        setIsFollowing(data.is_following)
      } catch (error) {
        console.error('检查关注状态失败:', error)
      }
    }

    checkFollowStatus()
  }, [user, authorId])

  // 如果是自己的文章，不显示关注按钮
  if (!user || user.id === authorId) {
    return null
  }

  // 处理关注/取消关注
  const handleFollowToggle = async () => {
    if (isLoading || !user) return

    setIsLoading(true)
    try {
      if (isFollowing) {
        // 取消关注
        const response = await fetch(`/api/folo/following?follower_id=${user.id}&followed_id=${authorId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setIsFollowing(false)
        }
      } else {
        // 添加关注
        const response = await fetch('/api/folo/following', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            follower_id: user.id,
            followed_id: authorId,
          }),
        })
        
        if (response.ok) {
          setIsFollowing(true)
        }
      }
    } catch (error) {
      console.error('关注操作失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`${
        isFollowing 
          ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
          : 'bg-red-500 hover:bg-red-600 text-white'
      } px-4 py-1.5 rounded text-sm font-medium shrink-0 ml-2 transition-colors`}
    >
      {isLoading ? '处理中...' : isFollowing ? '已关注' : '+ 关注'}
    </button>
  )
} 