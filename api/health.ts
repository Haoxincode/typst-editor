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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await initializeCompiler()
    res.status(200).json({ 
      success: true, 
      status: 'ready',
      compiler: 'Node.js Typst Compiler'
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      status: 'error',
      error: (error as Error).message 
    })
  }
}