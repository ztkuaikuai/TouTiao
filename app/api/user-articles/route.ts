import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

// 获取用户发表的文章
export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const user_id = searchParams.get('user_id')

    if (!user_id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('articles')
        .select(`
        *,
        author:user-profiles!author_id(user_id, name, avatar_url)
        `)
        .eq('author_id', user_id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    
    return NextResponse.json(data)
}