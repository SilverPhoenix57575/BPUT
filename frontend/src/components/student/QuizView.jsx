import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Award, ArrowRight, Sparkles, History, Plus } from 'lucide-react'
import storage from '../../services/storage'
import useProgressStore from '../../stores/progressStore'
import useUserStore from '../../stores/userStore'
import useAnalyticsStore from '../../stores/analyticsStore'
import { aiAPI } from '../../services/api'
import { logStudySession } from '../../services/analytics'

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
  const [generationType, setGenerationType] = useState('topic')
  const [difficulty, setDifficulty] = useState('medium')
  const [numQuestions, setNumQuestions] = useState(5)
  const [questionType, setQuestionType] = useState('all')
  const [contentText, setContentText] = useState('')
  const updateMastery = useProgressStore(state => state.updateMastery)
  const user = useUserStore(state => state.user)
  const { startSession, endSession } = useAnalyticsStore()

  useEffect(() => {
    // Load quiz history from localStorage
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]')
    setQuizHistory(history)
  }, [])

  const generateQuizFromContent = async (content) => {
    setLoading(true)
    setShowTopicInput(false)
    setTopic('Custom Content')
    startSession('quiz', 'Custom Content')
    try {
      const difficultyInstructions = {
        easy: 'Make questions simple and straightforward, suitable for beginners.',
        medium: 'Make questions moderately challenging, requiring understanding of concepts.',
        hard: 'Make questions complex and challenging, requiring deep understanding.',
        adaptive: 'Mix easy, medium, and hard questions.'
      }

      const questionTypeInstructions = {
        mcq: 'Generate only Multiple Choice Questions with 4 options (A, B, C, D).',
        tf: 'Generate only True/False questions with 2 options (A: True, B: False).',
        all: 'Generate a mix of Multiple Choice and True/False questions.'
      }

      const randomSeed = Math.floor(Math.random() * 10000)
      
      const prompt = `You are an expert educator. Read the following content and generate EXACTLY ${numQuestions} UNIQUE quiz questions based on it (Seed: ${randomSeed}).

CONTENT:
${content.substring(0, 3000)}

Difficulty Level: ${difficulty.toUpperCase()}
${difficultyInstructions[difficulty]}

Question Type: ${questionType === 'all' ? 'Mixed' : questionType === 'mcq' ? 'Multiple Choice Only' : 'True/False Only'}
${questionTypeInstructions[questionType]}

IMPORTANT RULES:
1. Questions MUST be based ONLY on the content provided above
2. Generate EXACTLY ${numQuestions} BRAND NEW questions
3. Test understanding of DIFFERENT key concepts from the content
4. Be CREATIVE - cover diverse aspects of the content
5. Provide clear explanations

Format EACH question EXACTLY as:
Q: [Question based on the content]
A) [Option 1]
B) [Option 2]
${questionType === 'tf' ? '' : 'C) [Option 3]\nD) [Option 4]\n'}Correct: [A/B${questionType === 'tf' ? '' : '/C/D'}]
Explanation: [Clear explanation]

---

Generate ${numQuestions} UNIQUE questions now:`

      console.log('Sending content quiz request to API...')
      console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:8000')
      console.log('Request payload:', {
        question: prompt.substring(0, 100) + '...',
        contentId: `quiz-content-${difficulty}-${numQuestions}`,
        userId: user?.id || 'user_123'
      })
      
      const response = await aiAPI.question({
        question: prompt,
        contentId: `quiz-content-${difficulty}-${numQuestions}`,
        userId: user?.id || 'user_123',
        chatHistory: []
      })

      console.log('API Response:', response)
      console.log('Response data:', response.data)
      // Handle both old and new API response formats
      const responseContent = response.data?.answer || response.data
      const questions = []
      const blocks = responseContent.split(/---+|(?=Q:)/g).filter(b => b.trim() && b.includes('Q:'))

      blocks.forEach((block) => {
        if (questions.length >= numQuestions) return
        
        const lines = block.split('\n').map(l => l.trim()).filter(l => l)
        let questionText = ''
        const options = []
        let correctIdx = 0
        let explanation = ''

        lines.forEach(line => {
          if (line.startsWith('Q:')) {
            questionText = line.substring(2).trim()
          } else if (/^[A-D]\)/.test(line)) {
            const optionText = line.substring(2).trim()
            if (questionType === 'tf') {
              if (optionText.toLowerCase().includes('true')) options.push('True')
              else if (optionText.toLowerCase().includes('false')) options.push('False')
              else options.push(optionText)
            } else {
              options.push(optionText)
            }
          } else if (line.startsWith('Correct:')) {
            const answer = line.substring(8).trim().toUpperCase().charAt(0)
            correctIdx = answer.charCodeAt(0) - 65
          } else if (line.startsWith('Explanation:')) {
            explanation = line.substring(12).trim()
          }
        })

        const expectedOptions = questionType === 'tf' ? 2 : 4
        if (questionText && options.length === expectedOptions && explanation) {
          questions.push({
            id: `q${questions.length + 1}`,
            question: questionText,
            options,
            correctAnswer: Math.max(0, Math.min(correctIdx, options.length - 1)),
            explanation,
            difficulty,
            type: questionType
          })
        }
      })

      if (questions.length < numQuestions) {
        console.warn(`Only parsed ${questions.length}/${numQuestions} questions from content`)
      }

      if (questions.length === 0) {
        throw new Error('No valid questions could be parsed from content')
      }
      setQuiz({ questions: questions.slice(0, numQuestions) })
    } catch (error) {
      console.error('Quiz generation error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      })
      
      let errorMessage = error.message
      if (error.response?.status === 404) {
        errorMessage = `Backend endpoint not found (404). Please ensure backend is running on port 8000 and the /api/v1/ai/question endpoint exists.`
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      }
      
      alert(`Failed to generate quiz from content. Error: ${errorMessage}. Please try again.`)
      setShowTopicInput(true)
    } finally {
      setLoading(false)
    }
  }

  const generateAIQuiz = async (quizTopic) => {
    setLoading(true)
    setShowTopicInput(false)
    startSession('quiz', quizTopic)
    try {
      // Build difficulty-specific instructions
      const difficultyInstructions = {
        easy: 'Make questions simple and straightforward, suitable for beginners. Focus on basic concepts and definitions.',
        medium: 'Make questions moderately challenging, requiring understanding of concepts and their applications.',
        hard: 'Make questions complex and challenging, requiring deep understanding, analysis, and problem-solving.',
        adaptive: 'Mix easy, medium, and hard questions to test various skill levels.'
      }

      // Build question type instructions
      const questionTypeInstructions = {
        mcq: 'Generate only Multiple Choice Questions with 4 options (A, B, C, D).',
        tf: 'Generate only True/False questions. Format: A) True, B) False',
        all: 'Generate a mix of Multiple Choice (4 options) and True/False (2 options) questions.'
      }

      let formatExample = ''
      if (questionType === 'tf') {
        formatExample = `
EXAMPLE FORMAT (FOLLOW EXACTLY):
Q: Python is a compiled programming language.
A) True
B) False
Correct: B
Explanation: Python is an interpreted language, not compiled.

---

Q: Variables in Python must be declared with a type.
A) True
B) False
Correct: B
Explanation: Python uses dynamic typing, no type declaration needed.

---
`
      } else if (questionType === 'mcq') {
        formatExample = `
EXAMPLE FORMAT (FOLLOW EXACTLY):
Q: What is the time complexity of binary search?
A) O(n)
B) O(log n)
C) O(n^2)
D) O(1)
Correct: B
Explanation: Binary search divides the search space in half each time.

---
`
      } else {
        formatExample = `
EXAMPLE FORMATS (MIX BOTH TYPES):

MCQ Example:
Q: What is the time complexity of binary search?
A) O(n)
B) O(log n)
C) O(n^2)
D) O(1)
Correct: B
Explanation: Binary search divides the search space in half each time.

---

True/False Example:
Q: Python is a compiled programming language.
A) True
B) False
Correct: B
Explanation: Python is an interpreted language, not compiled.

---
`
      }

      const typeRules = questionType === 'tf' 
        ? '- ONLY use A) True and B) False as options\n- Questions should be statements that can be true or false'
        : questionType === 'mcq'
        ? '- ALWAYS provide exactly 4 options (A, B, C, D)\n- Make all options plausible but only one correct'
        : '- Mix MCQ (4 options) and True/False (2 options)\n- Aim for roughly equal distribution'

      const randomSeed = Math.floor(Math.random() * 10000)
      const timestamp = Date.now()
      
      const prompt = `You are an expert educator creating a UNIQUE quiz about "${quizTopic}" (Session: ${randomSeed}-${timestamp}).

=== QUIZ REQUIREMENTS ===
Topic: ${quizTopic}
Number of Questions: ${numQuestions}
Difficulty: ${difficulty.toUpperCase()}
Question Type: ${questionType === 'all' ? 'Mixed (MCQ and True/False)' : questionType === 'mcq' ? 'Multiple Choice Only' : 'True/False Only'}

=== DIFFICULTY GUIDELINES ===
${difficultyInstructions[difficulty]}

=== QUESTION TYPE RULES ===
${questionTypeInstructions[questionType]}
${typeRules}

=== FORMAT EXAMPLES ===
${formatExample}
=== CRITICAL REQUIREMENTS ===
1. Generate EXACTLY ${numQuestions} BRAND NEW questions
2. Each question MUST be about "${quizTopic}"
3. Each question MUST test a DIFFERENT concept/subtopic
4. NO duplicate or similar questions to previous quizzes
5. Be CREATIVE and cover DIVERSE aspects of ${quizTopic}
6. Follow the format EXACTLY as shown in examples
7. MUST separate each question with exactly three dashes: ---
8. Always include: Q:, A), B), ${questionType !== 'tf' ? 'C), D), ' : ''}Correct:, Explanation:
9. Do NOT add extra text before or after questions
10. Start immediately with Q: for first question

=== START GENERATING ${numQuestions} UNIQUE QUESTIONS NOW ===

Q:`

      console.log('Sending quiz request to API...')
      console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:8000')
      console.log('Request payload:', {
        question: prompt.substring(0, 100) + '...',
        contentId: `quiz-${quizTopic}-${difficulty}-${numQuestions}`,
        userId: user?.id || 'user_123'
      })
      
      const response = await aiAPI.question({
        question: prompt,
        contentId: `quiz-${quizTopic}-${difficulty}-${numQuestions}`,
        userId: user?.id || 'user_123',
        chatHistory: []
      })

      console.log('✓ API Response received:', response)
      console.log('✓ Response data:', response.data)
      
      // Handle both old and new API response formats
      const content = response.data?.answer || response.data
      console.log('✓ Gemini generated content (first 500 chars):', content.substring(0, 500))
      console.log('✓ Full content length:', content.length, 'characters')
      
      const questions = []
      
      // Split by --- or multiple newlines, then filter for Q:
      const blocks = content.split(/---+/).map(b => b.trim()).filter(b => b && b.includes('Q:'))
      console.log(`Found ${blocks.length} question blocks in response`)

      blocks.forEach((block, blockIdx) => {
        if (questions.length >= numQuestions) return
        
        const lines = block.split('\n').map(l => l.trim()).filter(l => l)
        
        let questionText = ''
        const options = []
        let correctIdx = 0
        let explanation = ''

        lines.forEach(line => {
          if (line.startsWith('Q:')) {
            questionText = line.substring(2).trim()
          } else if (/^[A-D]\)/.test(line)) {
            const optionText = line.substring(2).trim()
            if (questionType === 'tf') {
              if (optionText.toLowerCase().includes('true')) options.push('True')
              else if (optionText.toLowerCase().includes('false')) options.push('False')
              else options.push(optionText)
            } else {
              options.push(optionText)
            }
          } else if (line.startsWith('Correct:')) {
            const answer = line.substring(8).trim().toUpperCase().charAt(0)
            correctIdx = answer.charCodeAt(0) - 65
          } else if (line.startsWith('Explanation:')) {
            explanation = line.substring(12).trim()
          }
        })

        const expectedOptions = questionType === 'tf' ? 2 : (questionType === 'all' ? [2, 4] : 4)
        const optionsValid = Array.isArray(expectedOptions) 
          ? expectedOptions.includes(options.length) 
          : options.length === expectedOptions
        
        if (questionText && optionsValid && explanation) {
          questions.push({
            id: `q${questions.length + 1}`,
            question: questionText,
            options,
            correctAnswer: Math.max(0, Math.min(correctIdx, options.length - 1)),
            explanation,
            difficulty,
            type: questionType
          })
        } else {
          console.warn(`Block ${blockIdx + 1} skipped:`, {
            hasQuestion: !!questionText,
            optionCount: options.length,
            expectedOptions,
            hasExplanation: !!explanation
          })
        }
      })

      if (questions.length < numQuestions) {
        console.warn(`⚠ Only parsed ${questions.length}/${numQuestions} questions`)
        console.warn('Full response:', content)
        console.warn('Blocks found:', blocks.length)
      }

      if (questions.length === 0) {
        console.error('✗ Failed to parse questions from Gemini response')
        console.error('Raw content:', content)
        throw new Error('No valid questions could be parsed from AI response')
      }
      
      console.log(`✓ Successfully parsed ${questions.length} questions from Gemini`)
      console.log('✓ Questions:', questions.map(q => ({ question: q.question.substring(0, 50) + '...', difficulty: q.difficulty, type: q.type })))
      
      setQuiz({ questions: questions.slice(0, numQuestions) })
    } catch (error) {
      console.error('Quiz generation error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      })
      
      let errorMessage = error.message
      if (error.response?.status === 404) {
        errorMessage = `Backend endpoint not found (404). Please ensure backend is running on port 8000 and the /api/v1/ai/question endpoint exists.`
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      }
      
      alert(`Failed to generate quiz. Error: ${errorMessage}. Please try again with a different topic or settings.`)
      setShowTopicInput(true)
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
      
      // Log session
      const duration = endSession()
      if (user) {
        logStudySession(user.id, 'quiz', topic, duration, percentage)
      }
      
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
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Generate personalized quizzes</p>
            </div>
          </div>

          {/* Generation Type Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setGenerationType('topic')}
              className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: generationType === 'topic' ? 'var(--color-accent-blue)' : 'var(--color-bg-secondary)',
                color: generationType === 'topic' ? '#ffffff' : 'var(--color-text-primary)',
                borderWidth: '1px',
                borderColor: generationType === 'topic' ? 'var(--color-accent-blue)' : 'var(--color-border-primary)'
              }}
            >
              Generate by Topic
            </button>
            <button
              onClick={() => setGenerationType('content')}
              className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: generationType === 'content' ? 'var(--color-accent-blue)' : 'var(--color-bg-secondary)',
                color: generationType === 'content' ? '#ffffff' : 'var(--color-text-primary)',
                borderWidth: '1px',
                borderColor: generationType === 'content' ? 'var(--color-accent-blue)' : 'var(--color-border-primary)'
              }}
            >
              Generate from Content
            </button>
          </div>

          {/* Input Field */}
          {generationType === 'topic' ? (
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
          ) : (
            <textarea
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Paste your content here or upload a file..."
              className="w-full px-6 py-4 border-2 rounded-xl focus:border-blue-500 focus:outline-none text-lg mb-4 min-h-32"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                color: 'var(--color-text-primary)'
              }}
            />
          )}

          {/* Options Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  color: 'var(--color-text-primary)'
                }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="adaptive">Adaptive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  color: 'var(--color-text-primary)'
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Question Types</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  color: 'var(--color-text-primary)'
                }}
              >
                <option value="all">All Types</option>
                <option value="mcq">Multiple Choice</option>
                <option value="tf">True/False</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              if (generationType === 'topic') {
                generateAIQuiz(topic)
              } else {
                generateQuizFromContent(contentText)
              }
            }}
            disabled={generationType === 'topic' ? !topic.trim() : !contentText.trim()}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Generate Quiz
          </button>
        </div>

        {/* My Quiz Dashboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            My Quiz Dashboard
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Recent Quizzes */}
            <div className="md:col-span-3 rounded-2xl shadow-xl p-6" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-primary)',
              borderWidth: '1px'
            }}>
              <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Recent Quizzes</h3>
              {quizHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📝</div>
                  <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>Your recent quizzes will appear here once you take one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quizHistory.slice(0, 3).map(entry => (
                    <div key={entry.id} className="p-5 rounded-xl border-2 hover:shadow-lg transition-all" style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderColor: entry.percentage >= 70 ? '#10b981' : '#f59e0b'
                    }}>
                      <h4 className="font-bold text-lg mb-3" style={{ color: 'var(--color-text-primary)' }}>{entry.topic}</h4>
                      <p className="text-4xl font-bold mb-3" style={{
                        color: entry.percentage >= 70 ? '#10b981' : '#f59e0b'
                      }}>
                        {entry.percentage}%
                      </p>
                      <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                        Score: {entry.score}/{entry.total}
                      </p>
                      <button
                        onClick={() => {
                          setTopic(entry.topic)
                          generateAIQuiz(entry.topic)
                        }}
                        className="w-full px-4 py-2.5 rounded-lg font-semibold transition-all hover:opacity-90"
                        style={{
                          backgroundColor: 'var(--color-accent-blue)',
                          color: '#ffffff'
                        }}
                      >
                        Retake Quiz
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Topics to Review */}
            <div className="rounded-2xl shadow-xl p-6" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-primary)',
              borderWidth: '1px'
            }}>
              <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Topics to Review</h3>
              {quizHistory.filter(e => e.percentage < 70).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Great job! No topics need review.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {quizHistory
                    .filter(e => e.percentage < 70)
                    .slice(0, 4)
                    .map(entry => (
                      <button
                        key={entry.id}
                        onClick={() => {
                          setTopic(entry.topic)
                          generateAIQuiz(entry.topic)
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg transition-all hover:shadow-md"
                        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
                      >
                        <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{entry.topic}</p>
                        <p className="text-sm text-yellow-600 mt-1">{entry.percentage}% • Needs practice</p>
                      </button>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Discover & Engage */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Discover New Topics
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Popular Topics */}
            <div className="md:col-span-3 rounded-2xl shadow-xl p-6" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-primary)',
              borderWidth: '1px'
            }}>
              <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Popular Topics</h3>
              <div className="flex flex-wrap gap-3">
                {['SQL', 'Machine Learning', 'React', 'Python', 'Data Structures', 'Algorithms', 'Physics', 'Chemistry', 'Biology', 'History', 'Mathematics', 'JavaScript'].map(popularTopic => (
                  <button
                    key={popularTopic}
                    onClick={() => {
                      setTopic(popularTopic)
                      generateAIQuiz(popularTopic)
                    }}
                    className="px-5 py-2.5 rounded-lg font-medium transition-all hover:shadow-md"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      borderWidth: '2px',
                      borderColor: 'var(--color-border-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-accent-blue)'
                      e.currentTarget.style.color = '#ffffff'
                      e.currentTarget.style.borderColor = 'var(--color-accent-blue)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'
                      e.currentTarget.style.color = 'var(--color-text-primary)'
                      e.currentTarget.style.borderColor = 'var(--color-border-primary)'
                    }}
                  >
                    {popularTopic}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Challenge */}
            <div className="rounded-2xl shadow-xl p-8" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderWidth: '1px',
              borderColor: 'transparent'
            }}>
              <div className="text-white text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold mb-3">Daily Challenge</h3>
                <p className="text-sm mb-6 opacity-90 leading-relaxed">Test your knowledge with 5 questions on Computer Science Fundamentals</p>
                <button
                  onClick={() => {
                    setTopic('Computer Science Fundamentals')
                    generateAIQuiz('Computer Science Fundamentals')
                  }}
                  className="w-full px-6 py-3 bg-white text-purple-700 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg"
                >
                  Start Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
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
          <p className="mb-2" style={{ color: 'var(--color-text-secondary)' }}>Creating {numQuestions} {questionType === 'tf' ? 'True/False' : questionType === 'mcq' ? 'Multiple Choice' : 'Mixed'} questions</p>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Difficulty: {difficulty} • Topic: {topic || 'Custom Content'}</p>
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
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
              backgroundColor: difficulty === 'easy' ? '#10b981' : difficulty === 'medium' ? '#3b82f6' : difficulty === 'hard' ? '#ef4444' : '#a855f7',
              color: '#ffffff'
            }}>
              {difficulty.toUpperCase()}
            </span>
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {numQuestions} Questions
            </span>
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {questionType === 'all' ? 'Mixed' : questionType === 'mcq' ? 'Multiple Choice' : 'True/False'}
            </span>
          </div>
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
