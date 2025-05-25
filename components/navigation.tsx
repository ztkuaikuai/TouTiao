"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

const categories = [
  { name: "关注", active: false },
  { name: "推荐", active: true },
  { name: "北京", active: false, hasDropdown: true },
  { name: "视频", active: false },
  { name: "财经", active: false },
  { name: "科技", active: false },
  { name: "热点", active: false },
  { name: "国际", active: false },
  { name: "更多", active: false, hasDropdown: true },
]

export default function Navigation() {
  const [activeCategory, setActiveCategory] = useState("推荐")

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-8 py-3">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={activeCategory === category.name ? "default" : "ghost"}
              className={`flex items-center space-x-1 ${
                activeCategory === category.name
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "text-gray-700 hover:text-red-500"
              }`}
              onClick={() => setActiveCategory(category.name)}
            >
              <span>{category.name}</span>
              {category.hasDropdown && <ChevronDown className="w-4 h-4" />}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}
