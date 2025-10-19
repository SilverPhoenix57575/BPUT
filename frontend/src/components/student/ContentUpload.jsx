import { useState } from 'react'
import { Upload, FileText, Image, Youtube, CheckCircle } from 'lucide-react'
import { contentAPI } from '../../services/api'
import offlineStorage from '../../services/pouchdb'
import useContentStore from '../../stores/contentStore'

export default function ContentUpload() {
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const addContent = useContentStore(state => state.addContent)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setSuccess(false)

    try {
      const content = {
        id: 'content_' + Date.now(),
        filename: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'doc',
        size: file.size,
        timestamp: new Date().toISOString()
      }
      
      await offlineStorage.saveContent(content)
      addContent(content)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Upload Learning Content
        </h2>
        <p className="text-gray-600">Upload PDFs, documents, images, or YouTube links to start learning</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-blue-500 hover:shadow-xl transition-all mb-8">
        <Upload className="mx-auto mb-4 text-blue-600" size={64} />
        <h3 className="text-xl font-bold mb-2">Drop your files here</h3>
        <p className="text-gray-600 mb-6">or click to browse from your device</p>
        
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
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all font-semibold"
        >
          {uploading ? 'Uploading...' : 'Select File'}
        </label>

        {success && (
          <div className="mt-4 inline-flex items-center gap-2 text-green-600 font-semibold">
            <CheckCircle size={20} />
            <span>File uploaded successfully!</span>
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
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all">
      <div className={`bg-gradient-to-br ${gradient} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="text-white" size={28} />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}
