import { Users, BookOpen, Clock, Calendar } from 'lucide-react'
import useUserStore from '../../stores/userStore'

export default function TeacherDashboard() {
  const { user } = useUserStore()

  const stats = {
    classes: 4,
    students: 120,
    pendingGrading: 15,
    upcomingSessions: 3
  }

  const recentActivity = [
    { id: 1, text: 'Student Aisha Khan submitted Quiz 5', time: '10 mins ago', type: 'submission' },
    { id: 2, text: 'New message from Rahul Sharma', time: '1 hour ago', type: 'message' },
    { id: 3, text: 'Class 10A completed Flashcard Set 3', time: '2 hours ago', type: 'completion' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Welcome, {user.name || user.email?.split('@')[0]}! 👋
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Here's your teaching overview</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} label="Classes" value={stats.classes} color="from-blue-500 to-cyan-500" />
        <StatCard icon={BookOpen} label="Students" value={stats.students} color="from-purple-500 to-pink-500" />
        <StatCard icon={Clock} label="Pending Grading" value={stats.pendingGrading} color="from-orange-500 to-red-500" />
        <StatCard icon={Calendar} label="Upcoming Sessions" value={stats.upcomingSessions} color="from-green-500 to-emerald-500" />
      </div>

      <div className="rounded-2xl p-6 shadow-lg" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map(activity => (
            <div key={activity.id} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{activity.text}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl p-6 shadow" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className={`bg-gradient-to-br ${color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
        <Icon className="text-white" size={24} />
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{value}</div>
      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
    </div>
  )
}
