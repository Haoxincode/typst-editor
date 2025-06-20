import React, { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { useEditorStore } from '../../stores/editor-store'
import { typst } from '../../utils/typst-language'
import { EditorToolbar } from './EditorToolbar'
import './Editor.css'

export const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  
  const { 
    currentDocument, 
    editorState, 
    updateEditorState, 
    updateDocumentContent 
  } = useEditorStore()

  useEffect(() => {
    if (!editorRef.current) return

    const startState = EditorState.create({
      doc: editorState.content,
      extensions: [
        basicSetup,
        typst(),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const content = update.state.doc.toString()
            updateDocumentContent(content)
            updateEditorState({
              content,
              cursorPosition: update.state.selection.main.head,
            })
          }
          
          if (update.selectionSet) {
            const selection = update.state.selection.main
            updateEditorState({
              cursorPosition: selection.head,
              selection: selection.empty ? undefined : {
                from: selection.from,
                to: selection.to
              }
            })
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
          },
          '.cm-editor': {
            height: '100%',
          },
          '.cm-scroller': {
            fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
            lineHeight: '1.6',
          },
        }),
      ],
    })

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [])

  // 当文档内容变化时更新编辑器
  useEffect(() => {
    if (viewRef.current && currentDocument) {
      const currentContent = viewRef.current.state.doc.toString()
      if (currentContent !== currentDocument.content) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: currentDocument.content,
          },
        })
      }
    }
  }, [currentDocument?.content])

  return (
    <div className="editor-wrapper">
      <EditorToolbar />
      <div className="editor-content">
        <div ref={editorRef} className="codemirror-container" />
      </div>
    </div>
  )
}