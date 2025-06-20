import { useEffect } from 'react'
import { MainLayout } from './components/layout/MainLayout'
import { useEditorStore } from './stores/editor-store'
import { useTemplateStore } from './stores/template-store'
import './App.css'

function App() {
  const { createDocument, updateDocumentContent } = useEditorStore()
  const { loadTemplates } = useTemplateStore()

  useEffect(() => {
    // 初始化应用
    const initApp = async () => {
      try {
        // 加载模板
        await loadTemplates()
        
        // 创建默认文档
        const defaultDoc = createDocument('新建文档')
        
        // 设置默认内容
        const defaultContent = `= 欢迎使用 Lychee Typst 编辑器

这是一个基于 Typst 的专业文档编辑系统。

== 特性

- 🤖 *AI 驱动的对话式编辑*：通过自然语言与 AI 交互，快速生成和修改文档
- 📝 *实时预览*：编辑时即时查看排版效果  
- 📚 *丰富的模板库*：包含学术论文、简历等各类专业模板
- ⚡ *语法高亮和智能补全*：集成 Tinymist LSP 提供完整的编程体验
- 🎨 *精确排版*：基于 Typst 引擎，实现像素级精准控制

== 快速开始

1. 在左侧聊天面板中输入需求，如"创建学术论文模板"
2. AI 将生成相应的 Typst 代码
3. 右侧预览面板会实时显示排版效果
4. 你可以直接在编辑器中修改代码

== 数学公式示例

行内数学：$E = m c^2$

块级数学：
$ integral_0^infinity e^(-x^2) dif x = sqrt(pi)/2 $

== 代码示例

#set text(font: "Times New Roman", size: 12pt)
#set page(margin: 1in)

#align(center)[
  #text(18pt, weight: "bold")[文档标题]
]

开始你的创作之旅吧！在左侧聊天窗口告诉我你想创建什么类型的文档。`
        
        // 更新文档内容状态
        updateDocumentContent(defaultContent)
        
      } catch (error) {
        console.error('Failed to initialize app:', error)
      }
    }

    initApp()
  }, [createDocument, loadTemplates])

  return (
    <div className="app">
      <MainLayout />
    </div>
  )
}

export default App