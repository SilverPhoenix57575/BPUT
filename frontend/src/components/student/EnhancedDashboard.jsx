import { useState, useEffect } from 'react'
import { Clock, BookOpen, Target, TrendingUp, Award, Zap, Calendar, BarChart3, Brain, Trophy, Flame, Star } from 'lucide-react'
import axios from 'axios'
import useUserStore from '../../stores/userStore'
import useProgressStore from '../../stores/progressStore'
import useGamificationStore from '../../stores/gamificationStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function EnhancedDashboard() {
  const { user } = useUserStore()
  const { xp, level, streak } = useGamificationStore()
  const { masteryLevels, quizzesTaken, totalTimeSpent, loadProgress } = useProgressStore()
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const initDashboard = async () => {
      if (user?.id) {
        loadProgress(user.id)
      }
      await fetchData()
    }
    initDashboard()
  }, [])

  const fetchData = async () => {
    if (!user?.id) {
      setStats({ timeToday: 0, timeWeek: 0, notesCount: 0, flashcardsCount: 0, quizzesCount: 0 })
      setAnalytics({ activitySummary: { notes: 0, flashcards: 0, quizzes: 0 }, weeklyStudyTime: [], streak: 0, topicAccuracy: [], achievements: [] })
      return
    }
    
    try {
      const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
      
      const [dashRes, analyticsRes] = await Promise.race([
        Promise.all([
          axios.get(`${API_URL}/api/analytics/dashboard/${user.id}`).catch(() => ({ data: null })),
          axios.get(`${API_URL}/api/analytics/parental/${user.id}`).catch(() => ({ data: null }))
        ]),
        timeout(3000)
      ]).catch(() => [{ data: null }, { data: null }])
      
      setStats(dashRes.data || { timeToday: 0, timeWeek: 0, notesCount: 0, flashcardsCount: 0, quizzesCount: 0 })
      setAnalytics(analyticsRes.data || { activitySummary: { notes: 0, flashcards: 0, quizzes: 0 }, weeklyStudyTime: [], streak: 0, topicAccuracy: [], achievements: [] })
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setStats({ timeToday: 0, timeWeek: 0, notesCount: 0, flashcardsCount: 0, quizzesCount: 0 })
      setAnalytics({ activitySummary: { notes: 0, flashcards: 0, quizzes: 0 }, weeklyStudyTime: [], streak: 0, topicAccuracy: [], achievements: [] })
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const calculateAvgAccuracy = () => {
    if (!analytics?.topicAccuracy?.length) return 0
    return Math.round(analytics.topicAccuracy.reduce((sum, t) => sum + t.accuracy, 0) / analytics.topicAccuracy.length)
  }

  if (!stats || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome back, {user.name || user.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
          Here's your complete learning overview
        </p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickStat icon={Flame} label="Day Streak" value={analytics.streak || streak} color="from-orange-500 to-red-500" />
        <QuickStat icon={Zap} label="Level" value={level} color="from-yellow-500 to-orange-500" />
        <QuickStat icon={Trophy} label="Badges" value={analytics.achievements.length} color="from-purple-500 to-pink-500" />
        <QuickStat icon={Star} label="Avg Accuracy" value={`${calculateAvgAccuracy()}%`} color="from-green-500 to-emerald-500" />
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Study Time Card */}
        <div className="rounded-2xl p-6 shadow-lg" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <Clock className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Study Time</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Today</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {formatTime(stats.timeToday)}
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>This Week</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {formatTime(stats.timeWeek)}
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Total</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {formatTime(totalTimeSpent)}
              </p>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="rounded-2xl p-6 shadow-lg" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Activities</h3>
          </div>
          <div className="space-y-3">
            <ActivityBar label="Notes" value={stats.notesCount} max={50} color="#3b82f6" />
            <ActivityBar label="Flashcards" value={stats.flashcardsCount} max={100} color="#a855f7" />
            <ActivityBar label="Quizzes" value={stats.quizzesCount || quizzesTaken} max={20} color="#10b981" />
          </div>
        </div>

        {/* XP Progress */}
        <div className="rounded-2xl p-6 shadow-lg" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <Brain className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Progress</h3>
          </div>
          <div className="text-center py-4">
            <div className="text-5xl font-bold mb-2" style={{ color: 'var(--color-accent-blue)' }}>
              {level}
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Level</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${(xp / (level * 100)) * 100}%` }} />
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {xp} / {level * 100} XP
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Chart & Topic Accuracy */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <WeeklyChart data={analytics.weeklyStudyTime} />
        <TopicAccuracy data={analytics.topicAccuracy} masteryLevels={masteryLevels} />
      </div>

      {/* Achievements & Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <AchievementsCard achievements={analytics.achievements} />
        <LearningInsights stats={stats} analytics={analytics} />
      </div>
    </div>
  )
}

function QuickStat({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl p-4 shadow" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className={`bg-gradient-to-br ${color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
        <Icon className="text-white" size={20} />
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
    </div>
  )
}

function ActivityBar({ label, value, max, color }) {
  const percentage = Math.min((value / max) * 100, 100)
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
        <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="h-2 rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: color }} />
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
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="text-blue-600" size={24} />
        <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Weekly Study Time</h3>
      </div>
      <div className="flex items-end justify-between gap-2 h-48">
        {data.length > 0 ? data.map((day, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full rounded-t-lg relative" style={{
              height: `${(day.minutes / maxMinutes) * 100}%`,
              minHeight: '4px',
              backgroundColor: 'var(--color-accent-blue)'
            }}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold whitespace-nowrap"
                style={{ color: 'var(--color-text-primary)' }}>
                {day.minutes}m
              </div>
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {day.day}
            </span>
          </div>
        )) : (
          <p className="text-center w-full" style={{ color: 'var(--color-text-secondary)' }}>No data yet</p>
        )}
      </div>
    </div>
  )
}

