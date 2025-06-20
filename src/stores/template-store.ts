import { create } from 'zustand'
import type { Template, TemplateCategory } from '../types'

interface TemplateStore {
  templates: Template[]
  selectedTemplate: Template | null
  
  // Actions
  loadTemplates: () => Promise<void>
  getTemplatesByCategory: (category: TemplateCategory) => Template[]
  selectTemplate: (template: Template | null) => void
  createTemplate: (template: Omit<Template, 'id'>) => Template
  updateTemplate: (id: string, updates: Partial<Template>) => void
  deleteTemplate: (id: string) => void
}

// 内置模板数据
const builtInTemplates: Template[] = [
  {
    id: 'academic-ieee',
    name: 'IEEE学术论文',
    description: 'IEEE标准格式的学术论文模板',
    category: 'academic',
    typstCode: `#import "@preview/ieee:1.0.0": ieee

#show: ieee.with(
  title: [论文标题],
  authors: (
    (name: "作者姓名", organization: [研究机构], email: "author@example.com")
  ),
  abstract: [
    这里是摘要内容。简要描述研究的目的、方法、结果和结论。
  ],
  keywords: ("关键词1", "关键词2", "关键词3"),
  bibliography: bibliography("refs.bib"),
)

= 引言

这里是正文内容...

= 相关工作

= 方法

= 实验结果

= 结论

#bibliography("refs.bib")`,
    variables: [
      { name: 'title', type: 'string', defaultValue: '论文标题', description: '论文标题', required: true },
      { name: 'author', type: 'string', defaultValue: '作者姓名', description: '作者姓名', required: true },
      { name: 'organization', type: 'string', defaultValue: '研究机构', description: '研究机构' },
      { name: 'email', type: 'string', defaultValue: 'author@example.com', description: '邮箱地址' },
    ],
    metadata: {
      author: 'Lychee Team',
      version: '1.0.0',
      tags: ['学术', 'IEEE', '论文'],
    }
  },
  {
    id: 'resume-modern',
    name: '现代简历',
    description: '简洁现代的简历模板',
    category: 'resume',
    typstCode: `#set page(margin: (x: 0.8in, y: 0.6in))
#set text(font: "Inter", size: 11pt)

#align(center)[
  #text(24pt, weight: "bold")[姓名]
  #text(12pt)[
    邮箱：example@email.com | 电话：+86 123 4567 8900 | 
    GitHub：github.com/username
  ]
]

#line(length: 100%, stroke: 0.5pt)

== 教育背景
*大学名称* #h(1fr) 2020-2024 \\
计算机科学与技术学士 #h(1fr) GPA: 3.8/4.0

== 工作经验
*公司名称* - 职位 #h(1fr) 2023-至今
- 负责...
- 开发...
- 优化...

== 项目经验
*项目名称* #h(1fr) 2023
- 项目描述...
- 技术栈：React, TypeScript, Node.js

== 技能
*编程语言：* Python, JavaScript, TypeScript, Java
*框架工具：* React, Vue, Node.js, Docker`,
    variables: [
      { name: 'name', type: 'string', defaultValue: '姓名', description: '姓名', required: true },
      { name: 'email', type: 'string', defaultValue: 'example@email.com', description: '邮箱', required: true },
      { name: 'phone', type: 'string', defaultValue: '+86 123 4567 8900', description: '电话' },
      { name: 'github', type: 'string', defaultValue: 'github.com/username', description: 'GitHub地址' },
    ],
    metadata: {
      author: 'Lychee Team',
      version: '1.0.0',
      tags: ['简历', '现代', '简洁'],
    }
  }
]

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  templates: [],
  selectedTemplate: null,
  
  loadTemplates: async () => {
    // 模拟异步加载，实际可能从服务器或本地存储加载
    await new Promise(resolve => setTimeout(resolve, 100))
    set({ templates: builtInTemplates })
  },
  
  getTemplatesByCategory: (category) => {
    const { templates } = get()
    return templates.filter(template => template.category === category)
  },
  
  selectTemplate: (template) => {
    set({ selectedTemplate: template })
  },
  
  createTemplate: (templateData) => {
    const template: Template = {
      ...templateData,
      id: crypto.randomUUID(),
    }
    set((prev) => ({
      templates: [...prev.templates, template]
    }))
    return template
  },
  
  updateTemplate: (id, updates) => {
    set((prev) => ({
      templates: prev.templates.map(template =>
        template.id === id ? { ...template, ...updates } : template
      )
    }))
  },
  
  deleteTemplate: (id) => {
    set((prev) => ({
      templates: prev.templates.filter(template => template.id !== id),
      selectedTemplate: prev.selectedTemplate?.id === id ? null : prev.selectedTemplate
    }))
  },
}))