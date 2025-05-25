import Header from "@/components/header"
import Navigation from "@/components/navigation"
import NewsFeed from "@/components/news-feed"
import TrendingSidebar from "@/components/trending-sidebar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <NewsFeed />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TrendingSidebar />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">
              加入头条
            </a>
            <a href="#" className="hover:text-gray-900">
              用户协议
            </a>
            <a href="#" className="hover:text-gray-900">
              隐私政策
            </a>
            <a href="#" className="hover:text-gray-900">
              媒体合作
            </a>
            <a href="#" className="hover:text-gray-900">
              广告合作
            </a>
            <a href="#" className="hover:text-gray-900">
              友情链接
            </a>
            <a href="#" className="hover:text-gray-900">
              更多
            </a>
            <a href="#" className="hover:text-gray-900">
              下载今日头条APP
            </a>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500">
            <p>北京科技有限公司版权所有 违法和不良信息举报：400-140-2108 举报邮箱：jubao@toutiao.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
