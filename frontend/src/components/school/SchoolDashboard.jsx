import { Users, School, BookOpen, TrendingUp } from 'lucide-react'

export default function SchoolDashboard() {
  const stats = {
    teachers: 45,
    students: 1250,
    classrooms: 32,
    activeClasses: 28
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>School Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Institution-wide overview</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Teachers" value={stats.teachers} color="from-blue-500 to-cyan-500" />
        <StatCard icon={BookOpen} label="Total Students" value={stats.students} color="from-purple-500 to-pink-500" />
        <StatCard icon={School} label="Classrooms" value={stats.classrooms} color="from-orange-500 to-red-500" />
        <StatCard icon={TrendingUp} label="Active Classes" value={stats.activeClasses} color="from-green-500 to-emerald-500" />
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
