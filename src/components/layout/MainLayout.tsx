import React, { useState, useRef, useCallback } from 'react'
import { ChatPanel } from '../chat/ChatPanel'
import { Editor } from '../editor/Editor'
import { PreviewPanel } from '../preview/PreviewPanel'
import { useEditorStore } from '../../stores/editor-store'
import './MainLayout.css'

export const MainLayout: React.FC = () => {
  const { isChatPanelOpen, isPreviewPanelOpen } = useEditorStore()
  
  const [chatPanelWidth, setChatPanelWidth] = useState(320)
  const [previewPanelWidth, setPreviewPanelWidth] = useState(400)
  const [isDraggingChat, setIsDraggingChat] = useState(false)
  const [isDraggingPreview, setIsDraggingPreview] = useState(false)
  
  const layoutRef = useRef<HTMLDivElement>(null)

  const handleChatResize = useCallback((e: React.MouseEvent) => {
    if (!layoutRef.current) return
    
    setIsDraggingChat(true)
    const startX = e.clientX
    const startWidth = chatPanelWidth

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const newWidth = Math.max(280, Math.min(400, startWidth + deltaX))
      setChatPanelWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDraggingChat(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [chatPanelWidth])

  const handlePreviewResize = useCallback((e: React.MouseEvent) => {
    if (!layoutRef.current) return
    
    setIsDraggingPreview(true)
    const startX = e.clientX
    const startWidth = previewPanelWidth

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX
      const newWidth = Math.max(300, Math.min(600, startWidth + deltaX))
      setPreviewPanelWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDraggingPreview(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [previewPanelWidth])

  return (
    <div className="main-layout">
      <div 
        className={`layout-container ${isDraggingChat || isDraggingPreview ? 'dragging' : ''}`}
        ref={layoutRef}
      >
        {/* 左侧聊天面板 */}
        {isChatPanelOpen && (
          <>
            <div 
              className="chat-panel-container"
              style={{ width: `${chatPanelWidth}px` }}
            >
              <ChatPanel />
            </div>
            <div 
              className="resize-handle resize-handle-chat"
              onMouseDown={handleChatResize}
            />
          </>
        )}
        
        {/* 中央编辑器 */}
        <div className="editor-container">
          <Editor />
        </div>
        
        {/* 右侧预览面板 */}
        {isPreviewPanelOpen && (
          <>
            <div 
              className="resize-handle resize-handle-preview"
              onMouseDown={handlePreviewResize}
            />
            <div 
              className="preview-panel-container"
              style={{ width: `${previewPanelWidth}px` }}
            >
              <PreviewPanel />
            </div>
          </>
        )}
      </div>
    </div>
  )
}