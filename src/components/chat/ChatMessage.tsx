import React from 'react'
import type { ChatMessage as ChatMessageType } from '../../types'
import './ChatMessage.css'

interface ChatMessageProps {
  message: ChatMessageType
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const renderContent = () => {
    if (message.type === 'code') {
      return (
        <div className="message-content">
          <div className="message-text">{message.content}</div>
          <pre className="code-block">
            <code>{message.content}</code>
          </pre>
        </div>
      )
    }

    // 检查内容中是否包含代码块 (markdown风格)
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(message.content)) !== null) {
      // 添加代码块前的文本
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: message.content.slice(lastIndex, match.index)
        })
      }

      // 添加代码块
      parts.push({
        type: 'code',
        language: match[1],
        content: match[2]
      })

      lastIndex = match.index + match[0].length
    }

    // 添加剩余文本
    if (lastIndex < message.content.length) {
      parts.push({
        type: 'text',
        content: message.content.slice(lastIndex)
      })
    }

    // 如果没有代码块，显示纯文本
    if (parts.length === 0) {
      return <div className="message-text">{message.content}</div>
    }

    return (
      <div className="message-content">
        {parts.map((part, index) => {
          if (part.type === 'code') {
            return (
              <pre key={index} className="code-block">
                <div className="code-header">
                  <span className="code-language">{part.language || 'typst'}</span>
                  <button 
                    className="copy-button"
                    onClick={() => navigator.clipboard.writeText(part.content)}
                    title="复制代码"
                  >
                    📋
                  </button>
                </div>
                <code>{part.content}</code>
              </pre>
            )
          }
          return (
            <div key={index} className="message-text">
              {part.content.split('\n').map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  {lineIndex < part.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`chat-message ${message.role}`}>
      <div className="message-header">
        <span className="message-role">
          {message.role === 'user' ? '👤 你' : '🤖 AI'}
        </span>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
      {renderContent()}
    </div>
  )
}