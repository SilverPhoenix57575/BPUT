import { useState } from 'react'
import { Compass, CheckCircle, Circle, BookOpen, Target, Upload, Layers } from 'lucide-react'
import SyllabusAnalyzer from './SyllabusAnalyzer'
import SmartFlashcards from './SmartFlashcards'

export default function LearningCompass() {
  const [mode, setMode] = useState('roadmap')
  const [showSyllabusUpload, setShowSyllabusUpload] = useState(false)
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [roadmap, setRoadmap] = useState({
    title: 'Learn React',
    progress: 25,
    modules: [
      { 
        id: 1, 
        moduleNumber: '1', 
        title: 'React Basics', 
        topics: [
          { id: '1-1', title: 'JavaScript Fundamentals', completed: true },
          { id: '1-2', title: 'Learn State & Props', completed: false }
        ],
        completed: false,
        expanded: true
      },
      { 
        id: 2, 
        moduleNumber: '2', 
        title: 'Advanced Concepts', 
        topics: [
          { id: '2-1', title: 'Component Lifecycle', completed: false },
          { id: '2-2', title: 'Hooks (useState, useEffect)', completed: false },
          { id: '2-3', title: 'Context API', completed: false }
        ],
        completed: false,
        expanded: false
      }
    ]
  })
  
  const toggleModule = (moduleId) => {
    setRoadmap(prev => ({
      ...prev,
      modules: prev.modules.map(m => 
        m.id === moduleId ? { ...m, expanded: !m.expanded } : m
      )
    }))
  }

  return (
    <div>
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setShowSyllabusUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold ml-auto"
        >
          <Upload size={18} />
          Upload Syllabus
        </button>
      </div>

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

              <div className="space-y-3">
                {roadmap.modules?.map(module => (
                  <div key={module.id}>
                    <div
                      onClick={() => toggleModule(module.id)}
                      className="p-3 rounded-lg cursor-pointer transition-all border"
                      style={{ 
                        borderColor: 'var(--color-border-primary)',
                        backgroundColor: 'var(--color-bg-secondary)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {module.completed ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : (
                          <Circle size={20} className="text-blue-600" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                            Module {module.moduleNumber}: {module.title.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                            {module.topics?.length || 0} topics
                          </p>
                        </div>
                        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          {module.expanded ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                    
                    {module.expanded && (
                      <div className="ml-6 mt-2 space-y-1">
                        {module.topics?.map(topic => (
                          <div
                            key={topic.id}
                            className="p-2 rounded-lg transition-all group"
                            style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
                          >
                            <div className="flex items-center gap-2">
                              {topic.completed ? (
                                <CheckCircle size={16} className="text-green-600" />
                              ) : (
                                <Circle size={16} className="text-gray-400" />
                              )}
                              <p className="text-xs flex-1" style={{ color: 'var(--color-text-primary)' }}>
                                {topic.title.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')}
                              </p>
                              <button
                                onClick={() => {
                                  setSelectedTopic(topic.title.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'))
                                  setShowFlashcards(true)
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-blue-100 transition-all"
                                title="Generate Flashcards"
                              >
                                <Layers size={14} className="text-blue-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                Select a topic to view resources
              </h3>
              <div className="text-center py-12">
                <BookOpen className="mx-auto mb-4 text-gray-300" size={64} />
                <p style={{ color: 'var(--color-text-secondary)' }}>Click on a topic from the roadmap to see learning resources</p>
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

      {showSyllabusUpload && (
        <SyllabusAnalyzer
          onClose={() => setShowSyllabusUpload(false)}
          onAnalyzed={(analyzedRoadmap) => {
            setRoadmap(analyzedRoadmap)
            setMode('roadmap')
          }}
        />
      )}

      {showFlashcards && selectedTopic && (
        <SmartFlashcards
          topic={selectedTopic}
          onClose={() => {
            setShowFlashcards(false)
            setSelectedTopic(null)
          }}
        />
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
