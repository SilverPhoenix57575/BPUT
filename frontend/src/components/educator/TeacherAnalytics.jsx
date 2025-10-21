import { TrendingUp, Users, Clock, Target } from 'lucide-react'

export default function TeacherAnalytics() {
  const students = [
    { id: 1, name: 'Aisha Khan', avgScore: 92, flashcards: 85, timeSpent: '12h 30m', status: 'Excellent' },
    { id: 2, name: 'Rahul Sharma', avgScore: 85, flashcards: 78, timeSpent: '10h 45m', status: 'Good' },
    { id: 3, name: 'Priya Patel', avgScore: 78, flashcards: 65, timeSpent: '9h 20m', status: 'Good' },
    { id: 4, name: 'Arjun Singh', avgScore: 65, flashcards: 45, timeSpent: '7h 15m', status: 'At Risk' },
    { id: 5, name: 'Sneha Reddy', avgScore: 88, flashcards: 82, timeSpent: '11h 50m', status: 'Excellent' }
  ]

  const atRiskStudents = students.filter(s => s.avgScore < 70)

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Analytics</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Track student performance and engagement</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} label="Total Students" value="120" color="from-blue-500 to-cyan-500" />
        <StatCard icon={TrendingUp} label="Avg Class Score" value="82%" color="from-green-500 to-emerald-500" />
        <StatCard icon={Clock} label="Total Study Time" value="450h" color="from-purple-500 to-pink-500" />
        <StatCard icon={Target} label="At Risk" value={atRiskStudents.length} color="from-red-500 to-orange-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl p-6 shadow-lg" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Engagement Breakdown</h3>
          <div className="space-y-4">
            <ProgressBar label="Quizzes" value={75} color="bg-blue-600" />
            <ProgressBar label="Flashcards" value={60} color="bg-purple-600" />
            <ProgressBar label="Notes" value={85} color="bg-green-600" />
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <h3 className="text-xl font-bold mb-4 text-red-600">At Risk Students</h3>
          <div className="space-y-3">
            {atRiskStudents.map(student => (
              <div key={student.id} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{student.name}</p>
                  <span className="text-red-600 font-bold">{student.avgScore}%</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Low Engagement</p>
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
          <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Student Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <tr>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Name</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Avg Score</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Flashcards</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Time Spent</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="border-t" style={{ borderColor: 'var(--color-border-primary)' }}>
                  <td className="px-6 py-4 font-medium" style={{ color: 'var(--color-text-primary)' }}>{student.name}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${student.avgScore >= 80 ? 'text-green-600' : student.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {student.avgScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{student.flashcards}%</td>
                  <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{student.timeSpent}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                      student.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

function ProgressBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
        <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{value}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
