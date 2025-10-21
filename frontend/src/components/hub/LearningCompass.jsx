import { useState } from 'react'
import { Compass, CheckCircle, Circle, BookOpen, Target } from 'lucide-react'

export default function LearningCompass() {
  const [mode, setMode] = useState('roadmap')
  const [roadmap] = useState({
    title: 'Learn React',
    progress: 25,
    steps: [
      { id: 1, title: 'JavaScript Fundamentals', completed: true, resources: 2 },
      { id: 2, title: 'Learn State & Props', completed: false, resources: 3, current: true },
      { id: 3, title: 'Component Lifecycle', completed: false, resources: 2 },
      { id: 4, title: 'Hooks (useState, useEffect)', completed: false, resources: 4 },
      { id: 5, title: 'Context API', completed: false, resources: 2 }
    ]
  })

  return (
    <div>
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('roadmap')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${mode === 'roadmap' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          style={mode !== 'roadmap' ? { color: 'var(--color-text-secondary)' } : {}}
        >
          <Target className="inline mr-2" size={18} />
          Roadmap Mode
        </button>
        <button
          onClick={() => setMode('explore')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${mode === 'explore' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          style={mode !== 'explore' ? { color: 'var(--color-text-secondary)' } : {}}
        >
          <Compass className="inline mr-2" size={18} />
          Explore Mode
        </button>
      </div>

      {mode === 'roadmap' ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Roadmap Sidebar */}
          <div className="md:col-span-1">
            <div className="rounded-lg p-4 shadow" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-primary)',
              borderWidth: '1px'
            }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{roadmap.title}</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <span>Progress</span>
                  <span>{roadmap.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${roadmap.progress}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                {roadmap.steps.map(step => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${step.current ? 'bg-blue-50 border-2 border-blue-500' : ''}`}
                    style={{
                      backgroundColor: step.current ? 'rgba(59, 130, 246, 0.1)' : 'var(--color-bg-secondary)',
                      borderColor: step.current ? 'var(--color-accent-blue)' : 'transparent'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {step.completed ? (
                        <CheckCircle size={20} className="text-green-600" />
                      ) : (
                        <Circle size={20} className="text-gray-400" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{step.title}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{step.resources} resources</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resources Panel */}
          <div className="md:col-span-2">
            <div className="rounded-lg p-6 shadow" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-primary)',
              borderWidth: '1px'
            }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Learn State & Props
              </h3>
              <div className="space-y-3">
                <ResourceCard title="State vs. Props Explained" type="Note" author="Educator" />
                <ResourceCard title="Stateful Component Example" type="Snippet" author="Educator" />
                <ResourceCard title="My thoughts on 'props'" type="Note" author="Student" />
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">💡 AI Suggestion</p>
                <p className="text-sm text-blue-800">You might also be interested in "Redux for State Management" from the library</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg p-6 shadow text-center" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <BookOpen className="mx-auto mb-4 text-gray-300" size={64} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Explore Mode</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Browse the Shared Library freely without following a roadmap</p>
        </div>
      )}
    </div>
  )
}

function ResourceCard({ title, type, author }) {
  return (
    <div className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer" style={{
      backgroundColor: 'var(--color-bg-secondary)',
      borderColor: 'var(--color-border-primary)'
    }}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{title}</h4>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>By {author}</p>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{type}</span>
      </div>
    </div>
  )
}
