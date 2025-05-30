'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import Quill styles
import { Router } from 'lucide-react';
import { Article } from '@/app/api/articles/route';
import { Skeleton } from '@/components/ui/skeleton'

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Format: YYYY-MM-DD HH:MM (as in image "2025-05-30 12:39")
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString; // Return original if formatting fails
  }
}

export default function ArticlePage() {
  const params = useParams()
  const articleId = params.id

  const router = useRouter()

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (articleId) {
      const fetchArticle = async () => {
        setLoading(true)
        setError(null)
        try {
          const response = await fetch(`/api/articles?id=${articleId}`)
          if (!response.ok) {
            let errorText = `HTTP error! status: ${response.status}`;
            try {
              const errorData = await response.json();
              errorText = errorData.error || errorText;
            } catch (e) {
              // Ignore if response is not JSON
            }
            throw new Error(errorText);
          }
          const data = await response.json()

          setArticle({
            ...data
          });
        } catch (e: any) {
          setError(e.message || "An unknown error occurred")
        } finally {
          setLoading(false)
        }
      }
      fetchArticle()
    } else {
      setLoading(false);
      setError("Article ID is missing.");
    }
  }, [articleId])

  if (loading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 max-w-5xl">
        <div className="flex flex-col lg:flex-row">
          {/* 左侧社交栏骨架 */}
          <div className="w-full lg:w-20 flex lg:flex-col justify-center items-center space-x-4 lg:space-x-0 lg:space-y-8 py-4 lg:py-0 lg:sticky lg:top-24 self-start order-2 lg:order-1 lg:mr-6">
            <Skeleton className="h-12 w-12 mb-2" />
            <Skeleton className="h-12 w-12 mb-2" />
            <Skeleton className="h-12 w-12 mb-2" />
          </div>
          {/* 右侧正文骨架 */}
          <div className="flex-1 p-2 sm:p-4 order-1 lg:order-2 min-w-0">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="w-11 h-11 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 ml-2" />
              </div>
            </div>
            <Skeleton className="h-8 w-2/3 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-4/6" />
              <Skeleton className="h-6 w-3/6" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600 p-4 text-center">加载文章失败: {error}</div>
  }

  if (!article) {
    return <div className="flex justify-center items-center h-screen p-4 text-center">文章未找到。</div>
  }

  // Split content into paragraphs. Assumes content has newlines for paragraphs.
  // Filter out empty strings that might result from multiple newlines.
  const contentParagraphs = article.content.split(/\r\n|\n|\r/).filter(p => p.trim() !== '');

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 max-w-5xl"> {/* Main container */}
      <div className="flex flex-col lg:flex-row">

        {/* Left Sidebar for social interactions */}
        {/* On small screens, this could be at the bottom or a horizontal bar */}
        {/* For now, it will stack vertically and then become a sticky sidebar on larger screens */}
        <div className="w-full lg:w-20 flex lg:flex-col justify-center items-center space-x-4 lg:space-x-0 lg:space-y-8 py-4 lg:py-0 lg:sticky lg:top-24 self-start order-2 lg:order-1 lg:mr-6">
          <button className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 016.364 0l.318.318.318-.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
            <span className="text-xs mt-1">{article.likes_count ?? '赞'}</span>
          </button>
          <button className="flex flex-col items-center text-gray-700 hover:text-green-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <span className="text-xs mt-1">{article.comments_count ?? '评论'}</span>
          </button>
          <button className="flex flex-col items-center text-gray-700 hover:text-yellow-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.846 5.671a1 1 0 00.95.69h5.969c.969 0 1.371 1.24.588 1.81l-4.827 3.525a1 1 0 00-.364 1.118l1.846 5.671c.3.921-.755 1.688-1.539 1.118l-4.826-3.525a1 1 0 00-1.176 0l-4.827 3.525c-.784.57-1.838-.197-1.539-1.118l1.846-5.671a1 1 0 00-.364-1.118L2.05 11.1c-.783-.57-.38-1.81.588-1.81h5.969a1 1 0 00.95-.69l1.846-5.671z" /></svg>
            <span className="text-xs mt-1">{article.favorites_count ?? '收藏'}</span>
          </button>
        </div>

        {/* Main Article Content */}
        <div className="flex-1 p-2 sm:p-4 order-1 lg:order-2 min-w-0"> {/* min-w-0 is important for flex children text wrapping */}
          {/* Publisher/Author and Date */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center cursor-pointer" onClick={() => router.push(`/user-center/${article.author_id}`)}>
                {/* Publisher avatar or fallback */}
                {article.author?.avatar_url ? (
                  <img
                    src={article.author.avatar_url}
                    alt={article.author.name?.substring(0, 2) || '头像'}
                    className="w-11 h-11 rounded-full object-cover mr-3 shrink-0 border border-gray-200 bg-white"
                  />
                ) : (
                  <div className="w-11 h-11 bg-red-600 text-white rounded-full mr-3 flex items-center justify-center text-sm font-semibold shrink-0">
                    {article.author?.name?.substring(0, 2) || '匿名用户'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-base sm:text-lg text-gray-800">{article.author?.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {formatDate(article.created_at!)}
                  </p>
                </div>
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium shrink-0 ml-2">
                + 关注
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">{article.title}</h1>

          {/* Content - Using ReactQuill in read-only mode */}
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-800 leading-relaxed selection:bg-red-100 selection:text-red-800">
            {article.content ? (
              <ReactQuill
                value={article.content}
                readOnly={true}
                theme="snow"
                modules={{ toolbar: false }} // Disable toolbar in read-only mode
              />
            ) : (
              <p>内容为空。</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
