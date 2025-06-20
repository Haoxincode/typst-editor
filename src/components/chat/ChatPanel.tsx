import React, { useState } from 'react'
import { useEditorStore } from '../../stores/editor-store'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import type { ChatMessage as ChatMessageType } from '../../types'
import './ChatPanel.css'

export const ChatPanel: React.FC = () => {
  const { 
    chatMessages, 
    addChatMessage, 
    clearChatMessages,
    updateDocumentContent 
  } = useEditorStore()
  
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // 添加用户消息
    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      type: 'text'
    }
    addChatMessage(userMessage)
    
    setIsLoading(true)
    
    try {
      // TODO: 调用AI服务
      // 模拟AI响应
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const aiResponse = await mockAIResponse(content)
      
      const assistantMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse.text,
        timestamp: new Date(),
        type: aiResponse.type
      }
      
      addChatMessage(assistantMessage)
      
      // 如果AI返回了代码，更新编辑器内容
      if (aiResponse.code) {
        updateDocumentContent(aiResponse.code)
      }
      
    } catch (error) {
      console.error('AI response error:', error)
      const errorMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '抱歉，处理您的请求时出现了错误，请稍后再试。',
        timestamp: new Date(),
        type: 'text'
      }
      addChatMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>AI 助手</h3>
        <button 
          className="clear-button" 
          onClick={clearChatMessages}
          title="清空对话"
        >
          🗑️
        </button>
      </div>
      
      <div className="chat-messages">
        {chatMessages.length === 0 ? (
          <div className="empty-state">
            <p>👋 你好！我是 Typst 编辑助手</p>
            <p>你可以：</p>
            <ul>
              <li>让我帮你创建文档模板</li>
              <li>修改现有内容</li>
              <li>解答 Typst 语法问题</li>
              <li>优化文档排版</li>
            </ul>
          </div>
        ) : (
          chatMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="loading-message">
            <div className="loading-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>AI 正在思考...</span>
          </div>
        )}
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  )
}

// 模拟AI响应 - 实际项目中需要接入真实的AI服务
async function mockAIResponse(userInput: string): Promise<{
  text: string
  code?: string
  type: 'text' | 'code'
}> {
  const input = userInput.toLowerCase()
  
  if (input.includes('学术论文') || input.includes('ieee')) {
    return {
      text: '我来帮你创建一个IEEE格式的学术论文模板：',
      code: `#import "@preview/ieee:1.0.0": ieee

#show: ieee.with(
  title: [论文标题],
  authors: (
    (name: "作者姓名", organization: [研究机构], email: "author@example.com")
  ),
  abstract: [
    这里是摘要内容。简要描述研究的目的、方法、结果和结论。
  ],
  keywords: ("关键词1", "关键词2", "关键词3"),
)

= 引言

这里开始写你的论文内容...

= 相关工作

= 方法

= 实验结果

= 结论`,
      type: 'code'
    }
  }
  
  if (input.includes('简历')) {
    return {
      text: '我为你生成了一个现代简历模板：',
      code: `#set page(margin: (x: 0.8in, y: 0.6in))
#set text(font: "Arial", size: 11pt)

#align(center)[
  #text(24pt, weight: "bold")[你的姓名]
  #text(12pt)[
    邮箱：your.email@example.com | 电话：+86 138 0000 0000
  ]
]

#line(length: 100%, stroke: 0.5pt)

== 教育背景
*大学名称* #h(1fr) 2020-2024 \\
专业名称学士学位 #h(1fr) GPA: 3.8/4.0

== 工作经验
*公司名称* - 职位名称 #h(1fr) 2023-至今
- 工作职责描述
- 主要成就

== 项目经验
*项目名称* #h(1fr) 2023
- 项目描述和你的贡献
- 使用的技术栈

== 技能
*编程语言：* Python, JavaScript, Java
*框架工具：* React, Node.js, Docker`,
      type: 'code'
    }
  }
  
  return {
    text: `我理解你想要${userInput}。让我为你提供一些建议和帮助。你可以更具体地描述你的需求，比如：
    
• 想要什么类型的文档？
• 有什么特殊的格式要求？
• 需要包含哪些部分？

这样我就能为你生成更准确的内容了！`,
    type: 'text'
  }
}