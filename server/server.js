import express from 'express'
import cors from 'cors'
import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler'

const app = express()
const port = process.env.PORT || 3004

// 中间件
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 全局编译器实例
let typstCompiler = null
let isInitialized = false

// 初始化编译器
async function initializeCompiler() {
  if (isInitialized) return
  
  console.log('Initializing Node.js Typst compiler...')
  
  try {
    typstCompiler = NodeCompiler.create({
      // 配置中文字体支持
      fontArgs: [
        // 你可以在这里添加本地字体路径
        // { fontPaths: ['/path/to/fonts'] }
      ]
    })
    
    // 测试编译器
    console.log('Testing compiler with Chinese content...')
    const testResult = await typstCompiler.svg({ 
      mainFileContent: '= 测试中文\n\n这是一个测试文档。' 
    })
    
    console.log('Typst compiler initialized successfully, test SVG length:', testResult.length)
    isInitialized = true
  } catch (error) {
    console.error('Failed to initialize Typst compiler:', error)
    throw error
  }
}

// 编译接口
app.post('/api/compile', async (req, res) => {
  try {
    await initializeCompiler()
    
    const { content, format = 'svg', inputs = {} } = req.body
    
    if (!content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content is required' 
      })
    }
    
    console.log(`Compiling to ${format}:`, content.substring(0, 100) + '...')
    
    let result
    const compileOptions = {
      mainFileContent: content,
      ...(Object.keys(inputs).length > 0 && { inputs })
    }
    
    if (format === 'pdf') {
      result = await typstCompiler.pdf(compileOptions)
    } else if (format === 'svg') {
      result = await typstCompiler.svg(compileOptions)
    } else if (format === 'plainSvg') {
      result = await typstCompiler.plainSvg(compileOptions)
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Unsupported format. Use: pdf, svg, plainSvg' 
      })
    }
    
    if (format === 'pdf') {
      // 返回PDF二进制数据
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', 'inline; filename="document.pdf"')
      res.send(Buffer.from(result))
    } else {
      // 返回SVG文本
      res.json({
        success: true,
        result: result,
        format: format
      })
    }
    
  } catch (error) {
    console.error('Compilation error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Compilation failed'
    })
  }
})

// 添加源文件接口
app.post('/api/add-source', async (req, res) => {
  try {
    await initializeCompiler()
    
    const { path, content } = req.body
    
    if (!path || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Path and content are required' 
      })
    }
    
    await typstCompiler.addSource(path, content)
    
    res.json({ success: true })
  } catch (error) {
    console.error('Add source error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add source'
    })
  }
})

// 映射二进制文件接口
app.post('/api/map-shadow', async (req, res) => {
  try {
    await initializeCompiler()
    
    const { path, data } = req.body
    
    if (!path || !data) {
      return res.status(400).json({ 
        success: false, 
        error: 'Path and data are required' 
      })
    }
    
    // 数据应该是base64编码的
    const buffer = Buffer.from(data, 'base64')
    typstCompiler.mapShadow(path, new Uint8Array(buffer))
    
    res.json({ success: true })
  } catch (error) {
    console.error('Map shadow error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to map shadow file'
    })
  }
})

// 清理缓存接口
app.post('/api/evict-cache', async (req, res) => {
  try {
    await initializeCompiler()
    
    const { maxAge = 10 } = req.body
    typstCompiler.evictCache(maxAge)
    
    res.json({ success: true })
  } catch (error) {
    console.error('Evict cache error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to evict cache'
    })
  }
})

// 重置阴影文件接口
app.post('/api/reset-shadow', async (req, res) => {
  try {
    await initializeCompiler()
    
    typstCompiler.resetShadow()
    
    res.json({ success: true })
  } catch (error) {
    console.error('Reset shadow error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to reset shadow files'
    })
  }
})

// 健康检查接口
app.get('/api/health', async (req, res) => {
  try {
    await initializeCompiler()
    res.json({ 
      success: true, 
      status: 'ready',
      compiler: 'Node.js Typst Compiler'
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      status: 'error',
      error: error.message 
    })
  }
})

// 启动服务器
app.listen(port, () => {
  console.log(`Lychee Typst Server running at http://localhost:${port}`)
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('Server shutting down...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('Server shutting down...')
  process.exit(0)
})