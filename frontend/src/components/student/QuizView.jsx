import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Award, ArrowRight, Sparkles, History, Plus } from 'lucide-react'
import storage from '../../services/storage'
import useProgressStore from '../../stores/progressStore'
import useUserStore from '../../stores/userStore'
import { aiAPI } from '../../services/api'

const demoQuiz = {
  questions: [
    {
      id: 'q1',
      question: 'What is a variable in programming?',
      options: [
        'A container for storing data values',
        'A type of loop',
        'A function that returns nothing',
        'A programming language'
      ],
      correctAnswer: 0,
      explanation: 'A variable is a container for storing data values. It has a name and can hold different types of data like numbers, strings, or objects.'
    },
    {
      id: 'q2',
      question: 'Which of these is a valid variable name in most programming languages?',
      options: [
        '123variable',
        'my-variable',
        'myVariable',
        'my variable'
      ],
      correctAnswer: 2,
      explanation: 'myVariable is valid because it starts with a letter and uses camelCase. Variable names cannot start with numbers or contain spaces/hyphens.'
    },
    {
      id: 'q3',
      question: 'What does "const" mean when declaring a variable?',
      options: [
        'The variable can be changed anytime',
        'The variable cannot be reassigned',
        'The variable is temporary',
        'The variable is global'
      ],
      correctAnswer: 1,
      explanation: 'const means the variable cannot be reassigned after its initial value is set. It creates a constant reference.'
    }
  ]
}

