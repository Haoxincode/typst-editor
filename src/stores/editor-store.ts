import { create } from 'zustand'
import type { Document, EditorState, ChatMessage, PreviewState } from '../types'

interface EditorStore {
  // 当前文档
  currentDocument: Document | null
  setCurrentDocument: (doc: Document | null) => void
  
  // 编辑器状态
  editorState: EditorState
  updateEditorState: (state: Partial<EditorState>) => void
  
  // 聊天对话
  chatMessages: ChatMessage[]
  addChatMessage: (message: ChatMessage) => void
  clearChatMessages: () => void
  
  // 预览状态
  previewState: PreviewState
  updatePreviewState: (state: Partial<PreviewState>) => void
  
  // UI状态
  isChatPanelOpen: boolean
  toggleChatPanel: () => void
  
  isPreviewPanelOpen: boolean
  togglePreviewPanel: () => void
  
  // 文档操作
  createDocument: (title: string, templateId?: string) => Document
  updateDocumentContent: (content: string) => void
  saveDocument: () => Promise<void>
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  // 初始状态
  currentDocument: null,
  editorState: {
    content: '',
    cursorPosition: 0,
    isDirty: false,
  },
  chatMessages: [],
  previewState: {
    isLoading: false,
  },
  isChatPanelOpen: true,
  isPreviewPanelOpen: true,
  
  // Actions
  setCurrentDocument: (doc) => set({ currentDocument: doc }),
  
  updateEditorState: (state) => 
    set((prev) => ({ 
      editorState: { ...prev.editorState, ...state } 
    })),
  
  addChatMessage: (message) =>
    set((prev) => ({
      chatMessages: [...prev.chatMessages, message]
    })),
  
  clearChatMessages: () => set({ chatMessages: [] }),
  
  updatePreviewState: (state) =>
    set((prev) => ({
      previewState: { ...prev.previewState, ...state }
    })),
  
  toggleChatPanel: () =>
    set((prev) => ({ isChatPanelOpen: !prev.isChatPanelOpen })),
  
  togglePreviewPanel: () =>
    set((prev) => ({ isPreviewPanelOpen: !prev.isPreviewPanelOpen })),
  
  createDocument: (title, templateId) => {
    const doc: Document = {
      id: crypto.randomUUID(),
      title,
      content: '',
      templateId,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
    }
    set({ currentDocument: doc })
    return doc
  },
  
  updateDocumentContent: (content) => {
    const { currentDocument } = get()
    if (currentDocument) {
      const updatedDoc = {
        ...currentDocument,
        content,
        updatedAt: new Date(),
      }
      set({ 
        currentDocument: updatedDoc,
        editorState: { ...get().editorState, content, isDirty: true }
      })
    }
  },
  
  saveDocument: async () => {
    const { currentDocument } = get()
    if (currentDocument) {
      // TODO: 实现文档保存逻辑
      console.log('Saving document:', currentDocument.id)
      set((prev) => ({
        editorState: { ...prev.editorState, isDirty: false }
      }))
    }
  },
}))