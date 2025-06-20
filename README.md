
# Lychee Typst 编辑器

基于 Typst 的专业文档编辑与排版系统，使用 Node.js 后端进行编译。

## 🏗️ 架构说明

- **前端**: React + TypeScript + Vite (端口: 3002)
- **后端**: Express + Node.js Typst 编译器 (端口: 3004)
- **编译器**: @myriaddreamin/typst-ts-node-compiler (真正的 Typst 编译器)

## 🚀 快速启动

### 1. 安装所有依赖

```bash
npm run install:all
```

### 2. 同时启动前端和后端

```bash
npm start
```

### 3. 分别启动（调试用）

启动后端服务器：
```bash
npm run server
```

启动前端开发服务器：
```bash
npm run dev
```

## 🌐 访问地址

- 前端应用: http://localhost:3002
- 后端API: http://localhost:3004

## 📡 API 接口

### 编译文档
```bash
POST /api/compile
{
  "content": "= 标题\\n\\n内容",
  "format": "svg" | "pdf" | "plainSvg"
}
```

### 健康检查
```bash
GET /api/health
```

### 添加源文件
```bash
POST /api/add-source
{
  "path": "/template.typ",
  "content": "模板内容"
}
```

### 映射二进制文件
```bash
POST /api/map-shadow
{
  "path": "/image.png",
  "data": "base64编码的数据"
}
```

## ✨ 特性

- ✅ 真正的 Typst 编译器（Node.js 版本）
- ✅ 中文字体支持
- ✅ SVG 和 PDF 输出
- ✅ 实时预览
- ✅ 资源文件支持（图片等）
- ✅ 缓存管理
- ✅ 错误处理

## 🛠️ 开发

```bash
# 类型检查
npm run type-check

# 代码检查
npm run lint

# 构建
npm run build
```

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── editor/         # 编辑器相关组件
│   ├── chat/           # 对话面板组件
│   ├── preview/        # 预览面板组件
│   ├── templates/      # 模板管理组件
│   └── layout/         # 布局组件
├── stores/             # Zustand 状态管理
├── types/              # TypeScript 类型定义
├── services/           # 业务逻辑服务
├── hooks/              # 自定义 React Hooks
└── utils/              # 工具函数
```

## 🎯 使用指南

### 基本使用
1. 启动应用后，可以看到三个主要面板：
   - **左侧**: AI 聊天助手
   - **中央**: 代码编辑器
   - **右侧**: 实时预览

2. 在聊天面板中输入需求，如"创建学术论文模板"
3. AI 会生成相应的 Typst 代码
4. 右侧预览面板会实时显示排版效果
5. 可以直接在编辑器中修改代码

### 对话式编辑示例
- "帮我创建一个 IEEE 格式的学术论文"
- "生成一份现代简历模板"
- "添加数学公式支持"
- "修改页边距为 2cm"

## 🔧 开发计划

### 即将实现
- [ ] Typst WASM 集成
- [ ] Tinymist LSP 客户端
- [ ] 真实 AI 服务集成
- [ ] 模板导入导出
- [ ] 桌面端 (Tauri)

### 未来规划
- [ ] 协作编辑
- [ ] 云端同步
- [ ] 移动端支持
- [ ] 插件系统

## 🤝 贡献指南

欢迎贡献代码！请先阅读 [贡献指南](CONTRIBUTING.md)。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Typst](https://typst.app/) - 现代化排版系统
- [CodeMirror](https://codemirror.net/) - 优秀的代码编辑器
- [Tinymist](https://github.com/Myriad-Dreamin/tinymist) - Typst 语言服务器