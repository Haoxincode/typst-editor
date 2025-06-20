import React, { useEffect, useState } from 'react'
import { useEditorStore } from '../../stores/editor-store'
import { typstCompiler } from '../../services/typst-compiler'
import './PreviewPanel.css'

export const PreviewPanel: React.FC = () => {
  const { 
    currentDocument, 
    previewState, 
    updatePreviewState 
  } = useEditorStore()
  
  const [previewMode, setPreviewMode] = useState<'pdf' | 'svg'>('svg')
  const [isCompilerReady, setIsCompilerReady] = useState(false)

  // 初始化编译器
  useEffect(() => {
    const initCompiler = async () => {
      try {
        await typstCompiler.initialize()
        setIsCompilerReady(true)
        console.log('Typst compiler is ready')
      } catch (error) {
        console.error('Failed to initialize Typst compiler:', error)
        updatePreviewState({ 
          error: '编译器初始化失败，请刷新页面重试' 
        })
      }
    }
    
    initCompiler()
  }, [updatePreviewState])

  useEffect(() => {
    if (currentDocument?.content && isCompilerReady) {
      compileTypst(currentDocument.content)
    }
  }, [currentDocument?.content, isCompilerReady, previewMode])

  const compileTypst = async (content: string) => {
    if (!isCompilerReady) {
      updatePreviewState({ 
        error: '编译器尚未准备就绪' 
      })
      return
    }

    updatePreviewState({ isLoading: true, error: undefined })
    
    try {
      const result = await typstCompiler.compile(content, previewMode)
      
      if (result.success) {
        updatePreviewState({ 
          isLoading: false, 
          pdf: result.pdf,
          svg: result.svg,
          error: undefined 
        })
      } else {
        updatePreviewState({ 
          isLoading: false, 
          error: result.error || '编译失败'
        })
      }
      
    } catch (error) {
      console.error('Typst compilation error:', error)
      updatePreviewState({ 
        isLoading: false, 
        error: '编译失败：' + (error as Error).message 
      })
    }
  }

  const renderPreview = () => {
    if (previewState.isLoading) {
      return (
        <div className="preview-loading">
          <div className="loading-spinner"></div>
          <span>正在编译...</span>
        </div>
      )
    }

    if (previewState.error) {
      return (
        <div className="preview-error">
          <div className="error-icon">⚠️</div>
          <div className="error-message">{previewState.error}</div>
          <button 
            className="retry-button"
            onClick={() => currentDocument && compileTypst(currentDocument.content)}
          >
            重试
          </button>
        </div>
      )
    }

    if (!currentDocument?.content) {
      return (
        <div className="preview-empty">
          <div className="empty-icon">📄</div>
          <p>开始编辑以查看预览</p>
        </div>
      )
    }

    if (previewMode === 'svg' && previewState.svg) {
      return (
        <div 
          className="svg-preview"
          dangerouslySetInnerHTML={{ __html: previewState.svg }}
        />
      )
    }

    if (previewMode === 'pdf' && previewState.pdf) {
      // 将 PDF 字节数组转换为 Blob URL
      const pdfBlob = new Blob([previewState.pdf], { type: 'application/pdf' })
      const pdfUrl = URL.createObjectURL(pdfBlob)
      
      return (
        <div className="pdf-preview">
          <iframe 
            src={pdfUrl}
            width="100%" 
            height="100%" 
            title="PDF预览"
            onLoad={() => {
              // 清理 URL 对象以避免内存泄漏
              setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000)
            }}
          />
        </div>
      )
    }

    return (
      <div className="preview-unavailable">
        <p>预览暂不可用</p>
      </div>
    )
  }

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <h3>预览</h3>
        <div className="preview-controls">
          <div className="preview-mode-toggle">
            <button
              className={`mode-button ${previewMode === 'pdf' ? 'active' : ''}`}
              onClick={() => setPreviewMode('pdf')}
            >
              PDF
            </button>
            <button
              className={`mode-button ${previewMode === 'svg' ? 'active' : ''}`}
              onClick={() => setPreviewMode('svg')}
            >
              SVG
            </button>
          </div>
          
          <button
            className="refresh-button"
            onClick={() => currentDocument && compileTypst(currentDocument.content)}
            disabled={previewState.isLoading}
            title="刷新预览"
          >
            🔄
          </button>
        </div>
      </div>
      
      <div className="preview-content">
        {renderPreview()}
      </div>
    </div>
  )
}