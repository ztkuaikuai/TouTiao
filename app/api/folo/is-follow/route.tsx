import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const follower_id = searchParams.get('follower_id')
  const followed_id = searchParams.get('followed_id')

  if (!follower_id || !followed_id) {
    return NextResponse.json({ 
      error: '缺少必要参数：follower_id 或 followed_id' 
    }, { status: 400 })
  }

  try {
    // 查询是否存在关注关系
    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', follower_id)
      .eq('followed_id', followed_id)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 返回是否已关注的结果
    return NextResponse.json({ 
      is_following: !!data,
      follow_data: data || null
    })
  } catch (e) {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
