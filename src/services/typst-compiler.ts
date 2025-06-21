// 声明全局 $typst 对象的类型
declare global {
  interface Window {
    $typst: {
      svg: (options: { mainContent: string; inputs?: Record<string, any> }) => Promise<string>
      pdf: (options: { mainContent: string; inputs?: Record<string, any> }) => Promise<Uint8Array>
      setCompilerInitOptions?: (options: any) => void
      preloadFontFromUrl?: (url: string) => Promise<void>
      preloadFontData?: (data: ArrayBuffer, name?: string) => Promise<void>
    }
  }
}

export interface CompileResult {
  success: boolean
  pdf?: Uint8Array
  svg?: string
  error?: string
  warnings?: string[]
}

export class TypstCompilerService {
  private _isReady = false
  private initPromise: Promise<void> | null = null

  constructor() {
    // 浏览器架构不需要 serverUrl
  }

  async initialize(): Promise<void> {
    if (this._isReady) return
    
    // 确保只初始化一次
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = this._initialize()
    return this.initPromise
  }

  private async _initialize(): Promise<void> {
    try {
      console.log('Initializing browser-based Typst compiler...')
      
      // 等待全局 $typst 对象可用
      let attempts = 0
      const maxAttempts = 100 // 增加到10秒等待时间
      
      while (!window.$typst && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
        if (attempts % 20 === 0) {
          console.log(`Waiting for Typst compiler... (${attempts}/100)`)
        }
      }
      
      if (!window.$typst) {
        throw new Error('Typst all-in-one bundle failed to load after 10 seconds')
      }
      
      console.log('$typst object found, preloading fonts and testing compilation...')

      // 预加载中文字体
      try {
        console.log('Preloading Chinese font...')
        if (window.$typst.preloadFontFromUrl) {
          await window.$typst.preloadFontFromUrl('/assets/fonts/zh/NotoSansSC-Light.ttf')
          console.log('Chinese font preloaded successfully')
        } else {
          console.warn('Font preloading not supported')
        }
      } catch (error) {
        console.warn('Failed to preload Chinese font:', error)
      }

      // 测试编译器 - 包含中文内容
      await window.$typst.svg({ mainContent: '= 中文测试\n\n浏览器端 Typst 编译器已就绪。\n\n中文字体显示测试：你好世界！' })
      
      this._isReady = true
      console.log('Browser-based Typst compiler initialized successfully')
    } catch (error) {
      console.error('Failed to initialize browser Typst compiler:', error)
      throw new Error('浏览器端 Typst 编译器初始化失败')
    }
  }

  async compile(source: string, format: 'pdf' | 'svg' = 'pdf'): Promise<CompileResult> {
    try {
      await this.initialize()
      
      console.log(`Compiling Typst source to ${format}:`, source.substring(0, 100) + '...')

      const compileOptions = {
        mainContent: source
      }

      if (format === 'pdf') {
        const pdfData = await window.$typst.pdf(compileOptions)
        
        return {
          success: true,
          pdf: pdfData
        }
      } else {
        const svgResult = await window.$typst.svg(compileOptions)
        
        return {
          success: true,
          svg: svgResult
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
    return this._isReady
  }

  async getVersion(): Promise<string> {
    try {
      await this.initialize()
      return 'Lychee Browser Typst Compiler v2.0 (All-in-One)'
    } catch {
      return 'Browser Compiler (Not Ready)'
    }
  }

  // 添加源文件支持 - 在浏览器端通过输入参数传递
  async addSource(path: string, _content: string): Promise<void> {
    await this.initialize()
    // 在浏览器端，源文件通过编译选项的 inputs 参数传递
    // 这里可以存储到内存中，在编译时使用
    console.log(`Adding source file: ${path}`)
  }

  // 映射二进制文件 - 在浏览器端简化处理
  async mapShadow(path: string, _data: Uint8Array): Promise<void> {
    await this.initialize()
    // 在浏览器端，二进制文件可以通过 data URL 或其他方式处理
    console.log(`Mapping shadow file: ${path}`)
  }

  // 清理缓存 - 在浏览器端不需要
  async evictCache(_maxAge = 10): Promise<void> {
    // 浏览器端编译器不需要手动清理缓存
    console.log('Browser compiler cache management not needed')
  }

  // 重置阴影文件 - 在浏览器端不需要
  async resetShadow(): Promise<void> {
    // 浏览器端编译器不需要重置阴影文件
    console.log('Browser compiler shadow file reset not needed')
  }
}

// 单例实例
export const typstCompiler = new TypstCompilerService()