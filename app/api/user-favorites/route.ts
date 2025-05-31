import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

// 获取用户收藏的文章
export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const user_id = searchParams.get('user_id')

    if (!user_id) {
        return NextResponse.json({ error: '用户ID是必需的' }, { status: 400 })
    }

    try {
        // 先获取用户收藏的文章ID列表
        const { data: favorites, error: favoritesError } = await supabase
            .from('favorites')
            .select('article_id')
            .eq('user_id', user_id)

        if (favoritesError) {
            return NextResponse.json({ error: favoritesError.message }, { status: 500 })
        }

        if (!favorites || favorites.length === 0) {
            return NextResponse.json([])
        }

        // 提取文章ID
        const articleIds = favorites.map(fav => fav.article_id)

        // 获取这些文章的详细信息
        const { data: articles, error: articlesError } = await supabase
            .from('articles')
            .select(`
            *,
            author:user-profiles!author_id(user_id, name, avatar_url)
            `)
            .in('id', articleIds)

        if (articlesError) {
            return NextResponse.json({ error: articlesError.message }, { status: 500 })
        }

        return NextResponse.json(articles || [])
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
