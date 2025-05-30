import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// 定义文章类型 (基于图片中的表结构)
export interface Article {
  id?: number
  title: string
  content: string
  author_id: string // uuid
  created_at?: string
  likes_count?: number
  favorites_count?: number
  views_count?: number
  comments_count?: number
  author?: {
    user_id: string
    name: string
    avatar_url: string
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (id) {
    // 获取单篇文章，包括作者信息
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:user-profiles!author_id(user_id, name, avatar_url)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json(data)
  } else {
    // 获取文章列表，包括作者信息
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:user-profiles!author_id(user_id, name, avatar_url)
      `)
      .order('created_at', { ascending: false }) // 按创建时间降序

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  try {
    const articleData = (await request.json()) as Omit<Article, 'id' | 'created_at' | 'likes_count' | 'favorites_count' | 'views_count' | 'comments_count'>

    if (!articleData.title || !articleData.content || !articleData.author_id) {
      return NextResponse.json({ error: 'Missing required fields: title, content, author_id' }, { status: 400 })
    }

    // created_at 会自动生成，其他计数器默认为0或由数据库触发器处理
    const { data, error } = await supabase
      .from('articles')
      .insert([
        {
          title: articleData.title,
          content: articleData.content,
          author_id: articleData.author_id,
          // likes_count, favorites_count, views_count, comments_count 默认为0或由数据库处理
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing article ID' }, { status: 400 })
  }

  try {
    const articleUpdateData = (await request.json()) as Partial<Pick<Article, 'title' | 'content'>>

    if (Object.keys(articleUpdateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update provided' }, { status: 400 })
    }
    
    const updatePayload: Partial<Article> = {};
    if (articleUpdateData.title) {
        updatePayload.title = articleUpdateData.title;
    }
    if (articleUpdateData.content) {
        updatePayload.content = articleUpdateData.content;
    }


    const { data, error } = await supabase
      .from('articles')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data) {
        return NextResponse.json({ error: 'Article not found or no changes made' }, { status: 404 });
    }
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing article ID' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
   if (!data) {
      // Supabase delete returns the deleted record. If it's null and no error, it means record not found.
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
  // Successfully deleted, return 204 No Content or the deleted item
  return NextResponse.json({ message: 'Article deleted successfully', deletedArticle: data }, { status: 200 })
}
