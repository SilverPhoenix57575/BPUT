import { useState } from 'react'
import { Upload, FileText, Image, Youtube } from 'lucide-react'
import { contentAPI } from '../../services/api'
import offlineStorage from '../../services/pouchdb'
import useContentStore from '../../stores/contentStore'

export default function ContentUpload() {
  const [uploading, setUploading] = useState(false)
  const addContent = useContentStore(state => state.addContent)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', file.type.includes('pdf') ? 'pdf' : 'doc')
    formData.append('userId', 'user_123')

    try {
      const response = await contentAPI.upload(formData)
      const content = response.data
      await offlineStorage.saveContent(content)
      addContent(content)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Upload Learning Content</h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition">
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-lg mb-4">Drag and drop files here or click to browse</p>
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
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : 'Select File'}
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="p-4 border rounded-lg text-center">
          <FileText className="mx-auto mb-2 text-blue-600" size={32} />
          <p className="font-semibold">PDF & Documents</p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <Image className="mx-auto mb-2 text-green-600" size={32} />
          <p className="font-semibold">Images (OCR)</p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <Youtube className="mx-auto mb-2 text-red-600" size={32} />
          <p className="font-semibold">YouTube Links</p>
        </div>
      </div>
    </div>
  )
}
