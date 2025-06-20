export interface CompileResult {
  success: boolean
  pdf?: Uint8Array
  svg?: string
  error?: string
  warnings?: string[]
}

export class TypstCompilerService {
  private serverUrl: string
  private isServerReady = false

  constructor(serverUrl?: string) {
    // 在 Vercel 部署环境中使用相对路径，本地开发使用 localhost
    this.serverUrl = serverUrl || (typeof window !== 'undefined' && window.location.origin) || 'http://localhost:3004'
  }

  async initialize(): Promise<void> {
    if (this.isServerReady) return

    try {
      console.log('Checking Typst server status...')
      const response = await fetch(`${this.serverUrl}/api/health`)
      const result = await response.json()
      
      if (result.success) {
        this.isServerReady = true
        console.log('Typst server is ready:', result.compiler)
      } else {
        throw new Error(`Server not ready: ${result.error}`)
      }
    } catch (error) {
      console.error('Failed to connect to Typst server:', error)
      throw new Error('Typst编译服务器未启动，请启动后端服务')
    }
  }

  async compile(source: string, format: 'pdf' | 'svg' = 'pdf'): Promise<CompileResult> {
    try {
      await this.initialize()
      
      console.log(`Compiling Typst source to ${format}:`, source.substring(0, 100) + '...')

      if (format === 'pdf') {
        // PDF编译返回二进制数据
        const response = await fetch(`${this.serverUrl}/api/compile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: source,
            format: 'pdf'
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'PDF compilation failed')
        }

        const pdfData = await response.arrayBuffer()
        
        return {
          success: true,
          pdf: new Uint8Array(pdfData)
        }
      } else {
        // SVG编译返回JSON
        const response = await fetch(`${this.serverUrl}/api/compile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: source,
            format: 'svg'
          })
        })

        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'SVG compilation failed')
        }
        
        return {
          success: true,
          svg: result.result
        }
      }

    } catch (error) {
      console.error('Typst compilation error:', error)
      
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      return {
        success: false,
        error: `编译失败: ${errorMessage}`
      }
    }
  }

  async compileToPdf(source: string): Promise<CompileResult> {
    return this.compile(source, 'pdf')
  }

  async compileToSvg(source: string): Promise<CompileResult> {
    return this.compile(source, 'svg')
  }

  isReady(): boolean {
    return this.isServerReady
  }

  async getVersion(): Promise<string> {
    try {
      await this.initialize()
      return 'Lychee Typst Server Compiler v1.0'
    } catch {
      return 'Server Compiler (Not Connected)'
    }
  }

  // 添加源文件支持
  async addSource(path: string, content: string): Promise<void> {
    await this.initialize()
    
    const response = await fetch(`${this.serverUrl}/api/add-source`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path, content })
    })

    const result = await response.json()
    if (!result.success) {
      throw new Error(result.error || 'Failed to add source')
    }
  }

  // 映射二进制文件（如图片）
  async mapShadow(path: string, data: Uint8Array): Promise<void> {
    await this.initialize()
    
    // 将二进制数据转换为base64
    const base64Data = btoa(String.fromCharCode(...data))
    
    const response = await fetch(`${this.serverUrl}/api/map-shadow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path, data: base64Data })
    })

    const result = await response.json()
    if (!result.success) {
      throw new Error(result.error || 'Failed to map shadow file')
    }
  }

  // 清理缓存
  async evictCache(maxAge = 10): Promise<void> {
    if (!this.isServerReady) return
    
    try {
      const response = await fetch(`${this.serverUrl}/api/evict-cache`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maxAge })
      })

      const result = await response.json()
      if (!result.success) {
        console.warn('Failed to evict cache:', result.error)
      }
    } catch (error) {
      console.warn('Failed to evict cache:', error)
    }
  }

  // 重置阴影文件
  async resetShadow(): Promise<void> {
    if (!this.isServerReady) return
    
    try {
      const response = await fetch(`${this.serverUrl}/api/reset-shadow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const result = await response.json()
      if (!result.success) {
        console.warn('Failed to reset shadow files:', result.error)
      }
    } catch (error) {
      console.warn('Failed to reset shadow files:', error)
    }
  }
}

// 单例实例
export const typstCompiler = new TypstCompilerService()