import { useState } from 'react'
import { Send, BookOpen, MessageCircle, Sparkles, ChevronRight, ChevronLeft, Plus, Upload, FileText, Image as ImageIcon, Youtube, X, CheckCircle, AlertCircle } from 'lucide-react'
import { aiAPI, contentAPI } from '../../services/api'
import useUserStore from '../../stores/userStore'
import useContentStore from '../../stores/contentStore'
import storage from '../../services/pouchdb'
import MessageRenderer from './MessageRenderer'
import { CognitiveMonitor } from '../cognitive/CognitiveMonitor'
import { useTextFriction } from '../../hooks/useTextFriction'

export default function LearningInterface({ content }) {
  const [question, setQuestion] = useState('')
  useTextFriction(question)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI learning assistant. Ask me anything about your content!' }
  ])
  const [loading, setLoading] = useState(false)
  const [contentExpanded, setContentExpanded] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [contentWidth, setContentWidth] = useState(400)
  const [isResizing, setIsResizing] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [uploadError, setUploadError] = useState('')
  const user = useUserStore(state => state.user)
  const addContent = useContentStore(state => state.addContent)

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsResizing(true)
  }
  
  const handleMouseMove = (e) => {
    if (!isResizing) return
    e.preventDefault()
    const newWidth = e.clientX - 24
    if (newWidth >= 250 && newWidth <= 800) {
      setContentWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    if (isResizing) {
      setIsResizing(false)
    }
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    setUploadSuccess('')
    setUploadError('')

    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user?.id || 'user_123')

      try {
        const response = await contentAPI.upload(formData)
        const content = response.data
        
        storage.saveContent(content)
        addContent(content)
        
        const newFile = {
          id: content.id || Date.now() + Math.random(),
          name: file.name,
          file: file,
          uploaded: true
        }
        setUploadedFiles(prev => [...prev, newFile])
        setUploadSuccess(`${file.name} uploaded successfully!`)
      } catch (err) {
        console.error('Upload failed, saving locally:', err)
        
        const content = {
          id: 'content_' + Date.now(),
          filename: file.name,
          type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'doc',
          size: file.size,
          timestamp: new Date().toISOString()
        }
        
        storage.saveContent(content)
        addContent(content)
        
        const newFile = {
          id: content.id,
          name: file.name,
          file: file,
          uploaded: false
        }
        setUploadedFiles(prev => [...prev, newFile])
        setUploadError('Saved locally (backend unavailable)')
      }
    }

    setUploading(false)
    setContentExpanded(true)
    e.target.value = ''
    setTimeout(() => {
      setUploadSuccess('')
      setUploadError('')
    }, 3000)
  }

  const handleYoutubeUpload = async () => {
    if (!youtubeUrl.trim()) return

    setUploading(true)
    setUploadSuccess('')
    setUploadError('')

    try {
      const response = await contentAPI.upload({
        url: youtubeUrl,
        type: 'youtube',
        userId: user?.id || 'user_123'
      })
      
      const content = response.data
      storage.saveContent(content)
      addContent(content)
      
      const newFile = {
        id: content.id || Date.now() + Math.random(),
        name: `YouTube: ${youtubeUrl.substring(0, 50)}...`,
        url: youtubeUrl,
        uploaded: true
      }
      setUploadedFiles(prev => [...prev, newFile])
      setUploadSuccess('YouTube video added successfully!')
      setYoutubeUrl('')
      setShowUploadModal(false)
    } catch (err) {
      console.error('YouTube upload failed:', err)
      setUploadError('Failed to process YouTube link')
    } finally {
      setUploading(false)
      setTimeout(() => {
        setUploadSuccess('')
        setUploadError('')
      }, 3000)
    }
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    setSelectedFiles(prev => prev.filter(id => id !== fileId))
  }

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    )
  }

  const handleAskQuestion = async () => {
    if (!question.trim()) return

    const selectedFileObjs = uploadedFiles.filter(f => selectedFiles.includes(f.id))
    
    const userMessage = { role: 'user', content: question }
    setMessages(prev => [...prev, userMessage])
    const currentQuestion = question
    setQuestion('')
    setLoading(true)

    try {
      // Read file contents
      let fileContents = ''
      for (const fileObj of selectedFileObjs) {
        if (fileObj.file) {
          try {
            const text = await fileObj.file.text()
            fileContents += `\n\n--- File: ${fileObj.name} ---\n${text.substring(0, 5000)}\n`
          } catch (err) {
            console.error('Error reading file:', err)
          }
        }
      }

      // Add file context to question
      const contextualQuestion = fileContents 
        ? `${currentQuestion}\n\nContext from uploaded files:${fileContents}`
        : currentQuestion

      const response = await aiAPI.question({
        question: contextualQuestion,
        contentId: 'demo',
        userId: user?.id || 'user_123',
        chatHistory: messages.slice(-10)
      })
      
      const aiMessage = { 
        role: 'assistant', 
        content: response.data.answer,
        citations: response.data.citations 
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI API error:', error)
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to get response'
      
      const aiMessage = { 
        role: 'assistant', 
        content: `I apologize, but I encountered an error: ${errorMsg}. Please try rephrasing your question or check if files are properly uploaded.`,
        citations: []
      }
      setMessages(prev => [...prev, aiMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="max-w-7xl mx-auto p-6" 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp}
      style={{ userSelect: isResizing ? 'none' : 'auto' }}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          AI Learning Assistant
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Ask questions and get instant, source-grounded answers</p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Content Panel - Collapsible */}
        <div className="col-span-3" 
          className="rounded-lg shadow relative"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border-primary)',
            borderWidth: '1px'
          }}
          style={{ 
            width: contentExpanded ? `${contentWidth}px` : '64px',
            transition: isResizing ? 'none' : 'width 0.3s ease'
          }}
        >
          {contentExpanded ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-blue-600" size={24} />
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Your Files</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowUploadModal(true)} className="p-2 hover:bg-gray-100 rounded-lg" title="Upload content">
                    <Upload size={20} className="text-blue-600" />
                  </button>
                  <button onClick={() => setContentExpanded(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft size={20} />
                  </button>
                </div>
              </div>
              <div className="max-h-[500px] overflow-y-auto rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                {uploadedFiles.length > 0 ? (
                  <div className="space-y-2">
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-50 transition-colors" style={{
                        backgroundColor: 'var(--color-bg-primary)',
                        borderColor: 'var(--color-border-primary)',
                        borderWidth: '1px'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => toggleFileSelection(file.id)}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                        />
                        {file.url ? <Youtube size={18} className="text-red-600" /> : <BookOpen size={18} className="text-blue-600" />}
                        <span className="text-sm font-medium flex-1" style={{ color: 'var(--color-text-primary)' }}>{file.name}</span>
                        <button onClick={() => removeFile(file.id)} className="p-1 hover:bg-red-100 rounded">
                          <X size={16} className="text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Upload className="mx-auto mb-4 text-gray-300" size={64} />
                    <p style={{ color: 'var(--color-text-secondary)' }}>No files uploaded yet</p>
                    <p className="text-sm mt-2" style={{ color: 'var(--color-text-tertiary)' }}>Click upload icon to add content</p>
                  </div>
                )}
              </div>
              {/* Resize Handle */}
              <div 
                onMouseDown={handleMouseDown}
                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:w-1 transition-all bg-transparent"
                style={{ right: '-4px' }}
              />
            </div>
          ) : (
            <button 
              onClick={() => setContentExpanded(true)}
              className="h-full w-full flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="text-blue-600" size={24} />
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Chat Panel */}
        <div className="col-span-6 rounded-lg shadow p-6 flex flex-col" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="text-purple-600" size={24} />
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>AI Chat</h3>
            <Sparkles className="text-yellow-500 ml-auto" size={20} />
          </div>
          
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[500px]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${
                  msg.role === 'user' 
                    ? 'max-w-[80%] p-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'max-w-[90%] p-5 rounded-lg'
                }" style={msg.role === 'assistant' ? {
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  borderWidth: '1px'
                } : {}}>
                }`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    <div>
                      <MessageRenderer content={msg.content} />
                    </div>
                  )}
                  {msg.citations && msg.role === 'assistant' && (
                    <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                      📚 Sources: {msg.citations.map(c => c.source).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
              placeholder="Ask a question about your content..."
              className="flex-1 border-2 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                color: 'var(--color-text-primary)'
              }}
            />
            <button
              onClick={handleAskQuestion}
              disabled={loading || !question.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Cognitive Monitor Panel */}
        <div className="col-span-3">
          <CognitiveMonitor />
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowUploadModal(false)}>
          <div className="rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4" style={{
            backgroundColor: 'var(--color-bg-primary)'
          }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Upload Content</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            {uploadSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                <CheckCircle size={20} />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {uploadError && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-700">
                <AlertCircle size={20} />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <label className="cursor-pointer">
                <input type="file" multiple onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,.txt" disabled={uploading} />
                <div className="p-6 rounded-xl border-2 border-dashed hover:border-blue-500 hover:bg-blue-50 transition-all text-center" style={{
                  borderColor: 'var(--color-border-primary)'
                }}>
                  <FileText className="mx-auto mb-2 text-blue-600" size={32} />
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>PDF, Docs & TXT</p>
                </div>
              </label>

              <label className="cursor-pointer">
                <input type="file" multiple onChange={handleFileUpload} className="hidden" accept="image/*" disabled={uploading} />
                <div className="p-6 rounded-xl border-2 border-dashed hover:border-green-500 hover:bg-green-50 transition-all text-center" style={{
                  borderColor: 'var(--color-border-primary)'
                }}>
                  <ImageIcon className="mx-auto mb-2 text-green-600" size={32} />
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Images (OCR)</p>
                </div>
              </label>

              <div className="p-6 rounded-xl border-2 border-dashed hover:border-red-500 hover:bg-red-50 transition-all text-center cursor-pointer" style={{
                borderColor: 'var(--color-border-primary)'
              }} onClick={() => document.getElementById('youtube-input').focus()}>
                <Youtube className="mx-auto mb-2 text-red-600" size={32} />
                <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>YouTube</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>YouTube URL</label>
                <div className="flex gap-2">
                  <input
                    id="youtube-input"
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="flex-1 border-2 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderColor: 'var(--color-border-primary)',
                      color: 'var(--color-text-primary)'
                    }}
                    disabled={uploading}
                  />
                  <button
                    onClick={handleYoutubeUpload}
                    disabled={uploading || !youtubeUrl.trim()}
                    className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Supported: PDF, DOC, DOCX, TXT, Images (PNG, JPG), YouTube videos</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
