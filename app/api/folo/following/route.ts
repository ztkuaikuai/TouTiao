// 关注
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const follower_id = searchParams.get('follower_id')

  if (!follower_id) {
    return NextResponse.json({ error: '缺少必要参数：follower_id' }, { status: 400 })
  }

  try {
    // 联表查询：获取用户关注的所有人的信息
    const { data, error } = await supabase
      .from('follows')
      .select(`
        followed_id,
        created_at,
        followed:user-profiles!followed_id (
          user_id,
          name,
          avatar_url
        )
      `)
      .eq('follower_id', follower_id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// 添加关注
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  try {
    const { follower_id, followed_id } = await request.json()

    if (!follower_id || !followed_id) {
      return NextResponse.json({ error: '缺少必要参数：follower_id 或 followed_id' }, { status: 400 })
    }

    // 检查是否已经关注
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', follower_id)
      .eq('followed_id', followed_id)
      .maybeSingle()

    if (existingFollow) {
      return NextResponse.json({ error: '已经关注该用户' }, { status: 400 })
    }

    // 添加关注关系
    const { data, error } = await supabase
      .from('follows')
      .insert([
        {
          follower_id,
          followed_id
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }
}

// 取消关注
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const follower_id = searchParams.get('follower_id')
  const followed_id = searchParams.get('followed_id')

  if (!follower_id || !followed_id) {
    return NextResponse.json({ error: '缺少必要参数：follower_id 或 followed_id' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', follower_id)
    .eq('followed_id', followed_id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: '未找到关注记录' }, { status: 404 })
  }

  return NextResponse.json({ message: '取消关注成功', deletedFollow: data }, { status: 200 })
}