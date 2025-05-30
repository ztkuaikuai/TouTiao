'use client'

import React, { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client'; // 假设 supabase client 的路径
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // 导入 Quill 样式 (从 react-quill-new)

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }); // 从 react-quill-new 导入

const PublishPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handlePublish = useCallback(async () => {
    if (!title.trim()) {
      setError('请输入文章标题 (2~30个字)');
      return;
    }
    if (title.trim().length < 2 || title.trim().length > 30) {
      setError('文章标题长度应为 2~30个字');
      return;
    }
    if (!content.trim() || content.trim() === '<p><br></p>') { // ReactQuill 空内容可能是 <p><br></p>
      setError('请输入文章内容');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('用户未登录，请先登录');
        setIsSubmitting(false);
        // 可以选择跳转到登录页
        // router.push('/login');
        return;
      }

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, author_id: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '发布文章失败');
      }

      // 发布成功后的操作，例如跳转到文章列表页或详情页
      router.push('/'); // 假设跳转到首页
    } catch (err: any) {
      setError(err.message || '发布文章时发生未知错误');
    } finally {
      setIsSubmitting(false);
    }
  }, [title, content, supabase, router]);

  const titleCharCount = title.trim().length;
  const titleHint = titleCharCount < 2 ? `还需输入 ${2 - titleCharCount} 个字` : '';


  // react-quill 的配置
  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => router.back()} 
            className="text-gray-600 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="relative group">
            <h1 className="text-xl font-semibold text-gray-700">发布文章</h1>
            {/* 可以添加一个下拉菜单 */}
          </div>
          <div></div> {/* 占位保持标题居中 */}
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入文章标题 (2~30个字)"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
            maxLength={30}
          />
          { (titleCharCount > 0 && titleCharCount < 2) && (
             <p className="text-xs text-red-500 mt-1 text-right">{titleHint}</p>
           )
          }
           { title.length > 30 && (
             <p className="text-xs text-red-500 mt-1 text-right">标题最多输入30个字</p>
           )
          }
        </div>

        <div className="mb-6">
          {/* 文章编辑器容器 */}
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent} // ReactQuill 直接传递 HTML 字符串
            modules={modules}
            formats={formats}
            className="h-[400px] mb-4 bg-white" // 编辑器高度和背景
            placeholder="请输入文章内容..."
          />
        </div>
         {/* 空白占位，让编辑器工具栏不遮挡内容 */}
        <div style={{ height: '50px' }}></div>


        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handlePublish}
            disabled={isSubmitting}
            className={`px-8 py-3 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 
                        ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}
          >
            {isSubmitting ? '发布中...' : '发布'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishPage;
