import { useState, useEffect } from 'react'
import { Clock, BookOpen, Brain, Target } from 'lucide-react'
import axios from 'axios'
import useUserStore from '../../stores/userStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Dashboard() {
  const { user } = useUserStore()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/analytics/dashboard/${user.id}`)
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  if (!stats) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Welcome back, {user.name || user.email}! 👋
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Here's your learning summary</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <StatCard
          icon={Clock}
          title="Time Spent Studying"
          stats={[
            { label: 'Today', value: formatTime(stats.timeToday) },
            { label: 'This Week', value: formatTime(stats.timeWeek) }
          ]}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={Target}
          title="Activity Summary"
          stats={[
            { label: 'Notes', value: stats.notesCount },
            { label: 'Flashcards', value: stats.flashcardsCount },
            { label: 'Quizzes', value: stats.quizzesCount }
          ]}
          gradient="from-purple-500 to-pink-500"
        />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, title, stats, gradient }) {
  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`bg-gradient-to-br ${gradient} w-12 h-12 rounded-xl flex items-center justify-center`}>
          <Icon className="text-white" size={24} />
        </div>
        <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
      </div>
      <div className="space-y-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</span>
            <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
