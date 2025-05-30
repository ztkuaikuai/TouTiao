'use client'

import { useState, useEffect } from 'react'

interface FollowersProps {
  userId: string
}

export default function Followers({ userId }: FollowersProps) {
  const [followersCount, setFollowersCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchFollowersCount = async () => {
      setLoading(true)
      setError(null)
      try {
        // 获取用户的粉丝列表
        const response = await fetch(`/api/folo/followers?followed_id=${userId}`)
        
        if (!response.ok) {
          throw new Error(`获取粉丝列表失败: ${response.status}`)
        }
        
        const data = await response.json()
        
        // 设置粉丝数量
        setFollowersCount(Array.isArray(data) ? data.length : 0)
      } catch (err) {
        console.error('获取粉丝数量失败:', err)
        setError(err instanceof Error ? err.message : '获取粉丝数量失败')
      } finally {
        setLoading(false)
      }
    }

    fetchFollowersCount()
  }, [userId])

  if (loading) {
    return (
        <div className="text-center">
          <div className="text-xl font-bold">0</div>
          <div className="text-sm text-gray-500">粉丝</div>
        </div>
      )
  }

  if (error) {
    return (
        <div className="text-center">
          <div className="text-xl font-bold">0</div>
          <div className="text-sm text-gray-500">粉丝</div>
        </div>
      )
  }

  return (
    <div className="text-center">
      <div className="text-xl font-bold">{followersCount}</div>
      <div className="text-sm text-gray-500">粉丝</div>
    </div>
  )
}
