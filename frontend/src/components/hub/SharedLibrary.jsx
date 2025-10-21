import { useState } from 'react'
import { Folder, FileText, Code, Link as LinkIcon, Plus, Search, MessageSquare, Eye } from 'lucide-react'
import useNotebookStore from '../../stores/notebookStore'
import SmartNoteViewer from './SmartNoteViewer'

export default function SharedLibrary({ onAddNew }) {
  const { libraryItems } = useNotebookStore()
  const [folders] = useState([
    { id: 1, name: 'Week 1: JavaScript Basics', items: 3 },
    { id: 2, name: 'Week 2: React Fundamentals', items: 5 },
    { id: 3, name: 'API Standards', items: 2 }
  ])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFolder = !selectedFolder || item.folderId === selectedFolder
    return matchesSearch && matchesFolder
  })

  const getIcon = (type) => {
    switch(type) {
      case 'snippet': return <Code size={20} className="text-blue-600" />
      case 'resource': return <LinkIcon size={20} className="text-green-600" />
      default: return <FileText size={20} className="text-purple-600" />
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Folders Sidebar */}
      <div className="md:col-span-1">
        <div className="rounded-lg p-4 shadow mb-4" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>Folders</h3>
            <button onClick={onAddNew} className="p-1 hover:bg-blue-100 rounded">
              <Plus size={18} className="text-blue-600" />
            </button>
          </div>
          <div className="space-y-2">
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full text-left p-3 rounded-lg transition-all ${selectedFolder === folder.id ? 'bg-blue-50' : ''}`}
                style={{
                  backgroundColor: selectedFolder === folder.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                }}
              >
                <div className="flex items-center gap-2">
                  <Folder size={18} className="text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{folder.name}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{folder.items} items</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Search */}
        <div className="rounded-lg p-4 shadow bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <MessageSquare className="mb-2" size={24} />
          <h4 className="font-bold mb-2">Ask the Library</h4>
          <p className="text-sm text-white/90 mb-3">AI-powered search across all content</p>
          <input
            type="text"
            placeholder="How does our team handle auth?"
            className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="md:col-span-2">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library content..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="rounded-lg p-4 shadow hover:shadow-md transition-all" style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border-primary)',
                borderWidth: '1px'
              }}>
                <div className="flex items-start gap-3">
                  <FileText size={20} className="text-purple-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Shared content</p>
                  </div>
                  <button onClick={() => setSelectedNote(item)} className="p-2 hover:bg-blue-100 rounded">
                    <Eye size={18} className="text-blue-600" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <FileText className="mx-auto mb-4 text-gray-300" size={64} />
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {selectedFolder ? 'No items in this folder' : 'No shared content yet'}
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-tertiary)' }}>Add content using the "Add New" button in Knowledge Hub</p>
            </div>
          )}
        </div>
      </div>

      {selectedNote && (
        <SmartNoteViewer
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </div>
  )
}
