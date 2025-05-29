'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface CozeResponseProps {
  keyword: string
  userId: string
}

export default function CozeResponse({ keyword, userId }: CozeResponseProps) {
  console.log('keyword', keyword, userId)
  const [response, setResponse] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    console.log('CozeResponse useEffect - keyword:', keyword, 'userId:', userId);

    if (!keyword || userId === 'anonymous') {
      setLoading(false);
      setResponse('');
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    const fetchCozeResponse = async () => {
      setLoading(true);
      setResponse('');
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
            stream: true
          }),
          signal
        });

        if (signal.aborted) return;

        if (!res.ok) {
          let errorBody = `错误状态: ${res.status}`;
          try {
            const errorData = await res.json();
            if (signal.aborted) return;
            errorBody = `错误: ${errorData.code || res.status}, 信息: ${errorData.message || '未知服务器错误'}`;
          } catch (e) {
            if (signal.aborted) return;
            try {
              errorBody = await res.text() || errorBody;
            } catch (e2) { /* 忽略读取文本错误 */ }
          }
          if (signal.aborted) return;
          throw new Error(`请求失败. ${errorBody}`);
        }

        if (!res.body) {
          if (signal.aborted) return;
          throw new Error('响应体为空');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let unprocessedBuffer = '';

        const processSSEBlock = (block: string) => {
          if (signal.aborted) return;
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
                if (signal.aborted) return;
                if (parsedData.content && parsedData.type === 'answer' && typeof parsedData.content === 'string') {
                  setResponse(prev => prev + parsedData.content);
                }
              } catch (e) {
                if (!signal.aborted) {
                  console.error(`无法解析 ${eventName} JSON:`, jsonDataString, e);
                }
              }
            } else if (eventName === 'done') {
              console.log("收到 'event: done'. Coze 认为对话已完成.");
            }
          }
        };

        while (true) {
          if (signal.aborted) {
            reader.cancel().catch(() => {});
            break;
          }
          const { done, value } = await reader.read();
          if (signal.aborted) break; 

          if (done) {
            if (unprocessedBuffer.trim().length > 0) {
              processSSEBlock(unprocessedBuffer + "\n\n");
            }
            break;
          }

          unprocessedBuffer += decoder.decode(value, { stream: true });
          let eomIndex;
          while ((eomIndex = unprocessedBuffer.indexOf('\n\n')) >= 0) {
            if (signal.aborted) break;
            const messageBlock = unprocessedBuffer.substring(0, eomIndex);
            unprocessedBuffer = unprocessedBuffer.substring(eomIndex + 2);
            processSSEBlock(messageBlock);
          }
          if (signal.aborted) break; 
        }

      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else if (!signal.aborted) {
          console.error('Coze API 调用失败:', error);
          setResponse(prev => prev + (prev.length > 0 ? '\n' : '') + `抱歉，服务暂时出现问题: ${error.message}`);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCozeResponse();

    return () => {
      console.log('CozeResponse useEffect cleanup - keyword:', keyword, 'userId:', userId);
      if (controller) {
        controller.abort();
      }
      abortControllerRef.current = null;
    };
  }, [keyword, userId]);

  if (!keyword || (userId !== 'anonymous' && !loading && !response)) {
    if (userId === 'anonymous' && !keyword) return null;
    if (keyword && userId !== 'anonymous' && !loading && !response) return null;
    if (!keyword && !loading && !response) return null;
  }

  const showLoadingSpinner = loading && response.length === 0;
  const showNoKeywordMessage = !keyword && userId !== 'anonymous';

  if (showNoKeywordMessage) return null;
  if (!keyword && userId === 'anonymous') return null;

  if (!loading && !response && !keyword) return null;
  if (!loading && !response && userId === 'anonymous') return null;
  
  if (!loading && !response) {
    return null;
  }

  return (
    <Card className="mt-6 bg-gradient-to-r from-red-50 to-orange-50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI 总结</h3>
            {showLoadingSpinner ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            ) : response ? (
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p className="text-gray-700 whitespace-pre-wrap" {...props} />,
                    a: ({node, ...props}) => <a className="underline" target='_blank' {...props} />,
                  }}
                >
                  {response}
                </ReactMarkdown>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 