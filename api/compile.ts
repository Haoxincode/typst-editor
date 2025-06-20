import { VercelRequest, VercelResponse } from '@vercel/node'
import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler'

// 全局编译器实例
let typstCompiler: any = null
let isInitialized = false

// 初始化编译器
async function initializeCompiler() {
  if (isInitialized) return

  console.log('Initializing Node.js Typst compiler...')
  
  try {
    typstCompiler = NodeCompiler.create({
      fontArgs: []
    })
    
    // 测试编译器
    const testResult = await typstCompiler.svg({ 
      mainFileContent: '= 测试中文\n\n这是一个测试文档。' 
    })
    
    console.log('Typst compiler initialized successfully')
    isInitialized = true
  } catch (error) {
    console.error('Failed to initialize Typst compiler:', error)
    throw error
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

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
      res.status(200).json({
        success: true,
        result: result,
        format: format
      })
    }
    
  } catch (error) {
    console.error('Compilation error:', error)
    res.status(500).json({
      success: false,
      error: (error as Error).message || 'Compilation failed'
    })
  }
}