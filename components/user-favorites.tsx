"use client"

import React from 'react'

const UserFavorites = () => {
    return (<>
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
    </>)
}

export default UserFavorites