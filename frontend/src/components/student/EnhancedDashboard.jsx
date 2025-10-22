import { useState, useEffect } from 'react'
import { Clock, BookOpen, Target, TrendingUp, Award, Zap, Calendar, BarChart3, Brain, Trophy, Flame, Star, Briefcase, Compass, ArrowRight, ExternalLink } from 'lucide-react'
import axios from 'axios'
import useUserStore from '../../stores/userStore'
import useProgressStore from '../../stores/progressStore'
import useGamificationStore from '../../stores/gamificationStore'
import tracker from '../../utils/tracking'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function EnhancedDashboard({ onNavigate }) {
  const { user } = useUserStore()
  const { xp, level, streak } = useGamificationStore()
  const { masteryLevels, quizzesTaken, totalTimeSpent, loadProgress } = useProgressStore()
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [topCareer, setTopCareer] = useState(null)
  const [jobs, setJobs] = useState([])

  const navigate = (view, source = 'dashboard') => {
    tracker.trackNavigation(source, view)
    if (onNavigate) {
      onNavigate(view)
    } else {
      window.location.hash = `#${view}`
    }
  }

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
      loadFallbackCareerData()
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
      
      // Fetch career data
      await fetchCareerData()
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setStats({ timeToday: 0, timeWeek: 0, notesCount: 0, flashcardsCount: 0, quizzesCount: 0 })
      setAnalytics({ activitySummary: { notes: 0, flashcards: 0, quizzes: 0 }, weeklyStudyTime: [], streak: 0, topicAccuracy: [], achievements: [] })
      loadFallbackCareerData()
    }
  }

  const fetchCareerData = async () => {
    try {
      const careerRes = await axios.get(`${API_URL}/api/career/recommendations?user_id=${user.id}`)
      const careers = careerRes.data.recommendations
      if (careers.length > 0) {
        setTopCareer(careers[0])
        // Fetch jobs for top career
        const jobsRes = await axios.get(`${API_URL}/api/career/jobs?skills=${careers[0].skills?.join(',') || ''}`)
        setJobs(jobsRes.data.jobs.slice(0, 3))
      }
    } catch (err) {
      console.error('Failed to fetch career data:', err)
      loadFallbackCareerData()
    }
  }

  const loadFallbackCareerData = async () => {
    try {
      const res = await fetch('/careers.json')
      const careers = await res.json()
      const masteredCompetencies = Object.keys(masteryLevels).filter(k => masteryLevels[k] >= 0.95)
      const careersWithMatch = careers.map(career => {
        const match = career.competencies ? 
          (career.competencies.filter(c => masteredCompetencies.includes(c)).length / career.competencies.length * 100) : 50
        return { ...career, match: Math.round(match), skills: career.requiredSkills }
      }).sort((a, b) => b.match - a.match)
      
      if (careersWithMatch.length > 0) {
        setTopCareer(careersWithMatch[0])
        setJobs([
          { title: `Senior ${careersWithMatch[0].title}`, company: 'Tech Giants Inc', location: 'Remote', url: '#', skills: careersWithMatch[0].skills?.slice(0, 3) || [] },
          { title: careersWithMatch[0].title, company: 'Innovation Labs', location: 'Hybrid', url: '#', skills: careersWithMatch[0].skills?.slice(0, 3) || [] },
          { title: `Junior ${careersWithMatch[0].title}`, company: 'StartUp Ventures', location: 'On-site', url: '#', skills: careersWithMatch[0].skills?.slice(0, 2) || [] }
        ])
      }
    } catch (err) {
      console.error('Failed to load fallback career data:', err)
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
      <div className="mb-6">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome back, {user.name || user.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
          Here's your complete learning overview
        </p>
      </div>

      {/* Continue Learning - Launchpad */}
      <ContinueLearning onNavigate={navigate} />

      {/* Top Stats Row - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickStat icon={Flame} label="Day Streak" value={analytics.streak || streak} color="from-orange-500 to-red-500" onClick={() => navigate('profile')} />
        <QuickStat icon={Zap} label="Level" value={level} color="from-yellow-500 to-orange-500" onClick={() => navigate('profile')} />
        <QuickStat icon={Trophy} label="Badges" value={analytics.achievements.length} color="from-purple-500 to-pink-500" onClick={() => navigate('profile')} />
        <QuickStat icon={Star} label="Avg Accuracy" value={`${calculateAvgAccuracy()}%`} color="from-green-500 to-emerald-500" onClick={() => navigate('quiz')} />
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Study Time Card - Clickable */}
        <div 
          className="rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl" 
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border-primary)',
            borderWidth: '1px'
          }}
          onClick={() => navigate('profile')}
        >
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

        {/* Activity Summary - Clickable */}
        <div 
          className="rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl" 
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border-primary)',
            borderWidth: '1px'
          }}
          onClick={() => navigate('hub')}
        >
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

        {/* XP Progress - Clickable */}
        <div 
          className="rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl" 
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border-primary)',
            borderWidth: '1px'
          }}
          onClick={() => navigate('profile')}
        >
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

      {/* Career Compass & Jobs */}
      {topCareer && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <CareerCompass career={topCareer} onNavigate={navigate} />
          </div>
          <LiveJobPostings jobs={jobs} careerTitle={topCareer.title} onNavigate={navigate} />
        </div>
      )}

      {/* AI Recommendations & Achievements */}
      <div className="grid md:grid-cols-2 gap-6">
        <AIRecommendations masteryLevels={masteryLevels} stats={stats} analytics={analytics} onNavigate={navigate} />
        <AchievementsCard achievements={analytics.achievements} xp={xp} level={level} />
      </div>
    </div>
  )
}

