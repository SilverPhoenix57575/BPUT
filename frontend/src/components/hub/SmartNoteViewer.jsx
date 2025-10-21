import { useState } from 'react'
import { X, Download, MessageSquare, Send, Tag, Sparkles } from 'lucide-react'
import { aiAPI } from '../../services/api'
import useUserStore from '../../stores/userStore'
import MessageRenderer from '../student/MessageRenderer'

export default function SmartNoteViewer({ note, onClose }) {
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

  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi! I'm ready to answer questions about "${note.title}". What would you like to know?` }
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
      // Build context from note content
      const contextText = note.fullText || note.extractedText || note.summary || ''
      const contextualQuestion = contextText 
        ? `Based on this content: ${contextText.substring(0, 2000)}\n\nQuestion: ${currentQuestion}`
        : currentQuestion

      console.log('Sending to AI:', { question: contextualQuestion.substring(0, 200) })

      const response = await aiAPI.question({
        question: contextualQuestion,
        contentId: String(note.content?.id || note.id || 'note-' + Date.now()),
        userId: String(user?.id || 'user_123'),
        chatHistory: []
      })
      
      console.log('AI Response:', response.data)
      
      const decodedAnswer = decodeHtmlEntities(response.data.answer || response.data)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: decodedAnswer,
        citations: response.data.citations
      }])
    } catch (err) {
      console.error('Full error:', err)
      console.error('Error response:', err.response)
      console.error('AI error:', err)
      
      // Extract error message properly
      let errorMsg = 'Unknown error'
      if (err.response?.data) {
        const data = err.response.data
        if (typeof data === 'string') {
          errorMsg = data
        } else if (data.detail) {
          if (typeof data.detail === 'string') {
            errorMsg = data.detail
          } else if (Array.isArray(data.detail)) {
            errorMsg = data.detail.map(e => e.msg || JSON.stringify(e)).join(', ')
          } else {
            errorMsg = JSON.stringify(data.detail)
          }
        }
      } else if (err.message) {
        errorMsg = err.message
      }
      
      console.log('Parsed error:', errorMsg)
      
      // For AI-generated notes, provide direct answers from the content
      if (note.fullText) {
        const searchTerm = currentQuestion.toLowerCase()
        const content = note.fullText.toLowerCase()
        
        // Try to find relevant section
        const lines = note.fullText.split('\n')
        const relevantLines = lines.filter(line => 
          line.toLowerCase().includes(searchTerm) ||
          searchTerm.split(' ').some(word => word.length > 3 && line.toLowerCase().includes(word))
        )
        
        if (relevantLines.length > 0) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Based on the notes:\n\n${relevantLines.slice(0, 5).join('\n\n')}\n\nWould you like me to explain any specific part in more detail?`
          }])
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I couldn't find that specific information in the notes. Here's the full content for reference:\n\n${note.fullText.substring(0, 1000)}...\n\nTry asking about the main topics covered.`
          }])
        }
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `The AI service is currently unavailable. However, I can see your document "${note.title}".\n\nHere's what I know:\n${note.summary}\n\nPlease try again later when the service is back online.`
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I'm having trouble connecting to the AI service. Let me help you with what I know about "${note.title}":\n\n${note.summary}\n\nTry asking a more specific question about the content.`
        }])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="rounded-2xl shadow-2xl max-w-6xl w-full mx-4 h-[90vh] flex flex-col" style={{
        backgroundColor: 'var(--color-bg-primary)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border-primary)' }}>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              {note.title}
            </h2>
            <div className="flex gap-2 flex-wrap">
              {note.tags?.map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {note.originalFile && (
              <button className="p-2 hover:bg-gray-100 rounded-lg" title="Download">
                <Download size={20} />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left: Note Content */}
          <div className="w-1/2 p-6 overflow-y-auto border-r" style={{ borderColor: 'var(--color-border-primary)' }}>
            {note.fullText ? (
              <div className="prose max-w-none" style={{ color: 'var(--color-text-primary)' }}>
                <MessageRenderer content={note.fullText} />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-blue-600" size={20} />
                    <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>AI Summary</h3>
                  </div>
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {note.summary}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <Tag size={20} />
                    Key Takeaways
                  </h3>
                  <ul className="space-y-2">
                    {note.keyTakeaways?.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Right: Chat Interface */}
          <div className="w-1/2 flex flex-col">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <h3 className="font-bold">Chat with this Document</h3>
              </div>
              <p className="text-sm text-white/90 mt-1">Ask questions about the content</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : ''
                  }`} style={msg.role === 'assistant' ? {
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    borderWidth: '1px'
                  } : {}}>
                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                      <div>
                        <MessageRenderer content={msg.content} />
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: 'var(--color-border-primary)', color: 'var(--color-text-tertiary)' }}>
                            📚 Sources: {msg.citations.map(c => c.source).join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t" style={{ borderColor: 'var(--color-border-primary)' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                  placeholder="Ask a question about this document..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    color: 'var(--color-text-primary)'
                  }}
                />
                <button
                  onClick={handleAsk}
                  disabled={loading || !question.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
