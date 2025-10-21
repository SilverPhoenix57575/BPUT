import { Plus, Mail } from 'lucide-react'

export default function TeacherManagement() {
  const teachers = [
    { id: 1, name: 'Ms. Priya Sharma', email: 'priya@school.com', subject: 'Mathematics', classes: 4 },
    { id: 2, name: 'Mr. Rahul Kumar', email: 'rahul@school.com', subject: 'Science', classes: 3 },
    { id: 3, name: 'Ms. Anjali Patel', email: 'anjali@school.com', subject: 'English', classes: 5 }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Teacher Management</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage teaching staff</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Add Teacher
        </button>
      </div>

      <div className="rounded-2xl shadow-lg overflow-hidden" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            <tr>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Name</th>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Email</th>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Subject</th>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Classes</th>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
              <tr key={teacher.id} className="border-t" style={{ borderColor: 'var(--color-border-primary)' }}>
                <td className="px-6 py-4" style={{ color: 'var(--color-text-primary)' }}>{teacher.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <Mail size={16} />
                    {teacher.email}
                  </div>
                </td>
                <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{teacher.subject}</td>
                <td className="px-6 py-4" style={{ color: 'var(--color-text-primary)' }}>{teacher.classes}</td>
                <td className="px-6 py-4">
                  <button className="text-red-600 hover:underline">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