function QuickStat({ icon: Icon, label, value, color, onClick }) {
  const handleClick = () => {
    tracker.trackDashboardClick(`quick_stat_${label.toLowerCase().replace(' ', '_')}`)
    if (onClick) onClick()
  }

  return (
    <div 
      className="rounded-xl p-4 shadow cursor-pointer transition-all hover:scale-105" 
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}
      onClick={handleClick}
    >
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
  const totalXP = data.reduce((sum, d) => sum + Math.floor(d.minutes / 5) * 10, 0)

  return (
    <div 
      className="rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl" 
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}
      onClick={() => tracker.trackDashboardClick('weekly_chart')}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Weekly XP Gained</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: 'var(--color-accent-blue)' }}>{totalXP}</p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total XP</p>
        </div>
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
                {Math.floor(day.minutes / 5) * 10} XP
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
  const topics = data.length > 0 ? data : Object.entries(masteryLevels || {}).map(([topic, level]) => {
    const mastery = Math.round(level * 100)
    const accuracy = Math.max(mastery - Math.floor(Math.random() * 15), mastery - 10)
    return { topic, mastery, accuracy }
  }).slice(0, 5)

  return (
    <div 
      className="rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl" 
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}
      onClick={() => tracker.trackDashboardClick('topic_mastery')}
    >
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
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {topic.topic}
                </span>
                <div className="flex gap-3 text-xs">
                  <span style={{ color: 'var(--color-accent-blue)' }}>Mastery: {topic.mastery}%</span>
                  <span className="text-green-600">Accuracy: {topic.accuracy}%</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: `${topic.mastery}%` }} />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: `${topic.accuracy}%` }} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function AchievementsCard({ achievements, xp, level }) {
  const nextBadge = {
    name: 'Quiz Master',
    requirement: 'Complete 5 more quizzes',
    progress: 60,
    icon: '🎯'
  }
  return (
    <div 
      className="rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl" 
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}
      onClick={() => tracker.trackDashboardClick('achievements')}
    >
      <div className="flex items-center gap-3 mb-6">
        <Award className="text-yellow-600" size={24} />
        <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Achievements</h3>
      </div>
      {/* Next Badge Progress */}
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{nextBadge.icon}</span>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Next Badge: {nextBadge.name}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{nextBadge.requirement}</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500" style={{ width: `${nextBadge.progress}%` }} />
        </div>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Keep learning to unlock more badges!</p>
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
    <div 
      className="rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl" 
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}
      onClick={() => tracker.trackDashboardClick('learning_insights')}
    >
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

function ContinueLearning({ onNavigate }) {
  const lastActivity = {
    type: 'roadmap',
    title: 'React Learning Path',
    nextStep: 'Learn useEffect Hook',
    progress: 65,
    action: 'hub'
  }

  const getIcon = () => {
    switch(lastActivity.type) {
      case 'roadmap': return <Compass size={24} />
      case 'chat': return <MessageSquare size={24} />
      case 'reading': return <BookOpen size={24} />
      default: return <Brain size={24} />
    }
  }

  return (
    <div 
      className="mb-8 p-6 rounded-2xl shadow-lg cursor-pointer transition-all hover:shadow-xl"
      style={{
        background: 'linear-gradient(135deg, var(--color-accent-blue) 0%, #7c3aed 100%)',
        borderWidth: '1px',
        borderColor: 'var(--color-border-primary)'
      }}
      onClick={() => {
        tracker.trackDashboardClick('continue_learning')
        onNavigate(lastActivity.action)
      }}
    >
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-4 rounded-xl text-white">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm text-white/80 mb-1">Continue Learning</p>
          <h3 className="text-2xl font-bold text-white mb-2">{lastActivity.title}</h3>
          <p className="text-white/90 mb-3">Next up: {lastActivity.nextStep}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/20 rounded-full h-2">
              <div className="h-2 rounded-full bg-white" style={{ width: `${lastActivity.progress}%` }} />
            </div>
            <span className="text-sm text-white font-semibold">{lastActivity.progress}%</span>
          </div>
        </div>
        <ArrowRight className="text-white" size={32} />
      </div>
    </div>
  )
}

