import { useState } from 'react'
import { FileText, Image as ImageIcon, Youtube, X, Eye, Trash2, BookOpen, Search } from 'lucide-react'
import useContentStore from '../../stores/contentStore'

export default function NotebookWorkspace() {
  const { contents, currentContent, setCurrentContent, removeContent } = useContentStore()
  const [activeTab, setActiveTab] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredContents = contents.filter(c => 
    c.filename?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getIcon = (type) => {
    if (type === 'youtube' || type?.includes('youtube')) return <Youtube size={20} className="text-red-600" />
    if (type?.includes('image') || type === 'image') return <ImageIcon size={20} className="text-green-600" />
    return <FileText size={20} className="text-blue-600" />
  }

  const handleView = (content) => {
    setActiveTab(content.id)
    setCurrentContent(content)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this source?')) {
      removeContent(id)
      if (activeTab === id) setActiveTab(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Notebook Workspace
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Organize and view all your learning sources</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Source List */}
        <div className="md:col-span-1 rounded-lg shadow p-4" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Sources</h3>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sources..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  color: 'var(--color-text-primary)'
                }}
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredContents.length > 0 ? (
              filteredContents.map(content => (
                <div
                  key={content.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    activeTab === content.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  style={{
                    backgroundColor: activeTab === content.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--color-bg-secondary)',
                    borderColor: activeTab === content.id ? 'var(--color-accent-blue)' : 'var(--color-border-primary)'
                  }}
                >
                  <div className="flex items-start gap-2">
                    {getIcon(content.content_type || content.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                        {content.filename}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                        {new Date(content.created_at || content.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleView(content)}
                        className="p-1 hover:bg-blue-100 rounded"
                        title="View"
                      >
                        <Eye size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="p-1 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto mb-4 text-gray-300" size={48} />
                <p style={{ color: 'var(--color-text-secondary)' }}>No sources yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Source Viewer */}
        <div className="md:col-span-2 rounded-lg shadow p-6" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          {activeTab && currentContent ? (
            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{
                borderColor: 'var(--color-border-primary)'
              }}>
                <div className="flex items-center gap-3">
                  {getIcon(currentContent.content_type || currentContent.type)}
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {currentContent.filename}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {currentContent.content_type || currentContent.type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[600px] overflow-y-auto rounded-lg p-4" style={{
                backgroundColor: 'var(--color-bg-secondary)'
              }}>
                {currentContent.extracted_text ? (
                  <div className="prose max-w-none" style={{ color: 'var(--color-text-primary)' }}>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {currentContent.extracted_text}
                    </pre>
                  </div>
                ) : currentContent.file_url ? (
                  <div className="text-center">
                    <a
                      href={currentContent.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Original File
                    </a>
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-secondary)' }}>No preview available</p>
                )}
              </div>

              {/* Citations */}
              {currentContent.citations && currentContent.citations.length > 0 && (
                <div className="mt-4 p-4 rounded-lg" style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-border-primary)',
                  borderWidth: '1px'
                }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    📚 Citations
                  </h4>
                  <div className="space-y-2">
                    {currentContent.citations.map((citation, idx) => (
                      <div key={idx} className="text-sm p-2 rounded" style={{
                        backgroundColor: 'var(--color-bg-primary)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        <span className="font-medium">[{idx + 1}]</span> {citation.text || citation.source}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <Eye className="mx-auto mb-4 text-gray-300" size={64} />
                <p className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  No Source Selected
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Select a source from the list to view its contents
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
