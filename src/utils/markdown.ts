import { createApp, h } from 'vue'
import CodeBlock from '../components/CodeBlock.vue'

let codeBlockId = 0
let codeBlocksData: { code: string; language?: string }[] = []

export function parseMarkdown(markdown: string): string {
  let html = markdown.trim()
  codeBlockId = 0
  codeBlocksData = []
  
  // Store code blocks temporarily to prevent further processing
  const codeBlocks: string[] = []
  const CODE_PLACEHOLDER = '___CODE_BLOCK___'
  
  // Process fenced code blocks (```)
  html = html.replace(/```(\w+)?\r?\n([\s\S]*?)```/g, (_, lang, code) => {
    const trimmedCode = code.trim()
    const id = codeBlockId++
    
    // Store the code block data
    codeBlocksData.push({
      code: trimmedCode,
      language: lang
    })
    
    // Create a placeholder that will be replaced with Vue component mount point
    const block = `<div id="code-block-mount-${id}" class="code-block-mount"></div>`
    codeBlocks.push(block)
    return CODE_PLACEHOLDER
  })
  
  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>')
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Inline code - escape HTML in inline code
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    return `<code>${escapeHtml(code)}</code>`
  })
  
  // Lists - handle bullets (-) and asterisks (*)
  html = html.replace(/^[\*\-] (.+)$/gm, '<li>$1</li>')
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
  
  // Wrap consecutive list items in <ul> tags
  const listLines = html.split('\n')
  let inUl = false
  const wrappedLines = []
  
  for (const line of listLines) {
    if (line.startsWith('<li>')) {
      if (!inUl) {
        wrappedLines.push('<ul>')
        inUl = true
      }
      wrappedLines.push(line)
    } else {
      if (inUl && line.trim() !== '') {
        wrappedLines.push('</ul>')
        inUl = false
      }
      wrappedLines.push(line)
    }
  }
  if (inUl) {
    wrappedLines.push('</ul>')
  }
  
  html = wrappedLines.join('\n')
  
  // Tables
  const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g
  html = html.replace(tableRegex, (_, headers, rows) => {
    const headerCells = headers.split('|').filter(Boolean).map((h: string) => {
      const content = h.trim()
      // Don't escape if it contains HTML tags already
      return `<th>${content.includes('<') ? content : escapeHtml(content)}</th>`
    }).join('')
    
    const rowsHtml = rows.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter(Boolean).map((cell: string) => {
        const content = cell.trim()
        // Don't escape if it contains HTML tags already
        return `<td>${content.includes('<') ? content : escapeHtml(content)}</td>`
      }).join('')
      return `<tr>${cells}</tr>`
    }).join('')
    
    return `<table><thead><tr>${headerCells}</tr></thead><tbody>${rowsHtml}</tbody></table>`
  })
  
  // Paragraphs
  const lines = html.split('\n')
  const processedLines = []
  let inList = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.includes(CODE_PLACEHOLDER)) {
      processedLines.push(line)
      continue
    }
    
    if (line.startsWith('<ul>') || line.includes('<li>')) {
      inList = true
      processedLines.push(line)
    } else if (line.includes('</ul>')) {
      inList = false
      processedLines.push(line)
    } else if (
      !inList && 
      line.trim() && 
      !line.startsWith('<') && 
      !line.includes('<table')
    ) {
      processedLines.push(`<p>${line}</p>`)
    } else {
      processedLines.push(line)
    }
  }
  
  html = processedLines.join('\n')
  
  // Clean up
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<ul>\n<\/ul>/g, '')
  
  // Restore code blocks
  let codeBlockIndex = 0
  html = html.replace(new RegExp(CODE_PLACEHOLDER, 'g'), () => {
    return codeBlocks[codeBlockIndex++] || ''
  })
  
  return html
}

export function mountCodeBlocks(container: HTMLElement) {
  // Clean up any existing mounted code blocks
  const existingMounts = container.querySelectorAll('.code-block-mount')
  existingMounts.forEach(mount => {
    const app = (mount as any).__vueApp__
    if (app) {
      app.unmount()
    }
  })
  
  // Mount new code blocks
  codeBlocksData.forEach((data, index) => {
    const mountPoint = container.querySelector(`#code-block-mount-${index}`)
    if (mountPoint) {
      const app = createApp({
        render: () => h(CodeBlock, {
          code: data.code,
          language: data.language
        })
      })
      app.mount(mountPoint)
      ;(mountPoint as any).__vueApp__ = app
    }
  })
}

export function unmountCodeBlocks(container: HTMLElement) {
  const mounts = container.querySelectorAll('.code-block-mount')
  mounts.forEach(mount => {
    const app = (mount as any).__vueApp__
    if (app) {
      app.unmount()
      delete (mount as any).__vueApp__
    }
  })
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}