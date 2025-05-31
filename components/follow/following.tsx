'use client'

import { useState, useEffect } from 'react'
import UserFollowModal from './user-follow-modal'

interface FollowingProps {
  userId: string
}

export default function Following({ userId }: FollowingProps) {
  const [followingCount, setFollowingCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [following, setFollowing] = useState<any[]>([])

  useEffect(() => {
    if (!userId) return

    const fetchFollowingCount = async () => {
      setLoading(true)
      setError(null)
      try {
        // 获取用户关注的人列表
        const response = await fetch(`/api/folo/following?follower_id=${userId}`)
        
        if (!response.ok) {
          throw new Error(`获取关注列表失败: ${response.status}`)
        }
        
        const data = await response.json()
        
        // 保存关注数据
        setFollowing(Array.isArray(data) ? data : [])
        // 设置关注数量
        setFollowingCount(Array.isArray(data) ? data.length : 0)
      } catch (err) {
        console.error('获取关注数量失败:', err)
        setError(err instanceof Error ? err.message : '获取关注数量失败')
      } finally {
        setLoading(false)
      }
    }

    fetchFollowingCount()
  }, [userId])

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  if (loading) {
    return (<div className="text-center">
        <div className="text-xl font-bold">0</div>
        <div className="text-sm text-gray-500">关注</div>
    </div>)
  }

  if (error) {
    return (<div className="text-center">
        <div className="text-xl font-bold">0</div>
        <div className="text-sm text-gray-500">关注</div>
    </div>)
  }

  return (
    <>
      <div className="text-center cursor-pointer" onClick={handleOpenModal}>
        <div className="text-xl font-bold">{followingCount}</div>
        <div className="text-sm text-gray-500">关注</div>
      </div>

      <UserFollowModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="关注列表"
        users={following}
        type="following"
      />
    </>
  )
}
