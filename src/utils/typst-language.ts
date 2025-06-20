import { LanguageSupport } from '@codemirror/language'
import { StreamLanguage } from '@codemirror/language'

// Typst 语法高亮规则
const typstLanguage = StreamLanguage.define({
  name: 'typst',
  
  startState() {
    return {
      inString: false,
      inComment: false,
      inMath: false,
      inCode: false,
    }
  },

  token(stream, state) {
    // 注释
    if (stream.match('//')) {
      stream.skipToEnd()
      return 'comment'
    }

    // 块注释
    if (stream.match('/*')) {
      state.inComment = true
      return 'comment'
    }
    
    if (state.inComment) {
      if (stream.match('*/')) {
        state.inComment = false
      } else {
        stream.next()
      }
      return 'comment'
    }

    // 字符串
    if (stream.match('"')) {
      state.inString = !state.inString
      return 'string'
    }
    
    if (state.inString) {
      if (stream.match('\\"')) {
        return 'string'
      } else if (stream.match('"')) {
        state.inString = false
        return 'string'
      } else {
        stream.next()
        return 'string'
      }
    }

    // 数学模式
    if (stream.match('$')) {
      state.inMath = !state.inMath
      return 'keyword'
    }

    if (state.inMath) {
      stream.next()
      return 'number'
    }

    // 代码块
    if (stream.match('```')) {
      state.inCode = !state.inCode
      return 'keyword'
    }

    // 函数和关键字
    if (stream.match(/^#(import|include|let|set|show|if|else|for|while|return|break|continue)\b/)) {
      return 'keyword'
    }

    // 函数调用
    if (stream.match(/^#[a-zA-Z_][a-zA-Z0-9_]*\(/)) {
      stream.backUp(1) // 回退括号
      return 'variable-2'
    }

    // 指令
    if (stream.match(/^#[a-zA-Z_][a-zA-Z0-9_]*/)) {
      return 'builtin'
    }

    // 标题
    if (stream.sol() && stream.match(/^=+\s/)) {
      return 'header'
    }

    // 粗体
    if (stream.match(/\*[^*\s][^*]*[^*\s]\*/)) {
      return 'strong'
    }

    // 斜体
    if (stream.match(/_[^_\s][^_]*[^_\s]_/)) {
      return 'em'
    }

    // 数字
    if (stream.match(/^-?\d*\.?\d+/)) {
      return 'number'
    }

    // 操作符
    if (stream.match(/^[+\-*\/=<>!&|]+/)) {
      return 'operator'
    }

    // 括号
    if (stream.match(/^[()[\]{}]/)) {
      return 'bracket'
    }

    // 标点符号
    if (stream.match(/^[.,;:]/)) {
      return 'punctuation'
    }

    // 标识符
    if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
      return 'variable'
    }

    // 默认
    stream.next()
    return null
  },
})

export function typst(): LanguageSupport {
  return new LanguageSupport(typstLanguage)
}