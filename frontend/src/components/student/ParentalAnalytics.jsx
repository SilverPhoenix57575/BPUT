import { BarChart3, TrendingUp, Flame, Target, Award } from 'lucide-react'
import useAnalyticsStore from '../../stores/analyticsStore'
import useGamificationStore from '../../stores/gamificationStore'

export default function ParentalAnalytics() {
  const { activityStats, weeklyStudyTime, topicAccuracy } = useAnalyticsStore()
  const { streak, achievements } = useGamificationStore()

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const maxTime = Math.max(...weeklyStudyTime, 1)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Learning Analytics 📊
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Monitor progress and study habits</p>
      </div>

      {/* Study Activity Summary */}
      <div className="rounded-xl p-6 shadow-md mb-6" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Study Activity Summary</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <ActivityBar label="Notes Generated" value={activityStats.notes} max={20} color="bg-blue-500" />
          <ActivityBar label="Flashcards Generated" value={activityStats.flashcards} max={50} color="bg-purple-500" />
          <ActivityBar label="Quizzes Taken" value={activityStats.quizzes} max={10} color="bg-green-500" />
        </div>
      </div>

      {/* Weekly Study Time */}
      <div className="rounded-xl p-6 shadow-md mb-6" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-purple-600" size={24} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Weekly Study Time</h3>
        </div>
        <div className="flex items-end justify-between gap-4 h-48">
          {weeklyStudyTime.map((time, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                {time}m
              </div>
              <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '100%' }}>
                <div
                  className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg absolute bottom-0 w-full transition-all"
                  style={{ height: `${(time / maxTime) * 100}%` }}
                />
              </div>
              <div className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {days[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Streak Progress */}
        <div className="rounded-xl p-6 shadow-md" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center gap-2 mb-6">
            <Flame className="text-orange-600" size={24} />
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Streak Progress</h3>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-4">🔥</div>
            <div className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{streak} Days</div>
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Current Streak</div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>Goal: 30 days</div>
          </div>
        </div>

        {/* Topic Accuracy */}
        <div className="rounded-xl p-6 shadow-md" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center gap-2 mb-6">
            <Target className="text-green-600" size={24} />
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Topic Accuracy</h3>
          </div>
          <div className="space-y-4">
            {Object.keys(topicAccuracy).length > 0 ? (
              Object.entries(topicAccuracy).map(([topic, data]) => (
                <div key={topic}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{topic}</span>
                    <span className="text-sm font-bold" style={{ color: data.accuracy >= 70 ? '#10b981' : '#f59e0b' }}>
                      {data.accuracy}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${data.accuracy >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${data.accuracy}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
                No quiz data yet. Take a quiz to see accuracy!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Achievements Overview */}
      <div className="rounded-xl p-6 shadow-md" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <div className="flex items-center gap-2 mb-6">
          <Award className="text-yellow-600" size={24} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Achievements Overview</h3>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-xl p-4 text-center transition-all ${achievement.earned ? 'shadow-lg' : 'opacity-50'}`}
              style={{
                backgroundColor: achievement.earned ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                borderWidth: '1px'
              }}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                {achievement.name}
              </div>
              {!achievement.earned && achievement.target && (
                <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {achievement.progress}/{achievement.target}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ActivityBar({ label, value, max, color }) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{label}</span>
        <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
        <div
          className={`${color} h-8 rounded-full transition-all flex items-center justify-end pr-3`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 20 && (
            <span className="text-white text-xs font-bold">{Math.round(percentage)}%</span>
          )}
        </div>
      </div>
    </div>
  )
}
