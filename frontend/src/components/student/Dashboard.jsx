import { Clock, BookOpen, Brain, TrendingUp } from 'lucide-react'
import useAnalyticsStore from '../../stores/analyticsStore'
import useGamificationStore from '../../stores/gamificationStore'

export default function Dashboard() {
  const { studyTime, activityStats } = useAnalyticsStore()
  const { xp, level, streak } = useGamificationStore()

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Welcome Back! 👋
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Here's your learning summary</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Clock}
          label="Today"
          value={`${studyTime.today} min`}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={TrendingUp}
          label="This Week"
          value={`${studyTime.thisWeek} min`}
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={Brain}
          label="Level"
          value={level}
          color="from-orange-500 to-red-500"
        />
        <StatCard
          icon={BookOpen}
          label="Streak"
          value={`${streak} days`}
          color="from-green-500 to-emerald-500"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <ActivityCard label="Notes Generated" value={activityStats.notes} icon="📝" />
        <ActivityCard label="Flashcards Created" value={activityStats.flashcards} icon="🎴" />
        <ActivityCard label="Quizzes Taken" value={activityStats.quizzes} icon="🎯" />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl p-6 shadow-md" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className={`bg-gradient-to-br ${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="text-white" size={24} />
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{value}</div>
      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
    </div>
  )
}

function ActivityCard({ label, value, icon }) {
  return (
    <div className="rounded-xl p-6 shadow-md text-center" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{value}</div>
      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
    </div>
  )
}
