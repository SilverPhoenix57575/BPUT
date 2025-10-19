import { useState } from 'react'
import { Send } from 'lucide-react'
import { aiAPI } from '../../services/api'

export default function LearningInterface({ content }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAskQuestion = async () => {
    if (!question.trim()) return

    const userMessage = { role: 'user', content: question }
    setMessages(prev => [...prev, userMessage])
    setQuestion('')
    setLoading(true)

    try {
      const response = await aiAPI.question(question, content?.id, 'user_123')
      const aiMessage = { 
        role: 'assistant', 
        content: response.data.answer,
        citations: response.data.citations 
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Question error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Content</h3>
          <div className="prose max-h-96 overflow-y-auto">
            {content?.extractedText || 'No content loaded'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-4">AI Assistant</h3>
          
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
              }`}>
                <p>{msg.content}</p>
                {msg.citations && (
                  <div className="mt-2 text-xs text-gray-600">
                    Sources: {msg.citations.map(c => c.source).join(', ')}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-gray-500">Thinking...</div>}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
              placeholder="Ask a question..."
              className="flex-1 border rounded-lg px-4 py-2"
            />
            <button
              onClick={handleAskQuestion}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
