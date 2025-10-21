import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { aiAPI } from '../../services/api'
import useUserStore from '../../stores/userStore'

export default function SmartFlashcards({ topic, onClose }) {
  const [flashcards, setFlashcards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [generating, setGenerating] = useState(true)
  const [wrongCards, setWrongCards] = useState([])
  const [reviewMode, setReviewMode] = useState(false)
  const [completed, setCompleted] = useState(false)
  const user = useUserStore(state => state.user)

  useEffect(() => {
    generateFlashcards()
  }, [])

  const generateFlashcards = async () => {
    try {
      const prompt = `Generate 10 flashcard questions and answers for the topic: "${topic}".

Format each flashcard as:
Q: [Question]
A: [Answer]

Make questions clear and concise. Answers should be brief but complete.`

      const response = await aiAPI.question({
        question: prompt,
        contentId: 'flashcard-generator',
        userId: user?.id || 'user_123',
        chatHistory: []
      })

      const content = response.data.answer
      const cards = []
      const lines = content.split('\n').filter(l => l.trim())
      
      let currentQ = null
      lines.forEach(line => {
        if (line.startsWith('Q:')) {
          currentQ = line.substring(2).trim()
        } else if (line.startsWith('A:') && currentQ) {
          cards.push({
            question: currentQ,
            answer: line.substring(2).trim()
          })
          currentQ = null
        }
      })

      setFlashcards(cards.length > 0 ? cards : [
        { question: `What is ${topic}?`, answer: 'A fundamental concept in this subject.' },
        { question: `Why is ${topic} important?`, answer: 'It forms the basis for advanced topics.' }
      ])
    } catch (err) {
      console.error('Flashcard generation error:', err)
      setFlashcards([
        { question: `What is ${topic}?`, answer: 'A fundamental concept in this subject.' },
        { question: `Why is ${topic} important?`, answer: 'It forms the basis for advanced topics.' },
        { question: `How is ${topic} applied?`, answer: 'In various practical scenarios.' }
      ])
    } finally {
      setGenerating(false)
    }
  }

  const handleCorrect = () => {
    setFlipped(false)
    if (currentIndex === flashcards.length - 1) {
      if (wrongCards.length > 0 && !reviewMode) {
        // Shuffle wrong cards and review them
        const shuffled = [...wrongCards].sort(() => Math.random() - 0.5)
        setFlashcards(shuffled)
        setWrongCards([])
        setCurrentIndex(0)
        setReviewMode(true)
      } else {
        // All cards completed correctly
        setCompleted(true)
      }
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleWrong = () => {
    const currentCard = flashcards[currentIndex]
    if (!wrongCards.find(c => c.question === currentCard.question)) {
      setWrongCards(prev => [...prev, currentCard])
    }
    setFlipped(false)
    if (currentIndex === flashcards.length - 1) {
      if (wrongCards.length > 0 || !wrongCards.find(c => c.question === currentCard.question)) {
        const cardsToReview = wrongCards.find(c => c.question === currentCard.question) 
          ? wrongCards 
          : [...wrongCards, currentCard]
        const shuffled = cardsToReview.sort(() => Math.random() - 0.5)
        setFlashcards(shuffled)
        setWrongCards([])
        setCurrentIndex(0)
        setReviewMode(true)
      }
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="rounded-2xl shadow-2xl max-w-2xl w-full mx-4" style={{
        backgroundColor: 'var(--color-bg-primary)'
      }} onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Smart Flashcards
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>

          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Topic: <strong>{topic}</strong>
          </p>

          {generating ? (
            <div className="text-center py-20">
              <Sparkles className="mx-auto mb-4 text-blue-600 animate-pulse" size={64} />
              <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Generating Flashcards...
              </p>
            </div>
          ) : completed ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                All Cards Mastered!
              </h3>
              <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                Great job! You've reviewed all flashcards correctly.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                Close
              </button>
            </div>
          ) : flashcards.length > 0 ? (
            <>
              <div 
                className="relative h-80 cursor-pointer"
                onClick={() => setFlipped(!flipped)}
              >
                <div 
                  className={`absolute inset-0 transition-all duration-500 ${flipped ? 'opacity-0 rotate-y-180' : 'opacity-100'}`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div 
                    className="absolute inset-0 rounded-xl p-8 flex flex-col items-center justify-center"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderColor: 'var(--color-border-primary)',
                      borderWidth: '2px'
                    }}
                  >
                    <p className="text-xs uppercase mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
                      Question
                    </p>
                    <p className="text-xl text-center font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {flashcards[currentIndex].question}
                    </p>
                    <p className="text-sm mt-6" style={{ color: 'var(--color-text-tertiary)' }}>
                      Click to reveal answer
                    </p>
                  </div>
                </div>

                <div 
                  className={`absolute inset-0 transition-all duration-500 ${flipped ? 'opacity-100' : 'opacity-0 rotate-y-180'}`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div 
                    className="absolute inset-0 rounded-xl p-8 flex flex-col items-center justify-center"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderColor: 'var(--color-accent-blue)',
                      borderWidth: '2px'
                    }}
                  >
                    <p className="text-xs uppercase mb-4 text-blue-600">Answer</p>
                    <p className="text-lg text-center" style={{ color: 'var(--color-text-primary)' }}>
                      {flashcards[currentIndex].answer}
                    </p>
                  </div>
                </div>
              </div>

              {flipped && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleWrong}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold"
                  >
                    ✗ Wrong - Review Later
                  </button>
                  <button
                    onClick={handleCorrect}
                    className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-semibold"
                  >
                    ✓ Correct
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="p-3 rounded-lg hover:bg-blue-100 transition-all disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="text-center">
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {currentIndex + 1} / {flashcards.length}
                  </p>
                  {reviewMode && (
                    <p className="text-xs text-orange-600 font-medium">Review Mode</p>
                  )}
                  {wrongCards.length > 0 && !reviewMode && (
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      {wrongCards.length} to review
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCorrect}
                  disabled={!flipped}
                  className="p-3 rounded-lg hover:bg-blue-100 transition-all disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p style={{ color: 'var(--color-text-secondary)' }}>No flashcards available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
