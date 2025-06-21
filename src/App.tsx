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
        
        // 设置默认内容 - 使用 zh-kit 包进行中文支持
        const defaultContent = `// 导入中文支持包
#import "@preview/zh-kit:0.1.0": *

// 设置中文字体
#show: doc => setup-base-fonts(doc)

#set page(margin: 1in)

= 欢迎使用 Lychee Typst 编辑器

这是一个基于 Typst 的专业文档编辑系统，现已集成 zh-kit 中文支持包。

== 特性

- 🤖 *AI 驱动的对话式编辑*：通过自然语言与 AI 交互，快速生成和修改文档
- 📝 *实时预览*：编辑时即时查看排版效果  
- 📚 *丰富的模板库*：包含学术论文、简历等各类专业模板
- ⚡ *语法高亮和智能补全*：集成 Tinymist LSP 提供完整的编程体验
- 🎨 *精确排版*：基于 Typst 引擎，实现像素级精准控制
- 🔤 *中文字体支持*：使用 zh-kit 包自动配置中文字体

== 中文排版测试

中文与 English 混合排版测试：

- 汉字：你好世界！
- 标点：《引号》、【括号】、"双引号"  
- 数字：#zh-num(2024)年#zh-num(1)月#zh-num(1)日
- 拼音：#pinyin("ni3 hao3")
- 英文：Hello World!

== zh-kit 功能演示

=== 数字转换
- 阿拉伯数字：123
- 中文小写：#zh-num(123)
- 中文大写：#zh-num(123, upper: true)

=== 拼音标注
- 拼音输入：ni3 hao3 shi4 jie4
- 标注结果：#pinyin("ni3 hao3 shi4 jie4")

=== 中文 Lorem Ipsum
#zh-lorem(50)

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

如果上面的中文能正常显示，说明 zh-kit 包配置成功！

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