'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/app/articles/[id]/page'
import { useUserProfile } from '@/contexts/user-profile-context'

// 评论类型定义
interface Comment {
  id: number
  article_id: number
  user_id: string
  content: string
  created_at: string
  user?: {
    user_id: string
    name: string
    avatar_url: string
  }
}

interface CommentSectionProps {
  articleId: number
  userId: string | null // 当前登录用户ID，如果未登录则为null
  commentsCount: number
}

export default function CommentSection({ articleId, userId, commentsCount }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [localCommentsCount, setLocalCommentsCount] = useState(commentsCount)
  const { profile } = useUserProfile()

  // 获取评论列表
  const fetchComments = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/articles/comments?article_id=${articleId}`)
      if (!response.ok) {
        throw new Error(`获取评论失败: ${response.status}`)
      }
      const data = await response.json()
      setComments(data)
    } catch (err: any) {
      setError(err.message || '获取评论失败')
    } finally {
      setLoading(false)
    }
  }

  // 提交评论
  const submitComment = async () => {
    if (!userId) {
      alert('请先登录再发表评论')
      return
    }

    if (!commentText.trim()) {
      alert('评论内容不能为空')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/articles/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_id: articleId,
          user_id: userId,
          content: commentText,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '发表评论失败')
      }

      // 评论成功后清空输入框并刷新评论列表
      setCommentText('')
      fetchComments()
      setLocalCommentsCount(prev => prev + 1)
    } catch (err: any) {
      setError(err.message || '发表评论失败')
    } finally {
      setSubmitting(false)
    }
  }

  // 删除评论
  const deleteComment = async (commentId: number) => {
    if (!confirm('确定要删除这条评论吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/articles/comments?id=${commentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '删除评论失败')
      }

      // 删除成功后刷新评论列表
      fetchComments()
      setLocalCommentsCount(prev => prev - 1)
    } catch (err: any) {
      setError(err.message || '删除评论失败')
    }
  }

  // 组件挂载时加载评论
  useEffect(() => {
    fetchComments()
  }, [articleId])

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="text-xl font-bold mb-4">评论 {localCommentsCount}</h3>
      
      {/* 评论输入框 */}
      <div className="mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {/* 用户头像 */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name || '用户'}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {profile?.name?.substring(0, 2) || '匿名'}
                </div>
              )}
            </div>
          </div>
          <div className="flex-grow relative">
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={userId ? "写下你的评论..." : "请先登录再发表评论"}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!userId || submitting}
            ></textarea>
            <button
              className="absolute right-3 bottom-3 bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={submitComment}
              disabled={!userId || submitting || !commentText.trim()}
            >
              {submitting ? '发表中...' : '评论'}
            </button>
          </div>
        </div>
      </div>

      {/* 评论列表 */}
      {loading ? (
        <div className="text-center py-4">加载评论中...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">暂无评论，快来发表第一条评论吧！</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex">
              <div className="flex-shrink-0 mr-3">
                {/* 评论用户头像 */}
                {comment.user?.avatar_url ? (
                  <img
                    src={comment.user.avatar_url}
                    alt={comment.user.name || '用户'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {comment.user?.name?.substring(0, 2) || '匿名'}
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center">
                  <h4 className="font-bold text-gray-900">{comment.user?.name || '匿名用户'}</h4>
                  <span className="text-xs text-gray-500 ml-2">{formatDate(comment.created_at)}</span>
                </div>
                <div className="mt-1 text-gray-800">{comment.content}</div>
                
                {/* 如果是当前用户的评论，显示删除按钮 */}
                {userId && userId === comment.user_id && (
                  <button
                    className="text-xs text-gray-500 mt-1 hover:text-red-500"
                    onClick={() => deleteComment(comment.id)}
                  >
                    删除
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 