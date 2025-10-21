import { useState } from 'react'
import { Plus, Upload, Send, X } from 'lucide-react'

export default function QuizCreator() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [quizData, setQuizData] = useState({ title: '', class: '', questions: [] })
  const [showSendModal, setShowSendModal] = useState(false)

  const classes = ['Class 10A', 'Class 10B', 'Class 9A', 'Class 9B']

  const handleCreateQuiz = () => {
    setShowSendModal(true)
  }

  const handleSendQuiz = (selectedClass) => {
    alert(`Quiz "${quizData.title}" sent to ${selectedClass}!`)
    setShowSendModal(false)
    setShowCreateForm(false)
    setQuizData({ title: '', class: '', questions: [] })
  }

  if (showCreateForm) {
    return (
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Create MCQ Quiz</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Build your quiz questions</p>
          </div>
          <button onClick={() => setShowCreateForm(false)} className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
            Cancel
          </button>
        </div>

        <div className="rounded-2xl p-6 shadow-lg mb-6" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Quiz Title</label>
              <input
                type="text"
                value={quizData.title}
                onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                placeholder="e.g., Chapter 5 - Algebra Quiz"
                className="w-full px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  borderWidth: '1px',
                  color: 'var(--color-text-primary)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Number of Questions</label>
              <input
                type="number"
                placeholder="5"
                className="w-full px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  borderWidth: '1px',
                  color: 'var(--color-text-primary)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Topic/Subject</label>
              <input
                type="text"
                placeholder="e.g., Algebra, Quadratic Equations"
                className="w-full px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  borderWidth: '1px',
                  color: 'var(--color-text-primary)'
                }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateQuiz}
          disabled={!quizData.title}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send size={20} />
          Create & Send Quiz
        </button>

        {showSendModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSendModal(false)}>
            <div className="rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4" style={{
              backgroundColor: 'var(--color-bg-primary)'
            }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Send Quiz To</h2>
                <button onClick={() => setShowSendModal(false)}>
                  <X size={24} style={{ color: 'var(--color-text-secondary)' }} />
                </button>
              </div>
              <div className="space-y-3">
                {classes.map(cls => (
                  <button
                    key={cls}
                    onClick={() => handleSendQuiz(cls)}
                    className="w-full p-4 rounded-xl text-left hover:bg-blue-50 transition-colors"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderColor: 'var(--color-border-primary)',
                      borderWidth: '1px'
                    }}
                  >
                    <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{cls}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Create Quiz</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Create and distribute quizzes to your classes</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button onClick={() => setShowCreateForm(true)} className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <Plus className="mx-auto mb-4 text-blue-600" size={48} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Create MCQ Quiz</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Build a quiz from scratch</p>
        </button>

        <button className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <Upload className="mx-auto mb-4 text-purple-600" size={48} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Upload Question Paper</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Import from PDF or image</p>
        </button>
      </div>
    </div>
  )
}
