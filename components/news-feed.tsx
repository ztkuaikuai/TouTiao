import NewsCard from "./news-card"

const newsData = [
  {
    title: "习近平向中国西部国际博览会致贺信",
    source: "新华社",
    time: "2025.05.25 星期日",
    category: "今日",
    comments: 128,
    views: 5420,
  },
  {
    title: "这件事 习近平很早就要求从娃娃抓起",
    summary: '从"劳观者"到"闯中人"',
    source: "人民日报",
    time: "22分钟",
    comments: 89,
    views: 3210,
  },
  {
    title: 'Ah181岁老人和她19岁的司马"重逢"',
    source: "央视新闻",
    time: "1小时前",
    image: "/placeholder.svg?height=96&width=128",
    comments: 256,
    views: 8930,
  },
  {
    title: '文博会观察：中国非遗产品"圈粉"海内外',
    source: "中新网",
    time: "2小时前",
    comments: 45,
    views: 1820,
  },
  {
    title: "新冠又抬头 该怎样应对？钟南山给出三点建议",
    summary: "个人信息防护建议！我国培推广应用家庭网络健身优证公共服务",
    source: "大众新闻半岛都市报",
    time: "前天18:31",
    image: "/placeholder.svg?height=96&width=128",
    comments: 342,
    views: 12450,
  },
  {
    title: "美国政府高校调查难查金分收征，矛头直指情报大学",
    source: "广州日报",
    time: "20小时前",
    image: "/placeholder.svg?height=96&width=128",
    comments: 178,
    views: 6780,
  },
  {
    title: "不懂不说，持朗者来源了",
    source: "牛弹琴",
    time: "372评论",
    image: "/placeholder.svg?height=96&width=128",
    isVideo: true,
    duration: "06:36",
    comments: 372,
    views: 15620,
  },
  {
    title: "听听美国国会，是怎么讨论我们的",
    source: "客观茶室",
    time: "658评论",
    image: "/placeholder.svg?height=96&width=128",
    isVideo: true,
    duration: "04:44",
    comments: 658,
    views: 22340,
  },
]

export default function NewsFeed() {
  return (
    <div className="space-y-4">
      {newsData.map((news, index) => (
        <NewsCard
          key={index}
          title={news.title}
          summary={news.summary}
          image={news.image}
          source={news.source}
          time={news.time}
          comments={news.comments}
          views={news.views}
          isVideo={news.isVideo}
          duration={news.duration}
          category={news.category}
        />
      ))}
    </div>
  )
}
