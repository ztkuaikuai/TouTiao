import Image from "next/image"
import { MessageCircle, Heart, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/app/articles/[id]/page"

interface NewsCardProps {
  id: number
  title: string
  author: {
    name: string
  }
  created_at: string
  likes_count: number
  favorites_count: number
  comments_count: number
  onClick: () => void
}

export default function NewsCard({
  id,
  title,
  author: {
    name,
  },
  created_at,
  likes_count,
  favorites_count,
  comments_count,
  onClick,
}: NewsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-500">{name}</span>
              <span className="text-sm text-gray-400">{formatDate(created_at)}</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 hover:text-red-600">{title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {likes_count >= 0 && (
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{likes_count}</span>
                </div>
              )}
              {comments_count >= 0 && (
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments_count}</span>
                </div>
              )}
              {favorites_count >= 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{favorites_count}</span>
                </div>
              )}
            </div>
          </div>
          {/* {image && (
            <div className="relative w-32 h-24 flex-shrink-0">
              <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover rounded" />
              {isVideo && duration && (
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                  {duration}
                </div>
              )}
            </div>
          )} */}
        </div>
      </CardContent>
    </Card>
  )
}
