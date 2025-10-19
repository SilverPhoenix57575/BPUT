import { useState, useEffect } from 'react'
import { aiAPI, progressAPI } from '../../services/api'
import bkt from '../../services/bkt'
import useProgressStore from '../../stores/progressStore'

export default function QuizView({ contentId, competencyId }) {
  const [quiz, setQuiz] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [interactions, setInteractions] = useState([])
  const updateMastery = useProgressStore(state => state.updateMastery)

  useEffect(() => {
    loadQuiz()
  }, [contentId, competencyId])

  const loadQuiz = async () => {
    try {
      const response = await aiAPI.quiz(contentId, competencyId, 5)
      setQuiz(response.data)
    } catch (error) {
      console.error('Quiz load error:', error)
    }
  }

  const handleAnswer = () => {
    const correct = selected === quiz.questions[currentQ].correctAnswer
    const newInteraction = { questionId: quiz.questions[currentQ].id, correct, timeSpent: 30 }
    const newInteractions = [...interactions, newInteraction]
    setInteractions(newInteractions)
    setShowResult(true)

    if (currentQ === quiz.questions.length - 1) {
      const mastery = bkt.getMasteryLevel(newInteractions)
      updateMastery(competencyId, mastery)
      progressAPI.save('user_123', competencyId, newInteractions)
    }
  }

  const nextQuestion = () => {
    setCurrentQ(prev => prev + 1)
    setSelected(null)
    setShowResult(false)
  }

  if (!quiz) return <div>Loading quiz...</div>

  const question = quiz.questions[currentQ]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <span className="text-sm text-gray-600">Question {currentQ + 1} of {quiz.questions.length}</span>
        </div>

        <h3 className="text-xl font-bold mb-6">{question.question}</h3>

        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !showResult && setSelected(idx)}
              className={`w-full text-left p-4 border-2 rounded-lg transition ${
                selected === idx ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              } ${showResult && idx === question.correctAnswer ? 'border-green-600 bg-green-50' : ''}`}
              disabled={showResult}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`p-4 rounded-lg mb-4 ${
            selected === question.correctAnswer ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <p className="font-semibold mb-2">
              {selected === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-sm">{question.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          {!showResult ? (
            <button
              onClick={handleAnswer}
              disabled={selected === null}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Submit Answer
            </button>
          ) : currentQ < quiz.questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Next Question
            </button>
          ) : (
            <div className="text-green-600 font-semibold">Quiz Complete!</div>
          )}
        </div>
      </div>
    </div>
  )
}
