"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const tabs = [
  { id: "articles", name: "文章", active: true },
  { id: "favorites", name: "收藏", active: false },
]

export default function UserContentTabs() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

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

              {/* Content */}
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="w-32 h-32 mx-auto mb-4 opacity-50">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <circle cx="100" cy="80" r="30" fill="#e5e7eb" />
                      <path d="M70 80 Q100 50 130 80 Q130 120 100 140 Q70 120 70 80" fill="#e5e7eb" />
                      <circle cx="90" cy="75" r="3" fill="#9ca3af" />
                      <circle cx="110" cy="75" r="3" fill="#9ca3af" />
                      <path d="M95 85 Q100 90 105 85" stroke="#9ca3af" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                  <p className="text-gray-500">暂无内容</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
