import { VercelRequest, VercelResponse } from '@vercel/node'
import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler'

// 全局编译器实例
let typstCompiler: any = null
let isInitialized = false

// 初始化编译器
async function initializeCompiler() {
  if (isInitialized) return

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
    
    const { maxAge = 10 } = req.body
    typstCompiler.evictCache(maxAge)
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Evict cache error:', error)
    res.status(500).json({
      success: false,
      error: (error as Error).message || 'Failed to evict cache'
    })
  }
}