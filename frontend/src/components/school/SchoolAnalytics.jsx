import { TrendingUp, Users, Award, Clock } from 'lucide-react'

export default function SchoolAnalytics() {
  const topClassrooms = [
    { name: 'Class 10A', avgScore: 92, flashcards: 95, teacher: 'Ms. Priya Sharma' },
    { name: 'Class 9B', avgScore: 88, flashcards: 90, teacher: 'Ms. Anjali Patel' },
    { name: 'Class 10B', avgScore: 85, flashcards: 88, teacher: 'Mr. Rahul Kumar' }
  ]

  const weeklyActivity = [
    { day: 'Mon', teachers: 42, students: 1100 },
    { day: 'Tue', teachers: 45, students: 1180 },
    { day: 'Wed', teachers: 43, students: 1150 },
    { day: 'Thu', teachers: 44, students: 1200 },
    { day: 'Fri', teachers: 45, students: 1220 },
    { day: 'Sat', teachers: 38, students: 950 },
    { day: 'Sun', teachers: 25, students: 600 }
  ]

  const maxStudents = Math.max(...weeklyActivity.map(d => d.students))

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>School Analytics</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Institution-wide performance metrics</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} label="Total Engagement" value="95%" color="from-blue-500 to-cyan-500" />
        <StatCard icon={TrendingUp} label="Avg Performance" value="87%" color="from-green-500 to-emerald-500" />
        <StatCard icon={Clock} label="Study Hours" value="8,450h" color="from-purple-500 to-pink-500" />
        <StatCard icon={Award} label="Achievements" value="1,250" color="from-yellow-500 to-orange-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl p-6 shadow-lg" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Weekly Activity Trend</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyActivity.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg relative" style={{
                  height: `${(day.students / maxStudents) * 100}%`,
                  minHeight: '4px',
                  backgroundColor: 'var(--color-accent-blue)'
                }}>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold whitespace-nowrap"
                    style={{ color: 'var(--color-text-primary)' }}>
                    {day.students}
                  </div>
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Platform Engagement Heatmap</h3>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>{day}</div>
                <div className="h-16 rounded" style={{
                  backgroundColor: idx < 5 ? '#10b981' : idx === 5 ? '#f59e0b' : '#ef4444',
                  opacity: idx < 5 ? 0.8 : idx === 5 ? 0.6 : 0.4
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl shadow-lg overflow-hidden" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <div className="p-6 border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
          <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Top Performing Classrooms</h3>
        </div>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            <tr>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Classroom</th>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Teacher</th>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Avg Quiz Score</th>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Flashcard Completion</th>
            </tr>
          </thead>
          <tbody>
            {topClassrooms.map((classroom, idx) => (
              <tr key={idx} className="border-t" style={{ borderColor: 'var(--color-border-primary)' }}>
                <td className="px-6 py-4 font-medium" style={{ color: 'var(--color-text-primary)' }}>{classroom.name}</td>
                <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{classroom.teacher}</td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-green-600">{classroom.avgScore}%</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-blue-600">{classroom.flashcards}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
