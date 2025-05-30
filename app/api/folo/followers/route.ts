// 粉丝
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const followed_id = searchParams.get('followed_id')

  if (!followed_id) {
    return NextResponse.json({ error: '缺少必要参数：followed_id' }, { status: 400 })
  }

  try {
    // 联表查询：获取关注该用户的所有粉丝信息
    const { data, error } = await supabase
      .from('follows')
      .select(`
        follower_id,
        created_at,
        follower:user-profiles!follower_id (
          user_id,
          name,
          avatar_url
        )
      `)
      .eq('followed_id', followed_id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}