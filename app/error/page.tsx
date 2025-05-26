'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ErrorPage({}) {
    const router = useRouter()
    return (<>
        <div className="flex flex-col justify-center items-center h-screen text-4xl font-bold text-gray-500">
            抱歉，出了些问题
            <Button className="my-4" onClick={() => router.push('/')}>返回主页</Button>
        </div>
    </>)
}