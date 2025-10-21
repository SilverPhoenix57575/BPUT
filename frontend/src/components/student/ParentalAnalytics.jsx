import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Award, Target } from 'lucide-react'
import axios from 'axios'
import useUserStore from '../../stores/userStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function ParentalAnalytics() {
  const { user } = useUserStore()
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/analytics/parental/${user.id}`)
      setAnalytics(response.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  if (!analytics) return <div className="text-center py-8">Loading analytics...</div>

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Learning Analytics 📊
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Comprehensive overview of learning progress and achievements
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <ActivityCard
          title="Study Activity Summary"
          data={analytics.activitySummary}
          icon={BarChart3}
        />
        <StreakCard streak={analytics.streak} />
        <AchievementsCard achievements={analytics.achievements} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <WeeklyChart data={analytics.weeklyStudyTime} />
        <TopicAccuracy data={analytics.topicAccuracy} />
      </div>
    </div>
  )
}

function ActivityCard({ title, data, icon: Icon }) {
  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-10 h-10 rounded-lg flex items-center justify-center">
          <Icon className="text-white" size={20} />
        </div>
        <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
      </div>
      <div className="space-y-3">
        <StatRow label="Notes Generated" value={data.notes} color="blue" />
        <StatRow label="Flashcards Created" value={data.flashcards} color="purple" />
        <StatRow label="Quizzes Taken" value={data.quizzes} color="green" />
      </div>
    </div>
  )
}

function StreakCard({ streak }) {
  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 w-10 h-10 rounded-lg flex items-center justify-center">
          <TrendingUp className="text-white" size={20} />
        </div>
        <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>Streak Progress</h3>
      </div>
      <div className="text-center py-4">
        <div className="text-6xl font-bold mb-2" style={{ color: 'var(--color-accent-blue)' }}>
          {streak}
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>Day Streak 🔥</p>
      </div>
    </div>
  )
}

function AchievementsCard({ achievements }) {
  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-10 h-10 rounded-lg flex items-center justify-center">
          <Award className="text-white" size={20} />
        </div>
        <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>Achievements</h3>
      </div>
      <div className="text-center py-4">
        <div className="text-6xl font-bold mb-2" style={{ color: 'var(--color-accent-blue)' }}>
          {achievements.length}
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>Badges Earned 🏆</p>
      </div>
    </div>
  )
}

function WeeklyChart({ data }) {
  const maxMinutes = Math.max(...data.map(d => d.minutes), 1)

  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
        Weekly Study Time
      </h3>
      <div className="flex items-end justify-between gap-2 h-48">
        {data.map((day, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gray-200 rounded-t-lg relative" style={{
              height: `${(day.minutes / maxMinutes) * 100}%`,
              minHeight: '4px',
              backgroundColor: 'var(--color-accent-blue)'
            }}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold"
                style={{ color: 'var(--color-text-primary)' }}>
                {day.minutes}m
              </div>
            </div>
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {day.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopicAccuracy({ data }) {
  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-10 h-10 rounded-lg flex items-center justify-center">
          <Target className="text-white" size={20} />
        </div>
        <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Topic Accuracy
        </h3>
      </div>
      <div className="space-y-4">
        {data.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>No data yet. Start learning!</p>
        ) : (
          data.map((topic, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {topic.topic}
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {topic.accuracy}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${topic.accuracy}%`,
                    backgroundColor: topic.accuracy >= 70 ? '#10b981' : topic.accuracy >= 50 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function StatRow({ label, value, color }) {
  const colors = {
    blue: '#3b82f6',
    purple: '#a855f7',
    green: '#10b981'
  }

  return (
    <div className="flex justify-between items-center">
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span className="text-2xl font-bold" style={{ color: colors[color] }}>
        {value}
      </span>
    </div>
  )
}
