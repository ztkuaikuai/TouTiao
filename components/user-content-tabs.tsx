"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import UserArticles from "./user-articles"
import UserFavorites from "./user-favorites"

const tabs = [
  { id: "articles", name: "文章", active: true },
  { id: "favorites", name: "收藏", active: false },
]

export default function UserContentTabs() {
  const [activeTab, setActiveTab] = useState("articles")

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="flex items-center border-b border-gray-200">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className={`rounded-none border-0 ${
                      activeTab === tab.id
                        ? "bg-transparent text-red-500 border-b-2 border-red-500"
                        : "text-gray-700 hover:text-red-500"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.name}
                  </Button>
                ))}
              </div>

              {activeTab === "articles" && <UserArticles />}
              {activeTab === "favorites" && <UserFavorites />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
