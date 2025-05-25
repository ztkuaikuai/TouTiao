import Image from "next/image"
import { MessageCircle, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface NewsCardProps {
  title: string
  summary?: string
  image?: string
  source: string
  time: string
  comments?: number
  views?: number
  isVideo?: boolean
  duration?: string
  category?: string
}

export default function NewsCard({
  title,
  summary,
  image,
  source,
  time,
  comments,
  views,
  isVideo,
  duration,
  category,
}: NewsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {category && (
                <Badge variant="destructive" className="text-xs">
                  {category}
                </Badge>
              )}
              <span className="text-sm text-gray-500">{source}</span>
              <span className="text-sm text-gray-400">{time}</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 hover:text-red-600">{title}</h3>
            {summary && <p className="text-gray-600 text-sm line-clamp-2 mb-3">{summary}</p>}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {comments && (
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments}</span>
                </div>
              )}
              {views && (
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{views}</span>
                </div>
              )}
            </div>
          </div>
          {image && (
            <div className="relative w-32 h-24 flex-shrink-0">
              <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover rounded" />
              {isVideo && duration && (
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                  {duration}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
