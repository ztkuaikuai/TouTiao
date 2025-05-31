'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

// 定义关注者和被关注者的数据结构
interface FollowUser {
  followed_id?: string
  follower_id?: string
  created_at: string
  followed?: {
    user_id: string
    name: string
    avatar_url: string | null
  }
  follower?: {
    user_id: string
    name: string
    avatar_url: string | null
  }
}

interface UserFollowModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  users: FollowUser[]
  type: 'followers' | 'following'
}

export default function UserFollowModal({
  isOpen,
  onClose,
  title,
  users,
  type
}: UserFollowModalProps) {
  const router = useRouter()
  
  // 获取用户信息
  const getUserInfo = (user: FollowUser) => {
    if (type === 'followers') {
      return user.follower
    } else {
      return user.followed
    }
  }
  
  // 获取用户ID
  const getUserId = (user: FollowUser) => {
    if (type === 'followers') {
      return user.follower_id
    } else {
      return user.followed_id
    }
  }

  // 处理用户点击，跳转到用户主页
  const handleUserClick = (userId: string) => {
    onClose() // 关闭模态框
    router.push(`/user-center/${userId}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {type === 'followers' ? '暂无粉丝' : '暂无关注'}
            </div>
          ) : (
            users.map((user) => {
              const userInfo = getUserInfo(user)
              const userId = getUserId(user)
              
              if (!userInfo || !userId) return null
              
              return (
                <div 
                  key={userId} 
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                  onClick={() => handleUserClick(userId)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {userInfo.avatar_url ? (
                        <AvatarImage src={userInfo.avatar_url} alt={userInfo.name} />
                      ) : (
                        <AvatarFallback>{userInfo.name?.[0] || '用户'}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">{userInfo.name}</div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 