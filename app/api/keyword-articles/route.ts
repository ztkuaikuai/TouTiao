import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { Article } from '../articles/route'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const keyword = searchParams.get('keyword')

  if (!keyword) {
    return NextResponse.json({ error: '请提供搜索关键词' }, { status: 400 })
  }

  try {
    // 使用ILIKE进行模糊查询，%表示任意字符
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:user-profiles!author_id(user_id, name, avatar_url)
      `)
      .ilike('title', `%${keyword}%`)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    console.log('like', data)
    return NextResponse.json({ 
      keyword,
      total: data.length,
      articles: data 
    })
  } catch (e) {
    return NextResponse.json({ error: '搜索请求处理失败' }, { status: 500 })
  }
}
