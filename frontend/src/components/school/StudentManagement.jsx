import { useState } from 'react'
import { Plus, Upload, Search, Mail } from 'lucide-react'

export default function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterClass, setFilterClass] = useState('all')

  const students = [
    { id: 1, name: 'Aisha Khan', email: 'aisha@student.com', class: '10A', rollNo: '101', status: 'Active' },
    { id: 2, name: 'Rahul Sharma', email: 'rahul@student.com', class: '10A', rollNo: '102', status: 'Active' },
    { id: 3, name: 'Priya Patel', email: 'priya@student.com', class: '10B', rollNo: '103', status: 'Active' },
    { id: 4, name: 'Arjun Singh', email: 'arjun@student.com', class: '9A', rollNo: '104', status: 'Active' },
    { id: 5, name: 'Sneha Reddy', email: 'sneha@student.com', class: '9B', rollNo: '105', status: 'Active' }
  ]

  const filteredStudents = students.filter(s => 
    (filterClass === 'all' || s.class === filterClass) &&
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Student Management</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage student accounts and enrollment</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Upload size={20} />
            Batch Import CSV
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={20} />
            Add Student
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name or email..."
            className="w-full pl-11 pr-4 py-3 rounded-xl"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-primary)',
              borderWidth: '1px',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-4 py-3 rounded-xl"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border-primary)',
            borderWidth: '1px',
            color: 'var(--color-text-primary)'
          }}
        >
          <option value="all">All Classes</option>
          <option value="10A">Class 10A</option>
          <option value="10B">Class 10B</option>
          <option value="9A">Class 9A</option>
          <option value="9B">Class 9B</option>
        </select>
      </div>

      <div className="rounded-2xl shadow-lg overflow-hidden" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            <tr>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Roll No</th>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Name</th>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Email</th>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Class</th>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Status</th>
              <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--color-text-primary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id} className="border-t" style={{ borderColor: 'var(--color-border-primary)' }}>
                <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{student.rollNo}</td>
                <td className="px-6 py-4 font-medium" style={{ color: 'var(--color-text-primary)' }}>{student.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <Mail size={16} />
                    {student.email}
                  </div>
                </td>
                <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{student.class}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:underline mr-3">View</button>
                  <button className="text-red-600 hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
