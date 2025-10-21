import { useState } from 'react'
import { Save, Search, Tag, Trash2, Code, FileText, Eye, Sparkles } from 'lucide-react'
import useNotebookStore from '../../stores/notebookStore'
import SmartNoteViewer from './SmartNoteViewer'
import AINotesGenerator from './AINotesGenerator'

export default function MyNotebook() {
  const { notebookItems, removeFromNotebook, addToNotebook } = useNotebookStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [showAIGenerator, setShowAIGenerator] = useState(false)

  const filteredItems = notebookItems.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div>
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowAIGenerator(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
        >
          <Sparkles size={18} />
          Generate AI Notes
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your saved notes and code..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border-primary)',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="rounded-lg p-4 shadow hover:shadow-md transition-all" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-primary)',
              borderWidth: '1px'
            }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-blue-100">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.summary}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                    <span className="text-xs ml-auto" style={{ color: 'var(--color-text-tertiary)' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setSelectedNote(item)} className="p-2 hover:bg-blue-100 rounded" title="View">
                    <Eye size={18} className="text-blue-600" />
                  </button>
                  <button onClick={() => removeFromNotebook(item.id)} className="p-2 hover:bg-red-100 rounded" title="Delete">
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            <Save className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>No saved items yet</p>
            <p style={{ color: 'var(--color-text-secondary)' }}>Click "Add to Notebook" in your chats to save important content</p>
          </div>
        )}
      </div>

      {selectedNote && (
        <SmartNoteViewer
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}

      {showAIGenerator && (
        <AINotesGenerator
          onClose={() => setShowAIGenerator(false)}
          onSave={(note) => {
            addToNotebook(note)
            setShowAIGenerator(false)
          }}
        />
      )}
    </div>
  )
}
