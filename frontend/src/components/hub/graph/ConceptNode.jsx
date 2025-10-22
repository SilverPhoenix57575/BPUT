import { memo, useState } from 'react'
import { Handle, Position } from 'reactflow'
import { ChevronDown, ChevronRight, StickyNote, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '../../../utils/cn'

export const ConceptNode = memo(({ id, data, selected }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [noteText, setNoteText] = useState(data.notes || '')

  const handleSaveNotes = () => {
    data.onEditNotes?.(noteText)
    setShowNotesModal(false)
  }

  return (
    <>
      <div className={cn(
        'px-4 py-3 rounded-xl border-2 bg-white shadow-lg transition-all duration-200 min-w-[180px] max-w-[280px]',
        selected && 'ring-2 ring-purple-500 ring-offset-2',
        data.isNew && 'animate-pulse border-purple-500',
        data.mastered ? 'border-green-500 bg-green-50' : 'border-gray-300'
      )}>
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        
        <div className="flex items-start gap-2 mb-2">
          <button onClick={() => setIsExpanded(!isExpanded)} className="mt-1 p-0.5 hover:bg-gray-100 rounded">
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{data.label}</span>
              {data.mastered ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Circle className="h-4 w-4 text-gray-400" />}
            </div>
            {data.timestamp && <span className="text-xs text-gray-500">{new Date(data.timestamp).toLocaleDateString()}</span>}
          </div>

          <button onClick={() => setShowNotesModal(true)} className={cn('p-1 rounded hover:bg-gray-100', data.hasNotes && 'text-purple-600')} title={data.hasNotes ? 'View notes' : 'Add notes'}>
            <StickyNote className="h-4 w-4" />
          </button>
        </div>

        {isExpanded && data.description && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600 leading-relaxed">{data.description}</p>
          </div>
        )}

        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      </div>

      {showNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Notes: {data.label}</h3>
              <button onClick={() => setShowNotesModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>

            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add your personal notes here..." className="w-full h-40 p-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500" />

            <div className="flex gap-2 mt-4">
              <button onClick={handleSaveNotes} className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-medium">Save Notes</button>
              <button onClick={() => setShowNotesModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

ConceptNode.displayName = 'ConceptNode'
