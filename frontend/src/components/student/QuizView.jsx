import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Award, ArrowRight, Sparkles } from 'lucide-react'
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
  const [quiz, setQuiz] = useState(demoQuiz)
  const [loading, setLoading] = useState(false)
  const updateMastery = useProgressStore(state => state.updateMastery)
  const user = useUserStore(state => state.user)

  useEffect(() => {
    generateAIQuiz()
  }, [contentId, competencyId])

  const generateAIQuiz = async () => {
    setLoading(true)
    try {
      const response = await aiAPI.quiz(contentId || 'demo', competencyId || 'programming', 5)
      if (response.data.questions && response.data.questions.length > 0) {
        setQuiz({ questions: response.data.questions })
      }
    } catch (error) {
      console.log('Using demo quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const question = quiz.questions[currentQ]

  const handleAnswer = () => {
    const correct = selected === question.correctAnswer
    if (correct) setScore(prev => prev + 1)
    setShowResult(true)
  }

  const nextQuestion = () => {
    if (currentQ === quiz.questions.length - 1) {
      const mastery = score / quiz.questions.length
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
            <div className="bg-green-100 text-green-800 px-6 py-3 rounded-xl inline-block font-semibold">
              ✓ Great job! Keep learning!
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-xl inline-block font-semibold">
              Keep practicing to improve!
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Knowledge Check
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Test your understanding of {competencyId}</p>
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
