import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { typstCompiler } from './services/typst-compiler'

// 预加载 Typst 编译器
console.log('Starting Typst compiler pre-initialization...')
typstCompiler.initialize().catch(error => {
  console.warn('Typst compiler pre-initialization failed:', error)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)