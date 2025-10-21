import { useState } from 'react'
import { Send, Sparkles, Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { aiAPI } from '../../services/api'
import useUserStore from '../../stores/userStore'

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI learning assistant. Ask me anything!' }
  ])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const user = useUserStore(state => state.user)

  const handleAsk = async () => {
    if (!question.trim()) return

    const userMsg = { role: 'user', content: question }
    setMessages(prev => [...prev, userMsg])
    const currentQuestion = question
    setQuestion('')
    setLoading(true)

    try {
      const response = await aiAPI.question({
        question: currentQuestion,
        contentId: 'demo',
        userId: user?.id || 'user_123',
        chatHistory: messages.slice(-10)
      })
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.answer
      }])
    } catch (err) {
      console.error('AI error:', err)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          AI Learning Assistant
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Ask questions and get detailed, formatted answers</p>
      </div>

      <div className="rounded-2xl shadow-lg p-6 mb-6" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <div className="space-y-6 max-h-[600px] overflow-y-auto mb-6">
          {messages.map((msg, idx) => (
            <div key={idx}>
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-[80%] px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-[95%]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                        <Sparkles className="text-white" size={16} />
                      </div>
                      <span className="font-semibold text-sm" style={{ color: 'var(--color-text-secondary)' }}>AI Assistant</span>
                    </div>
                    <FormattedMessage content={msg.content} />
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 px-6 py-3 rounded-2xl" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask me anything..."
            className="flex-1 px-6 py-4 border-2 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border-primary)',
              color: 'var(--color-text-primary)'
            }}
          />
          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

function FormattedMessage({ content }) {
  const [copiedIndex, setCopiedIndex] = useState(null)

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Decode HTML entities comprehensively
  const decodeHtmlEntities = (text) => {
    const entities = {
      '&quot;': '"',
      '&#34;': '"',
      '&apos;': "'",
      '&#39;': "'",
      '&lt;': '<',
      '&#60;': '<',
      '&gt;': '>',
      '&#62;': '>',
      '&amp;': '&',
      '&#38;': '&'
    }
    
    let decoded = text
    for (const [entity, char] of Object.entries(entities)) {
      decoded = decoded.split(entity).join(char)
    }
    return decoded
  }

  // Parse content for code blocks and formatting
  const decodedContent = decodeHtmlEntities(content)
  const parts = decodedContent.split(/(```[\s\S]*?```)/g)
  let codeBlockIndex = 0

  return (
    <div className="space-y-4">
      {parts.map((part, idx) => {
        // Code block
        if (part.startsWith('```')) {
          const lines = part.split('\n')
          const language = lines[0].replace('```', '').trim() || 'text'
          const code = lines.slice(1, -1).join('\n')
          const currentIndex = codeBlockIndex++

          return (
            <div key={idx} className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-border-primary)' }}>
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
                <span className="text-xs font-mono uppercase">{language}</span>
                <button
                  onClick={() => copyToClipboard(code, currentIndex)}
                  className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-sm"
                >
                  {copiedIndex === currentIndex ? (
                    <>
                      <Check size={16} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '14px',
                  padding: '1rem'
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          )
        }

        // Regular text with formatting
        return (
          <div key={idx} className="prose max-w-none" style={{ color: 'var(--color-text-primary)' }}>
            {part.split('\n').map((line, lineIdx) => {
              // Heading
              if (line.startsWith('# ')) {
                return <h1 key={lineIdx} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>
              }
              if (line.startsWith('## ')) {
                return <h2 key={lineIdx} className="text-xl font-bold mt-3 mb-2">{line.substring(3)}</h2>
              }
              if (line.startsWith('### ')) {
                return <h3 key={lineIdx} className="text-lg font-bold mt-2 mb-1">{line.substring(4)}</h3>
              }

              // Key Concept callout
              if (line.startsWith('**Key Concept:**') || line.includes('💡')) {
                return (
                  <div key={lineIdx} className="my-4 p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50" style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderLeftColor: 'var(--color-accent-blue)'
                  }}>
                    <div className="flex items-start gap-2">
                      <Sparkles className="text-blue-600 mt-1" size={20} />
                      <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {line.replace('**Key Concept:**', '').replace('💡', '').trim()}
                      </p>
                    </div>
                  </div>
                )
              }

              // Helper function to format text with bold, italic, underline and inline code
              const formatText = (text) => {
                const parts = []
                let current = text
                let idx = 0

                while (current.length > 0) {
                  // Inline code `text`
                  if (current.startsWith('`')) {
                    const end = current.indexOf('`', 1)
                    if (end > 0) {
                      parts.push(
                        <code key={idx++} className="px-2 py-1 rounded text-sm font-mono" style={{
                          backgroundColor: 'var(--color-bg-tertiary)',
                          color: 'var(--color-accent-blue)'
                        }}>
                          {current.slice(1, end)}
                        </code>
                      )
                      current = current.slice(end + 1)
                      continue
                    }
                  }

                  // Bold **text**
                  if (current.startsWith('**')) {
                    const end = current.indexOf('**', 2)
                    if (end > 0) {
                      parts.push(<strong key={idx++}>{current.slice(2, end)}</strong>)
                      current = current.slice(end + 2)
                      continue
                    }
                  }

                  // Underline __text__
                  if (current.startsWith('__')) {
                    const end = current.indexOf('__', 2)
                    if (end > 0) {
                      parts.push(<u key={idx++}>{current.slice(2, end)}</u>)
                      current = current.slice(end + 2)
                      continue
                    }
                  }

                  // Italic *text* (single asterisk, not double)
                  if (current.startsWith('*') && !current.startsWith('**')) {
                    const end = current.indexOf('*', 1)
                    if (end > 0) {
                      parts.push(<em key={idx++} style={{ fontStyle: 'italic' }}>{current.slice(1, end)}</em>)
                      current = current.slice(end + 1)
                      continue
                    }
                  }

                  // Italic _text_
                  if (current.startsWith('_') && !current.startsWith('__')) {
                    const end = current.indexOf('_', 1)
                    if (end > 0) {
                      parts.push(<em key={idx++} style={{ fontStyle: 'italic' }}>{current.slice(1, end)}</em>)
                      current = current.slice(end + 1)
                      continue
                    }
                  }

                  // Regular text - find next formatting character
                  const next = current.search(/[*_`]/)
                  if (next === -1) {
                    parts.push(current)
                    break
                  }
                  if (next > 0) {
                    parts.push(current.slice(0, next))
                    current = current.slice(next)
                  } else {
                    parts.push(current[0])
                    current = current.slice(1)
                  }
                }

                return parts
              }

              // Bullet list
              if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                return (
                  <li key={lineIdx} className="ml-6 mb-2 leading-relaxed" style={{ listStyleType: 'disc' }}>
                    {formatText(line.trim().substring(2))}
                  </li>
                )
              }

              // Numbered list
              if (/^\d+\.\s/.test(line.trim())) {
                return (
                  <li key={lineIdx} className="ml-6 mb-2 leading-relaxed" style={{ listStyleType: 'decimal' }}>
                    {formatText(line.trim().replace(/^\d+\.\s/, ''))}
                  </li>
                )
              }

              return line.trim() ? (
                <p key={lineIdx} className="leading-relaxed mb-2">{formatText(line)}</p>
              ) : (
                <br key={lineIdx} />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
