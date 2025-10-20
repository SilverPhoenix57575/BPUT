import { useState } from 'react'
import { BookOpen, Library, Compass, Plus } from 'lucide-react'
import MyNotebook from './MyNotebook'
import SharedLibrary from './SharedLibrary'
import LearningCompass from './LearningCompass'
import ContentImporter from './ContentImporter'
import useNotebookStore from '../../stores/notebookStore'

export default function KnowledgeHub() {
  const [activeTab, setActiveTab] = useState('notebook')
  const [showImporter, setShowImporter] = useState(false)
  const { addToNotebook, addToLibrary } = useNotebookStore()

  const handleSaveContent = (smartNote) => {
    if (smartNote.destination === 'notebook') {
      addToNotebook(smartNote)
    } else {
      addToLibrary(smartNote)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Knowledge Hub
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Your active, growing space for learning and collaboration
          </p>
        </div>
        <button
          onClick={() => setShowImporter(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
        >
          <Plus size={20} />
          Add New
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
        <TabButton icon={BookOpen} label="My Notebook" active={activeTab === 'notebook'} onClick={() => setActiveTab('notebook')} />
        <TabButton icon={Library} label="Shared Library" active={activeTab === 'library'} onClick={() => setActiveTab('library')} />
        <TabButton icon={Compass} label="Learning Compass" active={activeTab === 'compass'} onClick={() => setActiveTab('compass')} />
      </div>

      <div>
        {activeTab === 'notebook' && <MyNotebook />}
        {activeTab === 'library' && <SharedLibrary onAddNew={() => setShowImporter(true)} />}
        {activeTab === 'compass' && <LearningCompass />}
      </div>

      {showImporter && (
        <ContentImporter
          onClose={() => setShowImporter(false)}
          onSave={handleSaveContent}
        />
      )}
    </div>
  )
}

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-6 py-3 font-medium transition-all" style={{
      color: active ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)',
      borderBottom: active ? '3px solid var(--color-accent-blue)' : '3px solid transparent'
    }}>
      <Icon size={20} />
      {label}
    </button>
  )
}
