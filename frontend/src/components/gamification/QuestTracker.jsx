import { useState, useEffect } from 'react'
import { Target, CheckCircle, Lock, Trophy, Zap } from 'lucide-react'
import useProgressStore from '../../stores/progressStore'

const QUESTS = [
  {
    id: 'quest_1',
    title: 'First Steps',
    description: 'Complete your first quiz',
    requirement: { type: 'quizzes', count: 1 },
    xp: 100,
    badge: '🎯'
  },
  {
    id: 'quest_2',
    title: 'Knowledge Seeker',
    description: 'Master 3 competencies',
    requirement: { type: 'mastery', count: 3 },
    xp: 300,
    badge: '📚'
  },
  {
    id: 'quest_3',
    title: 'Quiz Master',
    description: 'Complete 10 quizzes',
    requirement: { type: 'quizzes', count: 10 },
    xp: 500,
    badge: '🏆'
  },
  {
    id: 'quest_4',
    title: 'Dedicated Learner',
    description: 'Study for 5 hours total',
    requirement: { type: 'time', count: 18000 },
    xp: 400,
    badge: '⏰'
  },
  {
    id: 'quest_5',
    title: 'Perfect Score',
    description: 'Get 100% on any quiz',
    requirement: { type: 'perfect', count: 1 },
    xp: 250,
    badge: '⭐'
  }
]

export default function QuestTracker() {
  const { quizzesTaken, masteredCompetencies, totalTimeSpent, perfectScores } = useProgressStore()
  const [completedQuests, setCompletedQuests] = useState([])

  useEffect(() => {
    const completed = QUESTS.filter(quest => {
      switch (quest.requirement.type) {
        case 'quizzes':
          return quizzesTaken >= quest.requirement.count
        case 'mastery':
          return masteredCompetencies >= quest.requirement.count
        case 'time':
          return totalTimeSpent >= quest.requirement.count
        case 'perfect':
          return perfectScores >= quest.requirement.count
        default:
          return false
      }
    }).map(q => q.id)
    setCompletedQuests(completed)
  }, [quizzesTaken, masteredCompetencies, totalTimeSpent, perfectScores])

  const getProgress = (quest) => {
    let current = 0
    switch (quest.requirement.type) {
      case 'quizzes':
        current = quizzesTaken
        break
      case 'mastery':
        current = masteredCompetencies
        break
      case 'time':
        current = totalTimeSpent
        break
      case 'perfect':
        current = perfectScores
        break
    }
    return Math.min((current / quest.requirement.count) * 100, 100)
  }

  const totalXP = completedQuests.reduce((sum, id) => {
    const quest = QUESTS.find(q => q.id === id)
    return sum + (quest?.xp || 0)
  }, 0)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Quest Tracker
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Complete quests to earn XP and badges</p>
      </div>

      {/* XP Summary */}
      <div className="rounded-lg shadow p-6 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Total XP Earned</p>
            <p className="text-4xl font-bold">{totalXP} XP</p>
          </div>
          <Trophy size={64} className="opacity-80" />
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <div>
            <span className="opacity-90">Completed:</span>
            <span className="font-bold ml-2">{completedQuests.length}/{QUESTS.length}</span>
          </div>
          <div>
            <span className="opacity-90">In Progress:</span>
            <span className="font-bold ml-2">{QUESTS.length - completedQuests.length}</span>
          </div>
        </div>
      </div>

      {/* Quest List */}
      <div className="space-y-4">
        {QUESTS.map(quest => {
          const isCompleted = completedQuests.includes(quest.id)
          const progress = getProgress(quest)
          const isLocked = false // All quests unlocked for now

          return (
            <div
              key={quest.id}
              className={`rounded-lg shadow p-6 transition-all ${
                isCompleted ? 'border-2 border-green-500' : ''
              }`}
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: isCompleted ? '#10b981' : 'var(--color-border-primary)',
                borderWidth: isCompleted ? '2px' : '1px',
                opacity: isLocked ? 0.6 : 1
              }}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{quest.badge}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {quest.title}
                    </h3>
                    {isCompleted && <CheckCircle className="text-green-500" size={24} />}
                    {isLocked && <Lock className="text-gray-400" size={20} />}
                  </div>
                  <p className="mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    {quest.description}
                  </p>

                  {/* Progress Bar */}
                  {!isCompleted && !isLocked && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{
                        backgroundColor: 'var(--color-bg-tertiary)'
                      }}>
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                      <Zap size={16} className="text-yellow-500" />
                      <span className="font-semibold">{quest.xp} XP</span>
                    </div>
                    {isCompleted && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
