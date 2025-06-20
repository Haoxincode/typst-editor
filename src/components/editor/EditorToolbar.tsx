import React from 'react'
import { useEditorStore } from '../../stores/editor-store'
import './EditorToolbar.css'

export const EditorToolbar: React.FC = () => {
  const { 
    currentDocument, 
    editorState,
    saveDocument,
    toggleChatPanel,
    togglePreviewPanel,
    isChatPanelOpen,
    isPreviewPanelOpen
  } = useEditorStore()

  const handleSave = async () => {
    await saveDocument()
  }

  return (
    <div className="editor-toolbar">
      <div className="toolbar-left">
        <div className="document-info">
          <span className="document-title">
            {currentDocument?.title || '未命名文档'}
          </span>
          {editorState.isDirty && (
            <span className="dirty-indicator">●</span>
          )}
        </div>
      </div>
      
      <div className="toolbar-center">
        <div className="editor-status">
          <span className="cursor-position">
            第 {Math.floor(editorState.cursorPosition / 50) + 1} 行
          </span>
          {editorState.selection && (
            <span className="selection-info">
              已选择 {editorState.selection.to - editorState.selection.from} 个字符
            </span>
          )}
        </div>
      </div>
      
      <div className="toolbar-right">
        <button
          className={`toolbar-button ${isChatPanelOpen ? 'active' : ''}`}
          onClick={toggleChatPanel}
          title="切换聊天面板"
        >
          💬
        </button>
        
        <button
          className={`toolbar-button ${isPreviewPanelOpen ? 'active' : ''}`}
          onClick={togglePreviewPanel}
          title="切换预览面板"
        >
          👁️
        </button>
        
        <button
          className="toolbar-button save-button"
          onClick={handleSave}
          disabled={!editorState.isDirty}
          title="保存文档"
        >
          💾
        </button>
      </div>
    </div>
  )
}