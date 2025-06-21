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
        createDocument('新建文档')
        
        // 设置默认内容
        const defaultContent = `// 使用预加载的中文字体
#set text(font: "Noto Sans SC", size: 12pt)
#set page(margin: 1in)

= 欢迎使用 Lychee Typst 编辑器

这是一个基于 Typst 的专业文档编辑系统，现已支持中文字体显示。

== 特性

- 🤖 *AI 驱动的对话式编辑*：通过自然语言与 AI 交互，快速生成和修改文档
- 📝 *实时预览*：编辑时即时查看排版效果  
- 📚 *丰富的模板库*：包含学术论文、简历等各类专业模板
- ⚡ *语法高亮和智能补全*：集成 Tinymist LSP 提供完整的编程体验
- 🎨 *精确排版*：基于 Typst 引擎，实现像素级精准控制
- 🔤 *中文字体支持*：预加载 Noto Sans SC 字体，确保中文显示效果

== 中文显示测试

中文与 English 混合排版测试：

- 汉字：你好世界！
- 标点：《引号》、【括号】、"双引号"
- 数字：2024年1月1日
- 英文：Hello World!

== 数学公式示例

行内数学：$E = m c^2$

块级数学：
$ integral_0^infinity e^(-x^2) dif x = sqrt(pi)/2 $

== 排版示例

#align(center)[
  #text(18pt, weight: "bold")[
    中文标题示例
  ]
]

如果上面的中文能正常显示，说明字体预加载成功！

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