function TopicAccuracy({ data, masteryLevels }) {
  const topics = data.length > 0 ? data : Object.entries(masteryLevels || {}).map(([topic, level]) => ({
    topic,
    accuracy: Math.round(level * 100)
  })).slice(0, 5)

  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="flex items-center gap-3 mb-6">
        <Target className="text-green-600" size={24} />
        <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Topic Mastery</h3>
      </div>
      <div className="space-y-4">
        {topics.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Complete quizzes to see your progress</p>
        ) : (
          topics.map((topic, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {topic.topic}
                </span>
                <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {topic.accuracy}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all"
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

function AchievementsCard({ achievements }) {
  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="flex items-center gap-3 mb-6">
        <Award className="text-yellow-600" size={24} />
        <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Achievements</h3>
      </div>
      {achievements.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="mx-auto mb-3 text-gray-300" size={48} />
          <p style={{ color: 'var(--color-text-secondary)' }}>Complete activities to earn badges</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {achievements.map((achievement, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <div className="text-3xl">🏆</div>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{achievement.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function LearningInsights({ stats, analytics }) {
  const totalActivities = stats.notesCount + stats.flashcardsCount + stats.quizzesCount
  const avgDailyTime = stats.timeWeek > 0 ? Math.round(stats.timeWeek / 7 / 60) : 0
  const mostActive = stats.notesCount > stats.quizzesCount ? 'Notes' : 'Quizzes'

  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="text-purple-600" size={24} />
        <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Learning Insights</h3>
      </div>
      <div className="space-y-4">
        <InsightItem 
          icon="📊" 
          label="Total Activities" 
          value={totalActivities}
          description="Keep it up!"
        />
        <InsightItem 
          icon="⏱️" 
          label="Avg Daily Time" 
          value={`${avgDailyTime} min`}
          description="Consistency is key"
        />
        <InsightItem 
          icon="🎯" 
          label="Most Active" 
          value={mostActive}
          description="Your strength area"
        />
        <InsightItem 
          icon="🔥" 
          label="Streak Status" 
          value={analytics.streak >= 7 ? 'On Fire!' : 'Building'}
          description={analytics.streak >= 7 ? 'Amazing!' : 'Keep going!'}
        />
      </div>
    </div>
  )
}

function InsightItem({ icon, label, value, description }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
        <p className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{description}</p>
      </div>
    </div>
  )
}
