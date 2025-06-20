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
    
    const { path, content } = req.body
    
    if (!path || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Path and content are required' 
      })
    }
    
    await typstCompiler.addSource(path, content)
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Add source error:', error)
    res.status(500).json({
      success: false,
      error: (error as Error).message || 'Failed to add source'
    })
  }
}