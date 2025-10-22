import { useEffect, useMemo } from 'react'
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/base.css'
import { useGraphStore } from '../../../stores/graphStore'
import { Download, Lock, Unlock } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { ConceptNode } from './ConceptNode'

const nodeTypes = { concept: ConceptNode }

export const KnowledgeGraph = () => {
  const { nodes: storeNodes, edges: storeEdges, isLocked, updateNode, lockGraph, unlockGraph } = useGraphStore()

  const initialNodes = useMemo(
    () => storeNodes.map((n, idx) => ({
      id: n.id,
      type: 'concept',
      position: n.position || { x: 100 + (idx % 3) * 250, y: 100 + Math.floor(idx / 3) * 150 },
      data: {
        label: n.label,
        description: n.data?.description,
        mastered: n.mastered,
        isNew: n.data?.isNew,
        hasNotes: n.data?.hasNotes,
        notes: n.data?.notes,
        timestamp: n.data?.timestamp,
        onEditNotes: (notes) => updateNode(n.id, { data: { ...n.data, notes, hasNotes: !!notes } })
      }
    })),
    [storeNodes, updateNode]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(
    storeEdges.map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label, animated: true }))
  )

  useEffect(() => { setNodes(initialNodes) }, [initialNodes, setNodes])

  useEffect(() => {
    const newNodes = storeNodes.filter((n) => n.data?.isNew)
    if (newNodes.length > 0) {
      const timer = setTimeout(() => {
        newNodes.forEach((n) => updateNode(n.id, { data: { ...n.data, isNew: false } }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [storeNodes, updateNode])

  const handleExport = () => {
    const graphData = { nodes: storeNodes, edges: storeEdges, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(graphData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `knowledge-graph-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-2xl h-full flex flex-col overflow-hidden border shadow-lg" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)' }}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
        <h2 className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>Knowledge Graph</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => (isLocked ? unlockGraph() : lockGraph())} className={cn('p-2 rounded-lg bg-gray-100 hover:bg-gray-200', isLocked && 'bg-purple-100 text-purple-600')} title={isLocked ? 'Unlock to edit' : 'Lock positions'}>
            {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </button>
          <button onClick={handleExport} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200" title="Export as JSON">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative min-h-[500px]">
        {nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <p>Knowledge graph will appear as you create concepts...</p>
          </div>
        ) : (
          <ReactFlow nodes={nodes} edges={edges} onNodesChange={isLocked ? undefined : onNodesChange} onEdgesChange={isLocked ? undefined : onEdgesChange} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2 }} minZoom={0.5} maxZoom={2}>
            <Background gap={16} size={1} />
            <Controls />
            <MiniMap nodeColor={(node) => {
              const data = node.data
              if (data.isNew) return '#8b5cf6'
              if (data.mastered) return '#22c55e'
              return '#94a3b8'
            }} maskColor="rgba(0, 0, 0, 0.1)" />
          </ReactFlow>
        )}
      </div>
    </div>
  )
}
