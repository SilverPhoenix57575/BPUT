import { Plus, Users, User } from 'lucide-react'

export default function ClassroomManagement() {
  const classrooms = [
    { id: 1, name: '6A', teacher: 'Ms. Priya Sharma', students: 30, subject: 'Mathematics' },
    { id: 2, name: '6B', teacher: 'Mr. Rahul Kumar', students: 28, subject: 'Science' },
    { id: 3, name: '7A', teacher: 'Ms. Anjali Patel', students: 32, subject: 'English' },
    { id: 4, name: '7B', teacher: 'Ms. Priya Sharma', students: 29, subject: 'Mathematics' },
    { id: 5, name: '8A', teacher: 'Mr. Rahul Kumar', students: 31, subject: 'Science' },
    { id: 6, name: '8B', teacher: 'Ms. Anjali Patel', students: 27, subject: 'English' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Classroom Management</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage classrooms and assignments</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Add Classroom
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {classrooms.map(classroom => (
          <div key={classroom.id} className="rounded-2xl p-6 shadow-lg" style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border-primary)',
            borderWidth: '1px'
          }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Class {classroom.name}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{classroom.subject}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <Users size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{classroom.students}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <User size={18} style={{ color: 'var(--color-text-secondary)' }} />
              <span style={{ color: 'var(--color-text-primary)' }}>{classroom.teacher}</span>
            </div>

            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Students
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
