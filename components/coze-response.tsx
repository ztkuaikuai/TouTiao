'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Bot } from 'lucide-react'
import { Button } from './ui/button'

interface CozeResponseProps {
  keyword: string
  userId: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function CozeResponse({ keyword, userId }: CozeResponseProps) {
  const [response, setResponse] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCozeResponse = async () => {
      if (!keyword) return
      if (userId === 'anonymous') return

      setLoading(true)
      setResponse('') // 清空之前的响应
      try {
        const res = await fetch('https://api.coze.cn/v3/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer pat_xsKmDnfYdO1hfax0kp4TQaL3XFP0aKD8yOdJJ3d06LPOiwJsWh2hLv1pDoyBodV2'
          },
          body: JSON.stringify({
            bot_id: "7508678457359138825",
            additional_messages: [
              {
                role: 'user',
                content: keyword,
                content_type: "text"
              }
            ],
            user_id: userId,
            stream: true // 启用流式响应
          })
        })

        if (!res.ok) {
          let errorBody = `错误状态: ${res.status}`;
          try {
            const errorData = await res.json();
            errorBody = `错误: ${errorData.code || res.status}, 信息: ${errorData.message || '未知服务器错误'}`;
          } catch (e) {
            try {
              errorBody = await res.text() || errorBody;
            } catch (e2) { /* 忽略读取文本错误 */ }
          }
          throw new Error(`请求失败. ${errorBody}`);
        }

        if (!res.body) {
          throw new Error('响应体为空');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let unprocessedBuffer = '';

        const processSSEBlock = (block: string) => {
          const lines = block.split('\n');
          let eventName = 'message';
          let dataAccumulator: string[] = [];

          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventName = line.substring('event:'.length).trim();
            } else if (line.startsWith('data:')) {
              dataAccumulator.push(line.substring('data:'.length).trimStart());
            }
          }

          if (dataAccumulator.length > 0) {
            const jsonDataString = dataAccumulator.join('\n');
            if (eventName === 'conversation.message.delta') {
              try {
                const parsedData = JSON.parse(jsonDataString);
                if (parsedData.content && parsedData.type === 'answer' && typeof parsedData.content === 'string') {
                  setResponse(prev => prev + parsedData.content);
                }
              } catch (e) {
                console.error(`无法解析 ${eventName} JSON:`, jsonDataString, e);
              }
            } else if (eventName === 'done') {
              console.log("收到 'event: done'. Coze 认为对话已完成.");
              // Coze 'done' 事件的 data 包含完整的最终消息。
              // Delta 累积应该已经形成了完整的消息。
              // 此事件主要用于确认结束。
              // 加载状态将在 finally 块中处理。
            }
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if (unprocessedBuffer.trim().length > 0) {
              processSSEBlock(unprocessedBuffer + "\n\n"); // 处理可能剩余的片段
            }
            break;
          }

          unprocessedBuffer += decoder.decode(value, { stream: true });

          let eomIndex; // 消息结束标记
          while ((eomIndex = unprocessedBuffer.indexOf('\n\n')) >= 0) {
            const messageBlock = unprocessedBuffer.substring(0, eomIndex);
            unprocessedBuffer = unprocessedBuffer.substring(eomIndex + 2);
            processSSEBlock(messageBlock);
          }
        }

      } catch (error: any) {
        console.error('Coze API 调用失败:', error);
        setResponse(prev => prev + (prev.length > 0 ? '\n' : '') + `抱歉，服务暂时出现问题: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchCozeResponse()
  }, [keyword, userId])

  if (!keyword || (!loading && !response)) return null

  return (
    <Card className="mt-6 bg-gradient-to-r from-red-50 to-orange-50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI 总结</h3>
            {loading && response.length === 0 ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            ) : (
              <div className="text-gray-700 whitespace-pre-wrap">{response}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 