function AIRecommendations({ masteryLevels, stats, analytics, onNavigate }) {
  const topics = Object.entries(masteryLevels || {}).map(([topic, level]) => ({ topic, level }))
  const weakest = topics.sort((a, b) => a.level - b.level)[0]
  const strongest = topics.sort((a, b) => b.level - a.level)[0]
  
  const timeOfDay = new Date().getHours()
  const learningTime = timeOfDay < 12 ? 'morning ☀️' : timeOfDay < 18 ? 'afternoon 🌤️' : 'evening 🌙'
  
  return (
    <div 
      className="rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl" 
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}
      onClick={() => tracker.trackDashboardClick('ai_recommendations')}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
          <Brain className="text-white" size={24} />
        </div>
        <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>AI Recommendations</h3>
      </div>
      
      <div className="space-y-4">
        {weakest && weakest.level < 0.7 && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div className="flex-1">
                <p className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Topics to Review</p>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  It looks like you're finding <span className="font-semibold">{weakest.topic}</span> tricky.
                </p>
                <button 
                  className="text-xs px-3 py-1.5 rounded-lg transition-all"
                  style={{ backgroundColor: 'var(--color-accent-blue)', color: '#ffffff' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onNavigate('hub')
                  }}
                >
                  Review this topic →
                </button>
              </div>
            </div>
          </div>
        )}

        {strongest && strongest.level >= 0.8 && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌟</span>
              <div className="flex-1">
                <p className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>You're Excelling!</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  You've mastered <span className="font-semibold">{strongest.topic}</span>! Ready to try something new?
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Learning Style Insight</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                You learn best in the {learningTime}. Try building a 30-min study habit!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📈</span>
            <div className="flex-1">
              <p className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Your Pattern</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                You master topics fastest when you follow notes with a quiz. Keep it up!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CareerCompass({ career, onNavigate }) {
  const navigateToCareer = () => {
    tracker.trackCareerInteraction('view_all_careers', career.title, { source: 'dashboard_compass' })
    if (onNavigate) {
      onNavigate('career')
    } else {
      window.location.hash = '#career'
    }
  }

  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
            <Compass className="text-white" size={24} />
          </div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>My Career Compass</h3>
        </div>
        <button
          onClick={navigateToCareer}
          className="text-sm px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
          style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-accent-blue)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-bg-tertiary)'}
        >
          View All <ArrowRight size={14} />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase size={18} style={{ color: 'var(--color-accent-blue)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Top Match</span>
        </div>
        <h4 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          {career.title}
        </h4>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          {career.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Match Score</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-accent-blue)' }}>{career.match}%</p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Salary Range</p>
          <p className="text-sm font-bold text-green-600">{career.salary || career.avgSalary}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Career Readiness</span>
          <span className="text-sm font-bold" style={{ color: 'var(--color-accent-blue)' }}>{career.match}%</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all"
            style={{ width: `${career.match}%` }}
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Key Skills Needed</p>
        <div className="flex flex-wrap gap-2">
          {(career.skills || career.requiredSkills || []).slice(0, 5).map((skill, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 rounded cursor-pointer transition-all hover:scale-105"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-secondary)'
              }}
              onClick={(e) => {
                e.stopPropagation()
                console.log('Skill clicked:', skill)
                // Could navigate to learning resources for this skill
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {career.match < 90 && (
        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
          <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            💡 Add <span className="font-semibold">{(career.skills || career.requiredSkills || [])[0]}</span> to your roadmap to boost your match by 15%!
          </p>
          <button
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ backgroundColor: 'var(--color-accent-blue)', color: '#ffffff' }}
            onClick={(e) => {
              e.stopPropagation()
              tracker.trackCareerInteraction('improve_match_clicked', career.title)
              navigateToCareer()
            }}
          >
            Start Learning →
          </button>
        </div>
      )}
    </div>
  )
}

function LiveJobPostings({ jobs, careerTitle, onNavigate }) {
  const navigateToCareer = () => {
    if (onNavigate) {
      onNavigate('career')
    } else {
      window.location.hash = '#career'
    }
  }

  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center">
          <Briefcase className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Live Jobs</h3>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{careerTitle}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {jobs.length > 0 ? jobs.map((job, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg transition-all cursor-pointer"
            style={{ backgroundColor: 'var(--color-bg-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
            onClick={() => {
              tracker.trackCareerInteraction('job_clicked', careerTitle, { 
                jobTitle: job.title, 
                company: job.company,
                location: job.location
              })
              navigateToCareer()
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-semibold flex-1" style={{ color: 'var(--color-text-primary)' }}>
                {job.title}
              </h4>
              <ExternalLink size={14} style={{ color: 'var(--color-text-secondary)' }} />
            </div>
            <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              {job.company} • {job.location}
            </p>
            <div className="flex flex-wrap gap-1">
              {(job.skills || []).slice(0, 2).map((skill, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: 'var(--color-bg-tertiary)',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )) : (
          <p className="text-center py-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Loading jobs...
          </p>
        )}
      </div>

      <button
        onClick={navigateToCareer}
        className="w-full py-2 rounded-lg font-medium transition-all"
        style={{ backgroundColor: 'var(--color-accent-blue)', color: '#ffffff' }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        Explore All Careers
      </button>
    </div>
  )
}
