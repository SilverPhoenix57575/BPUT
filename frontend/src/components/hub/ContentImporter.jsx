import { useState } from 'react'
import { Upload, Link as LinkIcon, FileText, X, Sparkles, Tag, Save, Library as LibraryIcon } from 'lucide-react'
import { contentAPI, aiAPI } from '../../services/api'
import useUserStore from '../../stores/userStore'
import { logStudySession } from '../../services/analytics'

export default function ContentImporter({ onClose, onSave }) {
  const [step, setStep] = useState('choose')
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const [processing, setProcessing] = useState(false)
  const [smartNote, setSmartNote] = useState(null)
  const user = useUserStore(state => state.user)

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setProcessing(true)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('userId', user?.id || 'user_123')

      // Always try to read text files directly first
      let extractedText = ''
      if (uploadedFile.type.includes('text') || uploadedFile.name.endsWith('.txt')) {
        try {
          extractedText = await uploadedFile.text()
          console.log('Read file directly:', extractedText.substring(0, 100))
        } catch (readErr) {
          console.error('Error reading file:', readErr)
        }
      }

      // Try backend upload
      let content = null
      try {
        const response = await contentAPI.upload(formData)
        content = response.data
        console.log('Backend response:', content)
        
        // Use backend extracted text if we don't have it yet
        if (!extractedText && content.extracted_text) {
          extractedText = content.extracted_text
        }
      } catch (uploadErr) {
        console.error('Backend upload failed:', uploadErr)
      }

      // Generate better summary and tags
      const fileType = uploadedFile.name.split('.').pop().toLowerCase()
      const autoTags = [fileType, 'uploaded']
      
      // Extract key points from text
      const sentences = extractedText.split(/[.!?\n]+/).filter(s => s.trim().length > 20)
      const keyTakeaways = sentences.slice(0, 5).map(s => s.trim()).filter(s => s)

      console.log('Extracted text length:', extractedText.length)
      console.log('Key takeaways:', keyTakeaways)

      setSmartNote({
        title: uploadedFile.name.replace(/\.[^/.]+$/, ''),
        summary: extractedText.substring(0, 300) || 'Document uploaded. Content extraction in progress...',
        tags: autoTags,
        keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : ['Document content available'],
        originalFile: uploadedFile.name,
        content: content,
        extractedText: extractedText,
        fullText: extractedText // Store full text for chat
      })
      setStep('review')
    } catch (err) {
      console.error('Upload failed:', err)
      // Try to read file directly as fallback
      let fallbackText = ''
      try {
        if (uploadedFile.type.includes('text')) {
          fallbackText = await uploadedFile.text()
        }
      } catch (readErr) {
        console.error('Could not read file:', readErr)
      }

      const sentences = fallbackText.split(/[.!?\n]+/).filter(s => s.trim().length > 20)
      const keyTakeaways = sentences.slice(0, 5).map(s => s.trim()).filter(s => s)

      setSmartNote({
        title: uploadedFile.name.replace(/\.[^/.]+$/, ''),
        summary: fallbackText.substring(0, 300) || 'Document uploaded. Backend processing unavailable but file content is accessible.',
        tags: ['uploaded', uploadedFile.name.split('.').pop().toLowerCase()],
        keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : ['File uploaded successfully', 'Content available for chat'],
        originalFile: uploadedFile.name,
        extractedText: fallbackText,
        fullText: fallbackText
      })
      setStep('review')
    } finally {
      setProcessing(false)
    }
  }

  const handleSave = (destination) => {
    onSave({ ...smartNote, destination })
    // Log note creation
    if (user) {
      logStudySession(user.id, 'note', smartNote.title, 60) // Assume 1 min for note creation
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" style={{
        backgroundColor: 'var(--color-bg-primary)'
      }} onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Add to Knowledge Hub
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>

          {step === 'choose' && (
            <div className="space-y-3">
              <label className="block cursor-pointer">
                <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,.txt,image/*" />
                <div className="p-4 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center" style={{
                  borderColor: 'var(--color-border-primary)'
                }}>
                  <Upload className="mx-auto mb-2 text-blue-600" size={32} />
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>Upload a File</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>PDF, DOC, Images, Audio</p>
                </div>
              </label>

              <div 
                onClick={() => setStep('url')}
                className="p-4 border-2 border-dashed rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center cursor-pointer" 
                style={{ borderColor: 'var(--color-border-primary)' }}
              >
                <LinkIcon className="mx-auto mb-2 text-green-600" size={32} />
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>Paste a URL</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>YouTube, Articles, Docs</p>
              </div>

              <div 
                onClick={() => setStep('note')}
                className="p-4 border-2 border-dashed rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center cursor-pointer" 
                style={{ borderColor: 'var(--color-border-primary)' }}
              >
                <FileText className="mx-auto mb-2 text-purple-600" size={32} />
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>Write a New Note</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Create from scratch</p>
              </div>
            </div>
          )}

          {processing && (
            <div className="text-center py-12">
              <Sparkles className="mx-auto mb-4 text-blue-600 animate-pulse" size={64} />
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>AI Processing...</p>
              <p style={{ color: 'var(--color-text-secondary)' }}>Generating summary and key takeaways</p>
            </div>
          )}

          {step === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Enter URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    color: 'var(--color-text-primary)'
                  }}
                />
              </div>
              <button
                onClick={() => {
                  setSmartNote({
                    title: `Content from URL`,
                    summary: 'AI will process this URL',
                    tags: ['url', 'imported'],
                    keyTakeaways: ['Processing...'],
                    originalFile: url
                  })
                  setStep('review')
                }}
                disabled={!url}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Process URL
              </button>
            </div>
          )}

          {step === 'note' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Note Title</label>
                <input
                  type="text"
                  placeholder="Enter title..."
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    color: 'var(--color-text-primary)'
                  }}
                  onChange={(e) => setSmartNote({...smartNote, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Content</label>
                <textarea
                  rows={8}
                  placeholder="Write your note..."
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    color: 'var(--color-text-primary)'
                  }}
                  onChange={(e) => setSmartNote({...smartNote, summary: e.target.value})}
                />
              </div>
              <button
                onClick={() => {
                  if (!smartNote?.title || !smartNote?.summary) {
                    setSmartNote({
                      title: 'New Note',
                      summary: 'Your note content',
                      tags: ['note', 'manual'],
                      keyTakeaways: ['Custom note'],
                      originalFile: 'manual'
                    })
                  }
                  setStep('review')
                }}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {step === 'review' && smartNote && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-blue-600" size={20} />
                  <span className="font-semibold text-blue-900">AI-Generated Smart Note</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Title</label>
                <input
                  type="text"
                  value={smartNote.title}
                  onChange={(e) => setSmartNote({...smartNote, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    color: 'var(--color-text-primary)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Summary</label>
                <textarea
                  value={smartNote.summary}
                  onChange={(e) => setSmartNote({...smartNote, summary: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    color: 'var(--color-text-primary)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Tags</label>
                <div className="flex gap-2 flex-wrap">
                  {smartNote.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Key Takeaways</label>
                <ul className="space-y-2">
                  {smartNote.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t" style={{ borderColor: 'var(--color-border-primary)' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Where would you like to save this?</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSave('notebook')}
                    className="p-4 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                    style={{ borderColor: 'var(--color-border-primary)' }}
                  >
                    <Save className="mx-auto mb-2 text-blue-600" size={32} />
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>My Notebook</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Private</p>
                  </button>
                  <button
                    onClick={() => handleSave('library')}
                    className="p-4 border-2 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all"
                    style={{ borderColor: 'var(--color-border-primary)' }}
                  >
                    <LibraryIcon className="mx-auto mb-2 text-green-600" size={32} />
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Shared Library</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Public</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
