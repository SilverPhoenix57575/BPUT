import { useState } from 'react'
import { Upload, FileText, Image, Youtube, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { contentAPI } from '../../services/api'
import storage from '../../services/pouchdb'
import useContentStore from '../../stores/contentStore'
import useUserStore from '../../stores/userStore'

export default function ContentUpload() {
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [uploadedContent, setUploadedContent] = useState(null)
  const addContent = useContentStore(state => state.addContent)
  const user = useUserStore(state => state.user)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setSuccess(false)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', user?.id || 'user_123')

    try {
      // Try backend first
      const response = await contentAPI.upload(formData)
      const content = response.data
      
      // Save to localStorage as backup
      storage.saveContent(content)
      addContent(content)
      setUploadedContent(content)
      setSuccess(true)
    } catch (err) {
      console.error('Backend upload failed, saving locally:', err)
      
      // Fallback to localStorage if backend fails
      const content = {
        id: 'content_' + Date.now(),
        filename: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'doc',
        size: file.size,
        timestamp: new Date().toISOString()
      }
      
      storage.saveContent(content)
      addContent(content)
      setUploadedContent(content)
      setSuccess(true)
      setError('Saved locally (backend unavailable)')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Upload Learning Content
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Upload PDFs, documents, images, or YouTube links to start learning</p>
      </div>
      
      <div className="rounded-2xl shadow-lg border-2 border-dashed p-12 text-center hover:border-blue-500 hover:shadow-xl transition-all mb-8" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)'
      }}>
        <Upload className="mx-auto mb-4 text-blue-600" size={64} />
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Drop your files here</h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>or click to browse from your device</p>
        
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,image/*"
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all font-semibold ${uploading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {uploading && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {uploading ? 'Uploading...' : 'Select File'}
        </label>

        {success && (
          <div className="mt-4 inline-flex items-center gap-2 text-green-600 font-semibold">
            <CheckCircle size={20} />
            <span>File uploaded successfully!</span>
          </div>
        )}

        {error && (
          <div className="mt-4 inline-flex items-center gap-2 text-yellow-600 font-semibold">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <FormatCard
          icon={FileText}
          title="PDF & Documents"
          description="Upload lecture notes, textbooks, research papers"
          gradient="from-blue-500 to-cyan-500"
        />
        <FormatCard
          icon={Image}
          title="Images (OCR)"
          description="Extract text from handwritten notes and diagrams"
          gradient="from-green-500 to-emerald-500"
        />
        <FormatCard
          icon={Youtube}
          title="YouTube Links"
          description="Learn from video lectures with AI transcripts"
          gradient="from-red-500 to-pink-500"
        />
      </div>
    </div>
  )
}

function FormatCard({ icon: Icon, title, description, gradient }) {
  return (
    <div className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className={`bg-gradient-to-br ${gradient} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="text-white" size={28} />
      </div>
      <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
    </div>
  )
}
