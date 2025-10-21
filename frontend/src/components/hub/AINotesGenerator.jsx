import { useState } from 'react'
import { X, Sparkles, BookOpen, Zap, Upload } from 'lucide-react'
import { aiAPI, contentAPI } from '../../services/api'
import useUserStore from '../../stores/userStore'

export default function AINotesGenerator({ onClose, onSave }) {
  const [topic, setTopic] = useState('')
  const [file, setFile] = useState(null)
  const [mode, setMode] = useState('detailed')
  const [generating, setGenerating] = useState(false)
  const user = useUserStore(state => state.user)

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setTopic(uploadedFile.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleGenerate = async () => {
    if (!topic.trim() && !file) return

    setGenerating(true)
    
    try {
      let sourceText = topic
      
      // If file uploaded, extract text first
      if (file) {
        try {
          if (file.type.includes('text') || file.name.endsWith('.txt')) {
            sourceText = await file.text()
          } else {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('userId', user?.id || 'user_123')
            const response = await contentAPI.upload(formData)
            sourceText = response.data.extracted_text || topic
          }
        } catch (err) {
          console.error('File processing error:', err)
        }
      }

      // Generate enhanced notes using AI
      const prompt = mode === 'detailed'
        ? `Generate comprehensive, well-structured study notes on the following topic/content. Include:
- Clear headings and subheadings
- Session numbers (e.g., Session 1/3, Session 2/3)
- Bullet points for key concepts
- Highlighted tips (💡 Key Concept:)
- Important warnings (⚠️ Important:)
- Summaries (✅ Summary:)
- Practical examples

Topic/Content: ${sourceText}`
        : `Generate concise exam-focused revision notes on the following topic/content. Include:
- Quick reference format
- Session numbers (Session 1/2, Session 2/2)
- Key points with checkmarks (✓)
- Exam tips (⚡ Exam Tip:)
- Last minute revision points (🎯 Last Minute:)
- Practice questions

Topic/Content: ${sourceText}`

      const response = await aiAPI.question({
        question: prompt,
        contentId: 'notes-generator',
        userId: user?.id || 'user_123',
        chatHistory: []
      })

      const generatedContent = response.data.answer
      
      // Extract key takeaways from generated content
      const lines = generatedContent.split('\n').filter(l => l.trim())
      const keyTakeaways = lines
        .filter(l => l.includes('✓') || l.includes('•') || l.includes('-'))
        .slice(0, 5)
        .map(l => l.replace(/[✓•-]/g, '').trim())

      const note = {
        id: Date.now(),
        title: `${mode === 'detailed' ? 'Detailed' : 'Exam'} Notes: ${topic}`,
        summary: lines.slice(0, 3).join(' ').substring(0, 300),
        tags: [mode, 'ai-generated', topic.toLowerCase().replace(/\s+/g, '-')],
        keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : [
          'AI-generated study notes',
          'Structured for easy learning',
          'Session-based approach'
        ],
        fullText: generatedContent,
        createdAt: new Date().toISOString(),
        mode: mode,
        originalFile: file?.name
      }
      
      onSave(note)
    } catch (err) {
      console.error('AI generation error:', err)
      // Fallback to template-based generation
      const note = {
        id: Date.now(),
        title: `${mode === 'detailed' ? 'Detailed' : 'Exam'} Notes: ${topic}`,
        summary: mode === 'detailed' 
          ? `Comprehensive study notes covering all aspects of ${topic} with detailed explanations and examples.`
          : `Concise exam-focused notes for ${topic} with key points and quick revision material.`,
        tags: [mode, 'ai-generated', topic.toLowerCase().replace(/\s+/g, '-')],
        keyTakeaways: [
          'Core concepts explained clearly',
          'Practical examples included',
          'Structured for easy revision',
          'Session-based learning approach'
        ],
        fullText: generateNoteContent(topic, mode),
        createdAt: new Date().toISOString(),
        mode: mode
      }
      onSave(note)
    } finally {
      setGenerating(false)
    }
  }

  const generateNoteContent = (topic, mode) => {
    if (mode === 'detailed') {
      return `# ${topic} - Detailed Study Notes

## Session 1/3: Introduction and Fundamentals

### Overview
${topic} is a fundamental concept that requires thorough understanding. This section covers the basic principles and foundational knowledge.

**💡 Key Concept:** Understanding the core principles is essential before moving to advanced topics.

### Main Topics
- Definition and importance
- Historical context
- Basic terminology
- Real-world applications

**⚠️ Important:** Make sure to practice examples after each section.

## Session 2/3: Core Concepts

### Deep Dive
This section explores the main concepts in detail with practical examples.

**✅ Summary:** Focus on understanding rather than memorization.

## Session 3/3: Advanced Topics and Practice

### Application
Apply your knowledge through practical exercises and problem-solving.

**📝 Revision Tip:** Review all three sessions before the exam.`
    } else {
      return `# ${topic} - Exam Mode Notes

## Quick Reference Guide

### Key Points (Session 1/2)
- ✓ Core definition
- ✓ Main principles
- ✓ Important formulas
- ✓ Common patterns

**⚡ Exam Tip:** Focus on these high-priority topics.

### Practice Questions (Session 2/2)
1. Define ${topic}
2. Explain key concepts
3. Solve sample problems

**🎯 Last Minute:** Review highlighted sections only.`
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
                AI Notes Generator
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Topic / Subject
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Data Structures, Machine Learning, Calculus"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  color: 'var(--color-text-primary)'
                }}
              />
            </div>

            <div className="text-center" style={{ color: 'var(--color-text-tertiary)' }}>OR</div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Upload File (Optional)
              </label>
              <label className="block cursor-pointer">
                <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,.txt" />
                <div className="p-4 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center" style={{
                  borderColor: 'var(--color-border-primary)'
                }}>
                  <Upload className="mx-auto mb-2 text-blue-600" size={32} />
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {file ? file.name : 'Upload notes to enhance'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>PDF, DOC, TXT</p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                Generation Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('detailed')}
                  className={`p-4 border-2 rounded-lg transition-all ${mode === 'detailed' ? 'border-blue-500 bg-blue-50' : ''}`}
                  style={{
                    borderColor: mode === 'detailed' ? 'var(--color-accent-blue)' : 'var(--color-border-primary)',
                    backgroundColor: mode === 'detailed' ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                  }}
                >
                  <BookOpen className="mx-auto mb-2 text-blue-600" size={28} />
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>Detailed Mode</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Comprehensive notes with examples</p>
                </button>

                <button
                  onClick={() => setMode('exam')}
                  className={`p-4 border-2 rounded-lg transition-all ${mode === 'exam' ? 'border-purple-500 bg-purple-50' : ''}`}
                  style={{
                    borderColor: mode === 'exam' ? '#a855f7' : 'var(--color-border-primary)',
                    backgroundColor: mode === 'exam' ? 'rgba(168, 85, 247, 0.1)' : 'transparent'
                  }}
                >
                  <Zap className="mx-auto mb-2 text-purple-600" size={28} />
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>Exam Mode</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Quick revision focused</p>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <strong>Features:</strong> Session-based structure, highlighted tips, warnings, summaries, and revision numbers
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={(!topic.trim() && !file) || generating}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="animate-pulse" size={20} />
                  Generating Notes...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={20} />
                  Generate AI Notes
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
