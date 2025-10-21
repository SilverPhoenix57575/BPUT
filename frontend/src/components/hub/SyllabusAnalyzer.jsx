import { useState } from 'react'
import { X, Upload, Sparkles, FileText, Image as ImageIcon, CheckCircle } from 'lucide-react'
import { aiAPI, contentAPI } from '../../services/api'
import useUserStore from '../../stores/userStore'

export default function SyllabusAnalyzer({ onClose, onAnalyzed }) {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadType, setUploadType] = useState('file')
  const user = useUserStore(state => state.user)

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return
    setFile(uploadedFile)
  }

  const handleAnalyze = async () => {
    if (!file && !text.trim()) return

    setAnalyzing(true)

    try {
      let syllabusContent = text

      // Extract text from file if uploaded
      if (file) {
        try {
          if (file.type.includes('text') || file.name.endsWith('.txt')) {
            syllabusContent = await file.text()
          } else if (file.type.includes('image')) {
            // For images, use backend OCR
            const formData = new FormData()
            formData.append('file', file)
            formData.append('userId', user?.id || 'user_123')
            const response = await contentAPI.upload(formData)
            syllabusContent = response.data.extracted_text || 'Image uploaded'
          }
        } catch (err) {
          console.error('File extraction error:', err)
        }
      }

      // Analyze syllabus with AI
      const prompt = `You are a learning path expert. Analyze this syllabus and organize it by modules/units.

Extract the module structure and topics. Format as:

MODULE 1: [Module Name]
Topics:
- Topic 1
- Topic 2

MODULE 2: [Module Name]
Topics:
- Topic 1
- Topic 2

Syllabus content:
${syllabusContent}

Keep module names short and list all topics under each module.`

      const response = await aiAPI.question({
        question: prompt,
        contentId: 'syllabus-analyzer',
        userId: user?.id || 'user_123',
        chatHistory: []
      })

      // Decode HTML entities
      const decodeHtmlEntities = (text) => {
        const entities = {
          '&quot;': '"',
          '&#34;': '"',
          '&apos;': "'",
          '&#39;': "'",
          '&lt;': '<',
          '&#60;': '<',
          '&gt;': '>',
          '&#62;': '>',
          '&amp;': '&',
          '&#38;': '&'
        }
        let decoded = text
        for (const [entity, char] of Object.entries(entities)) {
          decoded = decoded.split(entity).join(char)
        }
        return decoded
      }

      const analysis = decodeHtmlEntities(response.data.answer)

      // Parse modules and topics from AI response
      const lines = analysis.split('\n').filter(l => l.trim())
      const modules = []
      let currentModule = null

      lines.forEach((line) => {
        // Detect module headers
        const moduleMatch = line.match(/^MODULE\s+(\d+|[IVX]+)\s*:?\s*(.+)/i)
        if (moduleMatch) {
          const [, num, name] = moduleMatch
          currentModule = {
            id: modules.length + 1,
            moduleNumber: num,
            title: name.trim(),
            topics: [],
            completed: false,
            expanded: modules.length === 0
          }
          modules.push(currentModule)
        }
        // Detect topics under current module
        else if (currentModule && /^[-*•]\s+/.test(line)) {
          const topic = line.replace(/^[-*•]\s+/, '').trim()
          if (topic.length > 3 && !topic.toLowerCase().includes('topics:')) {
            currentModule.topics.push({
              id: `${currentModule.id}-${currentModule.topics.length + 1}`,
              title: topic,
              completed: false
            })
          }
        }
      })

      // Fallback: parse from original content if AI didn't structure properly
      if (modules.length === 0) {
        const moduleRegex = /Module\s+(\d+|[IVX]+)\s*:?\s*([^:]+):/gi
        let match
        let lastIndex = 0
        
        while ((match = moduleRegex.exec(syllabusContent)) !== null) {
          const [fullMatch, num, name] = match
          const moduleContent = syllabusContent.substring(lastIndex, match.index + 500)
          
          const topics = moduleContent
            .split(/[,;]|\.|\n/)
            .map(t => t.trim())
            .filter(t => t.length > 10 && t.length < 100)
            .slice(0, 8)
            .map((topic, idx) => ({
              id: `${modules.length + 1}-${idx + 1}`,
              title: topic,
              completed: false
            }))
          
          modules.push({
            id: modules.length + 1,
            moduleNumber: num,
            title: name.trim(),
            topics: topics,
            completed: false,
            expanded: modules.length === 0
          })
          
          lastIndex = match.index
        }
      }

      // Create roadmap
      const roadmap = {
        title: file?.name.replace(/\.[^/.]+$/, '') || 'My Learning Path',
        progress: 0,
        modules: modules.length > 0 ? modules : [
          { 
            id: 1, 
            moduleNumber: '1', 
            title: 'Introduction', 
            topics: [
              { id: '1-1', title: 'Getting Started', completed: false },
              { id: '1-2', title: 'Basic Concepts', completed: false }
            ],
            completed: false,
            expanded: true
          }
        ],
        fullAnalysis: analysis,
        syllabusContent: syllabusContent
      }

      console.log('Created roadmap with', roadmap.modules.length, 'modules:', roadmap.modules)

      onAnalyzed(roadmap)
      onClose()
    } catch (err) {
      console.error('Analysis error:', err)
      // Fallback: create basic roadmap
      onAnalyzed({
        title: file?.name.replace(/\.[^/.]+$/, '') || 'My Learning Path',
        progress: 0,
        modules: [
          { 
            id: 1, 
            moduleNumber: '1', 
            title: 'Introduction', 
            topics: [
              { id: '1-1', title: 'Getting Started', completed: false }
            ],
            completed: false,
            expanded: true
          }
        ],
        fullAnalysis: 'Syllabus uploaded successfully',
        syllabusContent: syllabusContent
      })
      onClose()
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="rounded-2xl shadow-2xl max-w-lg w-full mx-4" style={{
        backgroundColor: 'var(--color-bg-primary)'
      }} onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-600" size={24} />
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                AI Syllabus Analyzer
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setUploadType('file')}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${uploadType === 'file' ? 'border-blue-500 bg-blue-50' : ''}`}
                style={{
                  borderColor: uploadType === 'file' ? 'var(--color-accent-blue)' : 'var(--color-border-primary)',
                  backgroundColor: uploadType === 'file' ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                }}
              >
                <Upload className="mx-auto mb-1 text-blue-600" size={20} />
                <p className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>Upload File</p>
              </button>
              <button
                onClick={() => setUploadType('text')}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${uploadType === 'text' ? 'border-blue-500 bg-blue-50' : ''}`}
                style={{
                  borderColor: uploadType === 'text' ? 'var(--color-accent-blue)' : 'var(--color-border-primary)',
                  backgroundColor: uploadType === 'text' ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                }}
              >
                <FileText className="mx-auto mb-1 text-blue-600" size={20} />
                <p className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>Paste Text</p>
              </button>
            </div>

            {uploadType === 'file' ? (
              <div>
                <label className="block cursor-pointer">
                  <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,.txt,image/*" />
                  <div className="p-6 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center" style={{
                    borderColor: 'var(--color-border-primary)'
                  }}>
                    {file ? (
                      <>
                        <CheckCircle className="mx-auto mb-2 text-green-600" size={40} />
                        <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{file.name}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Click to change</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto mb-2 text-blue-600" size={40} />
                        <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Upload Syllabus</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>PDF, DOC, TXT, or Image (JPG/PNG)</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Paste Syllabus Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  placeholder="Paste your syllabus content here..."
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    color: 'var(--color-text-primary)'
                  }}
                />
              </div>
            )}

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <strong>AI will extract:</strong> Topics, subtopics, difficulty levels, and create a personalized learning roadmap
              </p>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={(!file && !text.trim()) || analyzing}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="animate-pulse" size={20} />
                  Analyzing Syllabus...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={20} />
                  Analyze with AI
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
