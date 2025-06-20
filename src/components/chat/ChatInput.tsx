import React, { useState, useRef, KeyboardEvent } from 'react'
import './ChatInput.css'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false 
}) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage)
      setMessage('')
      // 重置textarea高度
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // 自动调整高度
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  const quickPrompts = [
    '创建学术论文模板',
    '生成简历模板',
    '帮我修改格式',
    '添加数学公式',
  ]

  const handleQuickPrompt = (prompt: string) => {
    if (!disabled) {
      onSendMessage(prompt)
    }
  }

  return (
    <div className="chat-input-container">
      {message.length === 0 && (
        <div className="quick-prompts">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              className="quick-prompt-button"
              onClick={() => handleQuickPrompt(prompt)}
              disabled={disabled}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="输入你的问题或需求... (Enter发送，Shift+Enter换行)"
          className="chat-textarea"
          disabled={disabled}
          rows={1}
        />
        
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="send-button"
          title="发送消息"
        >
          {disabled ? '⏳' : '📤'}
        </button>
      </div>
      
      <div className="input-hint">
        <span>💡 提示：你可以要求我创建模板、修改内容、解答语法问题等</span>
      </div>
    </div>
  )
}