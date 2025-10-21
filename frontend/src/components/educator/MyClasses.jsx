import { useState } from 'react'
import { Users, Eye, ArrowLeft, Mail, TrendingUp, Clock } from 'lucide-react'

export default function MyClasses() {
  const [selectedClass, setSelectedClass] = useState(null)

  const classes = [
    { id: 1, name: 'Class 10A', subject: 'Mathematics', students: 30, teacher: 'You', avgScore: 85, attendance: 92 },
    { id: 2, name: 'Class 10B', subject: 'Mathematics', students: 28, teacher: 'You', avgScore: 78, attendance: 88 },
    { id: 3, name: 'Class 9A', subject: 'Science', students: 32, teacher: 'You', avgScore: 82, attendance: 90 },
    { id: 4, name: 'Class 9B', subject: 'Science', students: 30, teacher: 'You', avgScore: 80, attendance: 85 }
  ]

  const studentsList = [
    { id: 1, name: 'Aisha Khan', email: 'aisha@student.com', avgScore: 92, quizzes: 15, timeSpent: '12h 30m', status: 'Excellent' },
    { id: 2, name: 'Rahul Sharma', email: 'rahul@student.com', avgScore: 85, quizzes: 14, timeSpent: '10h 45m', status: 'Good' },
    { id: 3, name: 'Priya Patel', email: 'priya@student.com', avgScore: 78, quizzes: 12, timeSpent: '9h 20m', status: 'Good' },
    { id: 4, name: 'Arjun Singh', email: 'arjun@student.com', avgScore: 65, quizzes: 10, timeSpent: '7h 15m', status: 'At Risk' },
    { id: 5, name: 'Sneha Reddy', email: 'sneha@student.com', avgScore: 88, quizzes: 16, timeSpent: '11h 50m', status: 'Excellent' }
  ]

  if (selectedClass) {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <button onClick={() => setSelectedClass(null)} className="flex items-center gap-2 mb-6 text-blue-600 hover:underline">
          <ArrowLeft size={20} />
          Back to Classes
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{selectedClass.name}</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>{selectedClass.subject} • {selectedClass.students} Students</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={TrendingUp} label="Avg Score" value={`${selectedClass.avgScore}%`} color="from-green-500 to-emerald-500" />
          <StatCard icon={Users} label="Attendance" value={`${selectedClass.attendance}%`} color="from-blue-500 to-cyan-500" />
          <StatCard icon={Clock} label="Total Students" value={selectedClass.students} color="from-purple-500 to-pink-500" />
        </div>

        <div className="rounded-2xl shadow-lg overflow-hidden" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="p-6 border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Student Roster</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <tr>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Name</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Email</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Avg Score</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Quizzes</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Time Spent</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {studentsList.map(student => (
                  <tr key={student.id} className="border-t hover:bg-opacity-50" style={{ borderColor: 'var(--color-border-primary)' }}>
                    <td className="px-6 py-4 font-medium" style={{ color: 'var(--color-text-primary)' }}>{student.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <Mail size={16} />
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${student.avgScore >= 80 ? 'text-green-600' : student.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {student.avgScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{student.quizzes}</td>
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

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>My Classes</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage your classrooms and students</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {classes.map(cls => (
          <div key={cls.id} className="rounded-2xl p-6 shadow-lg" style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border-primary)',
            borderWidth: '1px'
          }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{cls.name}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{cls.subject}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <Users size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{cls.students}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Avg Score</p>
                <p className="text-xl font-bold text-green-600">{cls.avgScore}%</p>
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Attendance</p>
                <p className="text-xl font-bold text-blue-600">{cls.attendance}%</p>
              </div>
            </div>
            <button onClick={() => setSelectedClass(cls)} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Eye size={18} />
              View Class
            </button>
          </div>
        ))}
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
