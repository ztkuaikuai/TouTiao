import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// 添加点赞
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  try {
    const { user_id, article_id } = await request.json()

    if (!user_id || !article_id) {
      return NextResponse.json({ error: '缺少必要参数：user_id 或 article_id' }, { status: 400 })
    }

    // 检查是否已经点赞
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user_id)
      .eq('article_id', article_id)
      .maybeSingle()

    if (existingLike) {
      return NextResponse.json({ error: '已经点赞该文章' }, { status: 400 })
    }

    // 添加点赞记录
    const { data: likeData, error: likeError } = await supabase
      .from('likes')
      .insert([
        {
          user_id,
          article_id
        }
      ])
      .select()
      .single()

    if (likeError) {
      return NextResponse.json({ error: likeError.message }, { status: 500 })
    }

    // 先获取当前文章的点赞数
    const { data: currentArticle, error: getArticleError } = await supabase
      .from('articles')
      .select('likes_count')
      .eq('id', article_id)
      .single()

    if (getArticleError) {
      return NextResponse.json({ error: getArticleError.message }, { status: 500 })
    }

    // 计算新的点赞数
    const newLikesCount = (currentArticle.likes_count || 0) + 1

    // 更新文章点赞数
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .update({ likes_count: newLikesCount })
      .eq('id', article_id)
      .select('likes_count')
      .single()

    if (articleError) {
      return NextResponse.json({ error: articleError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      like: likeData, 
      likes_count: articleData.likes_count 
    }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }
}

// 取消点赞
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const user_id = searchParams.get('user_id')
  const article_id = searchParams.get('article_id')

  if (!user_id || !article_id) {
    return NextResponse.json({ error: '缺少必要参数：user_id 或 article_id' }, { status: 400 })
  }

  try {
    // 检查是否已经点赞
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user_id)
      .eq('article_id', article_id)
      .maybeSingle()

    if (!existingLike) {
      return NextResponse.json({ error: '未点赞该文章' }, { status: 400 })
    }

    // 删除点赞记录
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', user_id)
      .eq('article_id', article_id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // 先获取当前文章的点赞数
    const { data: currentArticle, error: getArticleError } = await supabase
      .from('articles')
      .select('likes_count')
      .eq('id', article_id)
      .single()

    if (getArticleError) {
      return NextResponse.json({ error: getArticleError.message }, { status: 500 })
    }

    // 计算新的点赞数，确保不会小于0
    const newLikesCount = Math.max(0, (currentArticle.likes_count || 0) - 1)

    // 更新文章点赞数
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .update({ likes_count: newLikesCount })
      .eq('id', article_id)
      .select('likes_count')
      .single()

    if (articleError) {
      return NextResponse.json({ error: articleError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      likes_count: articleData.likes_count 
    })
  } catch (e) {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// 查询用户是否点赞了特定文章
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const user_id = searchParams.get('user_id')
  const article_id = searchParams.get('article_id')

  if (!user_id || !article_id) {
    return NextResponse.json({ error: '缺少必要参数：user_id 或 article_id' }, { status: 400 })
  }

  try {
    // 查询是否存在点赞记录
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user_id)
      .eq('article_id', article_id)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 返回是否已点赞的结果
    return NextResponse.json({ 
      is_liked: !!data,
      like_data: data || null
    })
  } catch (e) {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
