// 核心类型定义

export interface Document {
  id: string
  title: string
  content: string  // Typst源码
  templateId?: string
  createdAt: Date
  updatedAt: Date
  metadata: DocumentMetadata
}

export interface DocumentMetadata {
  author?: string
  tags?: string[]
  language?: string
  wordCount?: number
}

export interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory
  typstCode: string
  variables: TemplateVariable[]
  preview?: string
  metadata: TemplateMetadata
}

export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array'
  defaultValue: any
  description?: string
  required?: boolean
}

export interface TemplateMetadata {
  author?: string
  version?: string
  tags?: string[]
  requirements?: string[]
}

export type TemplateCategory = 'academic' | 'resume' | 'business' | 'custom'

export interface EditorState {
  content: string
  cursorPosition: number
  selection?: { from: number; to: number }
  isDirty: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'code' | 'suggestion'
}

export interface PreviewState {
  isLoading: boolean
  error?: string
  pdf?: Uint8Array
  svg?: string
}

// LSP 相关类型
export interface LSPDiagnostic {
  range: { start: Position; end: Position }
  severity: 'error' | 'warning' | 'info' | 'hint'
  message: string
  source?: string
}

export interface Position {
  line: number
  character: number
}

export interface CompletionItem {
  label: string
  kind: CompletionItemKind
  detail?: string
  documentation?: string
  insertText?: string
}

export enum CompletionItemKind {
  Text = 1,
  Method = 2,
  Function = 3,
  Constructor = 4,
  Field = 5,
  Variable = 6,
  Class = 7,
  Interface = 8,
  Module = 9,
  Property = 10,
  Unit = 11,
  Value = 12,
  Enum = 13,
  Keyword = 14,
  Snippet = 15,
  Color = 16,
  File = 17,
  Reference = 18,
  Folder = 19,
  EnumMember = 20,
  Constant = 21,
  Struct = 22,
  Event = 23,
  Operator = 24,
  TypeParameter = 25,
}