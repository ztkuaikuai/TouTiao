"use client"

import { useState, useEffect } from "react"
import { RefreshCw, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function FloatingActionButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      window.location.reload()
    }, 300)
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
      {/* Refresh Button */}
      <div className="group relative">
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          size="icon"
          className={cn(
            "h-12 w-12 rounded-full bg-white shadow-lg border border-gray-200",
            "hover:shadow-xl hover:scale-105 transition-all duration-200",
            "focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
          variant="outline"
        >
          <RefreshCw
            className={cn(
              "h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors duration-200",
              isRefreshing && "animate-spin",
            )}
          />
        </Button>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            刷新
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <div
        className={cn(
          "group relative transition-all duration-300",
          showScrollTop
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none",
        )}
      >
        <Button
          onClick={scrollToTop}
          size="icon"
          className={cn(
            "h-12 w-12 rounded-full bg-white shadow-lg border border-gray-200",
            "hover:shadow-xl hover:scale-105 transition-all duration-200",
            "focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
          )}
          variant="outline"
        >
          <ChevronUp className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
        </Button>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            顶部
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .fixed {
            bottom: 1.5rem;
            right: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