export default function QuizView({ contentId, competencyId }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showTopicInput, setShowTopicInput] = useState(true)
  const [topic, setTopic] = useState('')
  const [quizHistory, setQuizHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const updateMastery = useProgressStore(state => state.updateMastery)
  const user = useUserStore(state => state.user)

  useEffect(() => {
    // Load quiz history from localStorage
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]')
    setQuizHistory(history)
  }, [])

  const generateAIQuiz = async (quizTopic) => {
    setLoading(true)
    setShowTopicInput(false)
    try {
      const prompt = `Generate 5 multiple-choice quiz questions about "${quizTopic}".

Format each question as:
Q: [Question text]
A) [Option 1]
B) [Option 2]
C) [Option 3]
D) [Option 4]
Correct: [A/B/C/D]
Explanation: [Brief explanation]

Make questions clear and educational.`

      const response = await aiAPI.question({
        question: prompt,
        contentId: 'quiz-generator',
        userId: user?.id || 'user_123',
        chatHistory: []
      })

      const content = response.data.answer
      const questions = []
      const blocks = content.split(/Q:/g).filter(b => b.trim())

      blocks.forEach(block => {
        const lines = block.split('\n').filter(l => l.trim())
        if (lines.length >= 6) {
          const question = lines[0].trim()
          const options = []
          let correctIdx = 0
          let explanation = ''

          lines.forEach(line => {
            if (/^[A-D]\)/.test(line)) {
              options.push(line.substring(2).trim())
            } else if (line.startsWith('Correct:')) {
              const answer = line.substring(8).trim().toUpperCase()
              correctIdx = answer.charCodeAt(0) - 65
            } else if (line.startsWith('Explanation:')) {
              explanation = line.substring(12).trim()
            }
          })

          if (options.length === 4) {
            questions.push({
              id: `q${questions.length + 1}`,
              question,
              options,
              correctAnswer: correctIdx,
              explanation: explanation || 'Check your understanding of this concept.'
            })
          }
        }
      })

      setQuiz({ questions: questions.length > 0 ? questions : demoQuiz.questions })
    } catch (error) {
      console.error('Quiz generation error:', error)
      setQuiz(demoQuiz)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = () => {
    if (!quiz) return
    const question = quiz.questions[currentQ]
    const correct = selected === question.correctAnswer
    if (correct) setScore(prev => prev + 1)
    setShowResult(true)
  }

  const nextQuestion = () => {
    if (currentQ === quiz.questions.length - 1) {
      const percentage = Math.round((score / quiz.questions.length) * 100)
      const mastery = score / quiz.questions.length
      
      // Save to quiz history
      const historyEntry = {
        id: Date.now(),
        topic: topic,
        score: score,
        total: quiz.questions.length,
        percentage: percentage,
        date: new Date().toISOString()
      }
      const updatedHistory = [historyEntry, ...quizHistory].slice(0, 10)
      localStorage.setItem('quizHistory', JSON.stringify(updatedHistory))
      setQuizHistory(updatedHistory)
      
      updateMastery(competencyId, mastery)
      if (user) {
        storage.saveProgress(user.id, competencyId, mastery)
      }
      setCompleted(true)
    } else {
      setCurrentQ(prev => prev + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  const resetQuiz = () => {
    setQuiz(null)
    setCurrentQ(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setCompleted(false)
    setShowTopicInput(true)
    setTopic('')
  }

  const calculateAverageAccuracy = () => {
    if (quizHistory.length === 0) return 0
    const total = quizHistory.reduce((sum, entry) => sum + entry.percentage, 0)
    return Math.round(total / quizHistory.length)
  }

  if (showTopicInput && !loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            AI Quiz Generator
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Generate personalized quizzes on any topic</p>
        </div>

        <div className="rounded-2xl shadow-xl p-8 mb-6" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-purple-600" size={32} />
            <div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Create New Quiz</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Enter a topic to generate questions</p>
            </div>
          </div>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && topic.trim() && generateAIQuiz(topic)}
            placeholder="e.g., Data Structures, Machine Learning, Physics"
            className="w-full px-6 py-4 border-2 rounded-xl focus:border-blue-500 focus:outline-none text-lg mb-4"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border-primary)',
              color: 'var(--color-text-primary)'
            }}
          />

          <button
            onClick={() => generateAIQuiz(topic)}
            disabled={!topic.trim()}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Generate Quiz
          </button>
        </div>

        {quizHistory.length > 0 && (
          <div className="rounded-2xl shadow-xl p-6" style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border-primary)',
            borderWidth: '1px'
          }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History size={24} style={{ color: 'var(--color-text-primary)' }} />
                <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Quiz History</h3>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Average Accuracy</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{calculateAverageAccuracy()}%</p>
              </div>
            </div>

            <div className="space-y-2">
              {quizHistory.slice(0, 5).map(entry => (
                <div key={entry.id} className="p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{entry.topic}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${entry.percentage >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {entry.percentage}%
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      {entry.score}/{entry.total}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="rounded-2xl shadow-xl p-12 text-center" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <Sparkles className="mx-auto mb-4 text-purple-600 animate-pulse" size={64} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Generating AI Quiz...</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Creating personalized questions for you</p>
        </div>
      </div>
    )
  }

  if (completed) {
    const percentage = Math.round((score / quiz.questions.length) * 100)
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="rounded-2xl shadow-xl p-12 text-center" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <Award className={`mx-auto mb-6 ${percentage >= 70 ? 'text-green-500' : 'text-yellow-500'}`} size={80} />
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Quiz Complete!</h2>
          <div className="text-6xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            {percentage}%
          </div>
          <p className="text-xl mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            You got {score} out of {quiz.questions.length} questions correct
          </p>
          {percentage >= 70 ? (
            <div className="bg-green-100 text-green-800 px-6 py-3 rounded-xl inline-block font-semibold mb-6">
              ✓ Great job! Keep learning!
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-xl inline-block font-semibold mb-6">
              Keep practicing to improve!
            </div>
          )}
          <div className="mt-6">
            <button
              onClick={resetQuiz}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return null
  }

  const question = quiz.questions[currentQ]

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            {topic}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Test your understanding</p>
        </div>
        <button
          onClick={resetQuiz}
          className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-all text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Change Topic
        </button>
      </div>

      <div className="rounded-2xl shadow-xl p-8" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-semibold text-gray-500">
            Question {currentQ + 1} of {quiz.questions.length}
          </span>
          <div className="flex gap-2">
            {quiz.questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx < currentQ ? 'bg-green-500' :
                  idx === currentQ ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text-primary)' }}>{question.question}</h3>

        <div className="space-y-3 mb-8">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !showResult && setSelected(idx)}
              disabled={showResult}
              className={`w-full text-left p-5 border-2 rounded-xl transition-all ${
                selected === idx && !showResult ? 'border-blue-600 bg-blue-50' :
                showResult && idx === question.correctAnswer ? 'border-green-600 bg-green-50' :
                showResult && selected === idx && idx !== question.correctAnswer ? 'border-red-600 bg-red-50' :
                'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selected === idx && !showResult ? 'border-blue-600 bg-blue-600' :
                  showResult && idx === question.correctAnswer ? 'border-green-600 bg-green-600' :
                  showResult && selected === idx ? 'border-red-600 bg-red-600' :
                  'border-gray-300'
                }`}>
                  {showResult && idx === question.correctAnswer && <CheckCircle className="text-white" size={16} />}
                  {showResult && selected === idx && idx !== question.correctAnswer && <XCircle className="text-white" size={16} />}
                </div>
                <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`p-6 rounded-xl mb-6 ${
            selected === question.correctAnswer ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'
          }`}>
            <p className="font-bold text-lg mb-2">
              {selected === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-sm leading-relaxed">{question.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          {!showResult ? (
            <button
              onClick={handleAnswer}
              disabled={selected === null}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              {currentQ === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
