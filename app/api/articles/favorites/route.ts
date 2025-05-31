import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// 添加收藏
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  try {
    const { user_id, article_id } = await request.json()

    if (!user_id || !article_id) {
      return NextResponse.json({ error: '缺少必要参数：user_id 或 article_id' }, { status: 400 })
    }

    // 检查是否已经收藏
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user_id)
      .eq('article_id', article_id)
      .maybeSingle()

    if (existingFavorite) {
      return NextResponse.json({ error: '已经收藏该文章' }, { status: 400 })
    }

    // 添加收藏记录
    const { data: favoriteData, error: favoriteError } = await supabase
      .from('favorites')
      .insert([
        {
          user_id,
          article_id
        }
      ])
      .select()
      .single()

    if (favoriteError) {
      return NextResponse.json({ error: favoriteError.message }, { status: 500 })
    }

    // 先获取当前文章的收藏数
    const { data: currentArticle, error: getArticleError } = await supabase
      .from('articles')
      .select('favorites_count')
      .eq('id', article_id)
      .single()

    if (getArticleError) {
      return NextResponse.json({ error: getArticleError.message }, { status: 500 })
    }

    // 计算新的收藏数
    const newFavoritesCount = (currentArticle.favorites_count || 0) + 1

    // 更新文章收藏数
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .update({ favorites_count: newFavoritesCount })
      .eq('id', article_id)
      .select('favorites_count')
      .single()

    if (articleError) {
      return NextResponse.json({ error: articleError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      favorite: favoriteData, 
      favorites_count: articleData.favorites_count 
    }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }
}

// 取消收藏
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const user_id = searchParams.get('user_id')
  const article_id = searchParams.get('article_id')

  if (!user_id || !article_id) {
    return NextResponse.json({ error: '缺少必要参数：user_id 或 article_id' }, { status: 400 })
  }

  try {
    // 检查是否已经收藏
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user_id)
      .eq('article_id', article_id)
      .maybeSingle()

    if (!existingFavorite) {
      return NextResponse.json({ error: '未收藏该文章' }, { status: 400 })
    }

    // 删除收藏记录
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user_id)
      .eq('article_id', article_id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // 先获取当前文章的收藏数
    const { data: currentArticle, error: getArticleError } = await supabase
      .from('articles')
      .select('favorites_count')
      .eq('id', article_id)
      .single()

    if (getArticleError) {
      return NextResponse.json({ error: getArticleError.message }, { status: 500 })
    }

    // 计算新的收藏数，确保不会小于0
    const newFavoritesCount = Math.max(0, (currentArticle.favorites_count || 0) - 1)

    // 更新文章收藏数
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .update({ favorites_count: newFavoritesCount })
      .eq('id', article_id)
      .select('favorites_count')
      .single()

    if (articleError) {
      return NextResponse.json({ error: articleError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      favorites_count: articleData.favorites_count 
    })
  } catch (e) {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// 查询用户是否收藏了特定文章
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const user_id = searchParams.get('user_id')
  const article_id = searchParams.get('article_id')

  if (!user_id || !article_id) {
    return NextResponse.json({ error: '缺少必要参数：user_id 或 article_id' }, { status: 400 })
  }

  try {
    // 查询是否存在收藏记录
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user_id)
      .eq('article_id', article_id)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 返回是否已收藏的结果
    return NextResponse.json({ 
      is_favorited: !!data,
      favorite_data: data || null
    })
  } catch (e) {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
