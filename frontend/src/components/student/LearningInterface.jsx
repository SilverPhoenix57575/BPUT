import { useState } from 'react'
import { Send, BookOpen, MessageCircle, Sparkles } from 'lucide-react'

export default function LearningInterface({ content }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI learning assistant. Ask me anything about your content!' }
  ])
  const [loading, setLoading] = useState(false)

  const handleAskQuestion = async () => {
    if (!question.trim()) return

    const userMessage = { role: 'user', content: question }
    setMessages(prev => [...prev, userMessage])
    setQuestion('')
    setLoading(true)

    setTimeout(() => {
      const aiMessage = { 
        role: 'assistant', 
        content: `Great question! "${question}" - This is a demo response. In production, this would be powered by Gemini API with source-grounded answers and citations.`,
        citations: [{ source: 'Demo Content', page: 1 }]
      }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          AI Learning Assistant
        </h2>
        <p className="text-gray-600">Ask questions and get instant, source-grounded answers</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Content Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold">Your Content</h3>
          </div>
          
          <div className="prose max-h-[500px] overflow-y-auto bg-gray-50 rounded-xl p-6">
            {content?.extractedText || (
              <div className="text-center py-12">
                <BookOpen className="mx-auto mb-4 text-gray-300" size={64} />
                <p className="text-gray-500">No content loaded yet</p>
                <p className="text-sm text-gray-400 mt-2">Upload a document to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="text-purple-600" size={24} />
            <h3 className="text-xl font-bold">AI Chat</h3>
            <Sparkles className="text-yellow-500 ml-auto" size={20} />
          </div>
          
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[400px]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.citations && (
                    <div className="mt-2 pt-2 border-t border-gray-300 text-xs opacity-75">
                      📚 Sources: {msg.citations.map(c => c.source).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
              placeholder="Ask a question about your content..."
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleAskQuestion}
              disabled={loading || !question.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
