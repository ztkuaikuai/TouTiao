import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// 定义评论类型
export interface Comment {
  id?: number
  article_id: number
  user_id: string // uuid
  content: string
  created_at?: string
  user?: {
    user_id: string
    name: string
    avatar_url: string
  }
}

// 1. 获取文章评论 - 传入文章id查询该文章下的所有评论，包含用户信息
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const articleId = searchParams.get('article_id')

  if (!articleId) {
    return NextResponse.json({ error: '缺少文章ID参数' }, { status: 400 })
  }

  // 查询评论并关联用户信息
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:user-profiles!user_id(user_id, name, avatar_url)
    `)
    .eq('article_id', articleId)
    .order('created_at', { ascending: false }) // 按创建时间降序排列

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// 2. 添加评论 - 传入文章id、用户id和评论内容，新增评论并更新文章评论数
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  try {
    const commentData = await request.json() as Omit<Comment, 'id' | 'created_at' | 'user'>
    
    // 验证必要字段
    if (!commentData.article_id || !commentData.user_id || !commentData.content) {
      return NextResponse.json({ error: '缺少必要字段：article_id, user_id, content' }, { status: 400 })
    }

    // 1. 添加评论
    const { data: newComment, error: commentError } = await supabase
      .from('comments')
      .insert([
        {
          article_id: commentData.article_id,
          user_id: commentData.user_id,
          content: commentData.content
        }
      ])
      .select()
      .single()

    if (commentError) {
      return NextResponse.json({ error: commentError.message }, { status: 500 })
    }

    // 2. 先获取当前文章
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('comments_count')
      .eq('id', commentData.article_id)
      .single()

    if (fetchError) {
      console.error('获取文章信息失败:', fetchError)
      return NextResponse.json({ 
        data: newComment, 
        warning: '评论已添加，但更新文章评论数失败' 
      }, { status: 201 })
    }

    // 3. 更新文章评论数 +1
    const newCount = (article.comments_count || 0) + 1
    const { error: updateError } = await supabase
      .from('articles')
      .update({ comments_count: newCount })
      .eq('id', commentData.article_id)

    if (updateError) {
      // 如果更新评论数失败，记录错误但仍返回评论添加成功
      console.error('更新文章评论数失败:', updateError)
      return NextResponse.json({ 
        data: newComment, 
        warning: '评论已添加，但更新文章评论数失败' 
      }, { status: 201 })
    }

    return NextResponse.json(newComment, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '请求体格式无效' }, { status: 400 })
  }
}

// 3. 删除评论 - 传入评论id，删除评论并更新文章评论数
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const commentId = searchParams.get('id')

  if (!commentId) {
    return NextResponse.json({ error: '缺少评论ID' }, { status: 400 })
  }

  // 先获取评论信息，以便知道关联的文章ID
  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select('article_id')
    .eq('id', commentId)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!comment) {
    return NextResponse.json({ error: '评论不存在' }, { status: 404 })
  }

  const articleId = comment.article_id

  // 删除评论
  const { data, error: deleteError } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .select()
    .single()

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  // 获取当前文章信息
  const { data: article, error: articleError } = await supabase
    .from('articles')
    .select('comments_count')
    .eq('id', articleId)
    .single()

  if (articleError) {
    console.error('获取文章信息失败:', articleError)
    return NextResponse.json({ 
      message: '评论已删除，但更新文章评论数失败',
      deletedComment: data 
    }, { status: 200 })
  }

  // 更新文章评论数 -1，确保不会小于0
  const newCount = Math.max((article.comments_count || 0) - 1, 0)
  const { error: updateError } = await supabase
    .from('articles')
    .update({ comments_count: newCount })
    .eq('id', articleId)

  if (updateError) {
    // 如果更新评论数失败，记录错误但仍返回评论删除成功
    console.error('更新文章评论数失败:', updateError)
    return NextResponse.json({ 
      message: '评论已删除，但更新文章评论数失败',
      deletedComment: data 
    }, { status: 200 })
  }

  return NextResponse.json({ 
    message: '评论删除成功', 
    deletedComment: data 
  }, { status: 200 })
}
