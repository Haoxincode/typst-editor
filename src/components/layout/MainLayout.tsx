import React from 'react'
import { ChatPanel } from '../chat/ChatPanel'
import { Editor } from '../editor/Editor'
import { PreviewPanel } from '../preview/PreviewPanel'
import { useEditorStore } from '../../stores/editor-store'
import './MainLayout.css'

export const MainLayout: React.FC = () => {
  const { isChatPanelOpen, isPreviewPanelOpen } = useEditorStore()

  return (
    <div className="main-layout">
      <div className="layout-container">
        {/* 左侧聊天面板 */}
        {isChatPanelOpen && (
          <div className="chat-panel-container">
            <ChatPanel />
          </div>
        )}
        
        {/* 中央编辑器 */}
        <div className="editor-container">
          <Editor />
        </div>
        
        {/* 右侧预览面板 */}
        {isPreviewPanelOpen && (
          <div className="preview-panel-container">
            <PreviewPanel />
          </div>
        )}
      </div>
    </div>
  )
}