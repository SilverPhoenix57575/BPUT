import { useState, useEffect } from 'react'
import { Brain, Plus, Trash2, Save, Sparkles, List, X, Network, LayoutGrid } from 'lucide-react'
import axios from 'axios'
import useUserStore from '../../stores/userStore'
import { KnowledgeGraph } from './graph/KnowledgeGraph'
import { useGraphStore } from '../../stores/graphStore'
import { MermaidBlock } from './diagrams/MermaidBlock'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function MindMapCreator() {
  const { user } = useUserStore()
  const { setNodes, setEdges } = useGraphStore()
  const [topic, setTopic] = useState('')
  const [generating, setGenerating] = useState(false)
  const [mindmap, setMindmap] = useState(null)
  const [savedMaps, setSavedMaps] = useState([])
  const [showList, setShowList] = useState(false)
  const [viewMode, setViewMode] = useState('tree')

  useEffect(() => {
    if (user) loadSavedMaps()
  }, [user])

  const loadSavedMaps = async () => {
    const userId = user?.data?.userId || user?.id || user?.email
    if (!userId) return
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/mindmap/list/${userId}`)
      if (data.success) setSavedMaps(data.data)
    } catch (error) {
      console.error('Failed to load mind maps:', error)
    }
  }

  const generateMindMap = async () => {
    const userId = user?.data?.userId || user?.id || user?.email
    if (!topic.trim() || !userId) return
    
    setGenerating(true)
    try {
      const { data } = await axios.post(`${API_URL}/api/v1/mindmap/generate`, {
        topic: topic.trim(),
        userId: userId
      }, { timeout: 30000 })
      
      if (data.success) {
        setMindmap(data.data)
        convertToGraphNodes(data.data)
        loadSavedMaps()
      } else {
        alert(data.error || 'Failed to generate mind map')
      }
    } catch (error) {
      console.error('Failed to generate mind map:', error)
      alert('Failed to generate mind map. Please check connection and try again.')
    } finally {
      setGenerating(false)
    }
  }

  const convertToGraphNodes = (mapData) => {
    if (!mapData?.data) return
    const nodes = []
    const edges = []
    
    nodes.push({ id: 'central', label: mapData.data.central, position: { x: 400, y: 50 }, mastered: false, data: {} })
    
    mapData.data.branches?.forEach((branch, idx) => {
      const angle = (idx * 2 * Math.PI) / mapData.data.branches.length
      const radius = 250
      const branchId = `branch-${branch.id}`
      
      nodes.push({
        id: branchId,
        label: branch.label,
        position: { x: 400 + radius * Math.cos(angle), y: 200 + radius * Math.sin(angle) },
        mastered: false,
        data: { description: branch.label }
      })
      edges.push({ id: `edge-central-${branchId}`, source: 'central', target: branchId })
      
      branch.children?.forEach((child, childIdx) => {
        const childId = `child-${child.id}`
        const childAngle = angle + (childIdx - branch.children.length / 2) * 0.3
        const childRadius = radius + 150
        
        nodes.push({
          id: childId,
          label: child.label,
          position: { x: 400 + childRadius * Math.cos(childAngle), y: 200 + childRadius * Math.sin(childAngle) },
          mastered: false,
          data: {}
        })
        edges.push({ id: `edge-${branchId}-${childId}`, source: branchId, target: childId })
      })
    })
    
    setNodes(nodes)
    setEdges(edges)
  }

  const loadMindMap = async (id) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/mindmap/${id}`)
      if (data.success) {
        setMindmap(data.data)
        setTopic(data.data.title)
        convertToGraphNodes(data.data)
        setShowList(false)
      }
    } catch (error) {
      console.error('Failed to load mind map:', error)
    }
  }

  const deleteMindMap = async (id) => {
    if (!confirm('Delete this mind map?')) return
    
    try {
      await axios.delete(`${API_URL}/api/v1/mindmap/${id}`)
      loadSavedMaps()
      if (mindmap?.id === id) setMindmap(null)
    } catch (error) {
      console.error('Failed to delete mind map:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="text-purple-600" size={32} />
          <h2 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Mind Map Creator
          </h2>
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Visualize concepts and their relationships with AI-powered mind maps
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="rounded-2xl p-6 shadow-lg mb-6" style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border-primary)',
            borderWidth: '1px'
          }}>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateMindMap()}
                placeholder="Enter a topic (e.g., Data Structures, Machine Learning)"
                className="flex-1 px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-primary)',
                  borderColor: 'var(--color-border-primary)',
                  borderWidth: '1px'
                }}
              />
              <button
                onClick={generateMindMap}
                disabled={generating || !topic.trim()}
                className="px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                style={{
                  backgroundColor: generating ? '#9ca3af' : '#8b5cf6',
                  color: 'white'
                }}
              >
                <Sparkles size={20} />
                {generating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          {mindmap && (
            <div className="rounded-2xl shadow-lg" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-primary)',
              borderWidth: '1px'
            }}>
              <div className="flex gap-2 p-4 border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
                <button onClick={() => setViewMode('tree')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${viewMode === 'tree' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`} style={viewMode !== 'tree' ? { color: 'var(--color-text-primary)' } : {}}>
                  <LayoutGrid size={18} /> Tree View
                </button>
                <button onClick={() => setViewMode('graph')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${viewMode === 'graph' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`} style={viewMode !== 'graph' ? { color: 'var(--color-text-primary)' } : {}}>
                  <Network size={18} /> Interactive Graph
                </button>
              </div>
              <div className="p-6">
                {viewMode === 'tree' ? <MindMapVisualization data={mindmap.data} /> : <div className="h-[600px]"><KnowledgeGraph /></div>}
              </div>
            </div>
          )}

          {!mindmap && !generating && (
            <div className="rounded-2xl p-12 text-center" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-primary)',
              borderWidth: '1px'
            }}>
              <Brain className="mx-auto mb-4 text-gray-300" size={64} />
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                Enter a topic and click Generate to create your mind map
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="rounded-2xl p-6 shadow-lg" style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border-primary)',
            borderWidth: '1px'
          }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Saved Mind Maps
              </h3>
              <List size={20} style={{ color: 'var(--color-text-secondary)' }} />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {savedMaps.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-secondary)' }}>
                  No saved mind maps yet
                </p>
              ) : (
                savedMaps.map((map) => (
                  <div
                    key={map.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:opacity-80 cursor-pointer"
                    style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                  >
                    <div className="flex-1" onClick={() => loadMindMap(map.id)}>
                      <p className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
                        {map.title}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                        {new Date(map.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteMindMap(map.id)
                      }}
                      className="p-1 hover:opacity-70"
                    >
                      <Trash2 size={16} style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MindMapVisualization({ data }) {
  if (!data?.central || !data?.branches) return null

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']

  return (
    <div className="relative">
      <div className="text-center mb-8">
        <div className="inline-block px-8 py-4 rounded-2xl text-xl font-bold shadow-lg"
          style={{ backgroundColor: '#8b5cf6', color: 'white' }}>
          {data.central}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {data.branches.map((branch, idx) => (
          <div key={branch.id} className="rounded-xl p-4" style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderLeftWidth: '4px',
            borderColor: colors[idx % colors.length]
          }}>
            <div className="font-bold mb-3 text-lg" style={{ color: colors[idx % colors.length] }}>
              {branch.label}
            </div>
            <div className="space-y-2 ml-4">
              {branch.children?.map((child) => (
                <div key={child.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                  <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    {child.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
