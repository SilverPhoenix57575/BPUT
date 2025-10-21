import { useState } from 'react'
import { Copy, Check, Lightbulb } from 'lucide-react'

export default function MessageRenderer({ content }) {
  const [copiedIndex, setCopiedIndex] = useState(null)
  
  if (!content) return null

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const parseContent = (text) => {
    const parts = []
    let currentIndex = 0
    
    // Match code blocks: ```language\ncode\n``` or ```\ncode\n```
    const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g
    let match
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > currentIndex) {
        parts.push({ type: 'text', content: text.slice(currentIndex, match.index) })
      }
      
      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'code',
        content: match[2].trim()
      })
      
      currentIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(currentIndex) })
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', content: text }]
  }

  const renderText = (text) => {
    // Match key concept callouts: **Key Concept:** text
    const keyConceptRegex = /\*\*Key Concept:\*\*(.*?)(?=\n\n|\n\*\*|$)/gs
    const parts = []
    let lastIndex = 0
    
    text.replace(keyConceptRegex, (match, content, offset) => {
      if (offset > lastIndex) {
        parts.push({ type: 'normal', content: text.slice(lastIndex, offset) })
      }
      parts.push({ type: 'keyConcept', content: content.trim() })
      lastIndex = offset + match.length
      return match
    })
    
    if (lastIndex < text.length) {
      parts.push({ type: 'normal', content: text.slice(lastIndex) })
    }
    
    return parts.length > 0 ? parts : [{ type: 'normal', content: text }]
  }

  const formatText = (text) => {
    // Bold: **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold" style="color: var(--color-text-primary)">$1</strong>')
    // Headings
    text = text.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2" style="color: var(--color-text-primary)">$1</h3>')
    text = text.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-5 mb-3" style="color: var(--color-text-primary)">$1</h2>')
    // Bullet points
    text = text.replace(/^\* (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
    text = text.replace(/(<li.*<\/li>)/s, '<ul class="list-disc mb-3">$1</ul>')
    // Line breaks to paragraphs
    text = text.split('\n\n').map(p => p.trim() ? `<p class="mb-3">${p}</p>` : '').join('')
    return text
  }

  const parts = parseContent(content)

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <div key={index} className="relative group">
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <span className="text-xs font-mono text-gray-400 uppercase">{part.language}</span>
                  <button
                    onClick={() => copyToClipboard(part.content, index)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check size={14} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code className="text-sm text-gray-100 font-mono leading-relaxed">
                    {part.content}
                  </code>
                </pre>
              </div>
            </div>
          )
        } else {
          const textParts = renderText(part.content)
          return (
            <div key={index}>
              {textParts.map((textPart, tIndex) => {
                if (textPart.type === 'keyConcept') {
                  return (
                    <div key={tIndex} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg my-3">
                      <div className="flex gap-2">
                        <Lightbulb className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                        <div>
                          <div className="font-semibold text-blue-900 text-sm mb-1">Key Concept</div>
                          <div className="text-sm text-blue-800 leading-relaxed">{textPart.content}</div>
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div 
                      key={tIndex} 
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--color-text-primary)' }}
                      dangerouslySetInnerHTML={{ __html: formatText(textPart.content) }}
                    />
                  )
                }
              })}
            </div>
          )
        }
      })}
    </div>
  )
}
