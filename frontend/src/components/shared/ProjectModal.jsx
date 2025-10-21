import { useState } from 'react'
import { X, Settings } from 'lucide-react'

const SUGGESTED_TAGS = [
  { name: 'Investing', icon: '💰' },
  { name: 'Homework', icon: '📚' },
  { name: 'Research', icon: '🔬' },
  { name: 'Coding', icon: '💻' },
  { name: 'Writing', icon: '✍️' },
  { name: 'Learning', icon: '🎓' },
  { name: 'Business', icon: '💼' },
  { name: 'Health', icon: '🏥' }
]

export default function ProjectModal({ onClose, onCreate }) {
  const [projectName, setProjectName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('📁')

  const handleTagClick = (tag) => {
    setProjectName(tag.name)
    setSelectedIcon(tag.icon)
  }

  const handleCreate = () => {
    if (projectName.trim()) {
      onCreate({ name: projectName, icon: selectedIcon })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-2xl p-6 w-full max-w-md" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Project name</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg transition-all" style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <Settings size={20} />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg transition-all" style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selectedIcon}</span>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                color: 'var(--color-text-primary)'
              }}
              autoFocus
            />
          </div>

          <div className="mb-4">
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>Suggested tags:</p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {SUGGESTED_TAGS.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => handleTagClick(tag)}
                  className="px-4 py-2 rounded-lg border transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    color: 'var(--color-text-primary)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-blue)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border-primary)'}
                >
                  <span>{tag.icon}</span>
                  <span>{tag.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={!projectName.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create project
        </button>
      </div>
    </div>
  )
}
