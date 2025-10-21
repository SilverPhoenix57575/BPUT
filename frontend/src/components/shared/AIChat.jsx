import { useState, useEffect } from 'react'
import { Send, Sparkles, Copy, Check, Plus, MessageSquare, Trash2, Search, BookMarked, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { aiAPI } from '../../services/api'
import useUserStore from '../../stores/userStore'
import ProjectModal from './ProjectModal'

export default function AIChat() {
  const [chatSessions, setChatSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI learning assistant. Ask me anything!' }
  ])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [responseType, setResponseType] = useState('medium')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeView, setActiveView] = useState('chats')
  const [library, setLibrary] = useState([])
  const [projects, setProjects] = useState([])
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const user = useUserStore(state => state.user)

  useEffect(() => {
    loadChatSessions()
    loadLibrary()
    loadProjects()
  }, [])

  const loadLibrary = () => {
    const saved = localStorage.getItem('chatLibrary')
    if (saved) setLibrary(JSON.parse(saved))
  }

  const loadProjects = () => {
    const saved = localStorage.getItem('chatProjects')
    if (saved) setProjects(JSON.parse(saved))
  }

  const createProject = (projectData) => {
    const project = {
      id: `proj_${Date.now()}`,
      name: projectData.name,
      icon: projectData.icon || '📁',
      chatIds: [],
      timestamp: new Date().toISOString()
    }
    const updated = [...projects, project]
    setProjects(updated)
    localStorage.setItem('chatProjects', JSON.stringify(updated))
    setActiveProject(project)
    setActiveView('chats')
  }

  const selectProject = (project) => {
    if (activeProject?.id === project.id) {
      setActiveProject(null)
    } else {
      setActiveProject(project)
    }
  }

  const deleteProject = (projectId) => {
    const filtered = projects.filter(p => p.id !== projectId)
    setProjects(filtered)
    localStorage.setItem('chatProjects', JSON.stringify(filtered))
    if (activeProject?.id === projectId) {
      setActiveProject(null)
    }
  }

  const saveToLibrary = () => {
    const item = {
      id: `lib_${Date.now()}`,
      title: chatSessions.find(s => s.id === currentSessionId)?.title || 'Saved Chat',
      messages: messages,
      timestamp: new Date().toISOString()
    }
    const updated = [...library, item]
    setLibrary(updated)
    localStorage.setItem('chatLibrary', JSON.stringify(updated))
  }

  useEffect(() => {
    if (messages.length > 1 && currentSessionId) {
      saveChatSession()
    }
  }, [messages])

  const loadChatSessions = () => {
    const saved = localStorage.getItem('chatSessions')
    if (saved) {
      const sessions = JSON.parse(saved)
      setChatSessions(sessions)
      if (sessions.length > 0) {
        loadSession(sessions[0].id)
      }
    }
  }

  const generateChatTitle = async () => {
    if (messages.length < 3) return 'New Chat'
    
    try {
      const conversation = messages.slice(0, 4).map(m => 
        `${m.role === 'user' ? 'User' : 'AI'}: ${m.content.slice(0, 100)}`
      ).join('\n')
      
      const response = await aiAPI.question({
        question: `Generate a short 3-5 word title for this conversation:\n${conversation}\n\nTitle:`,
        contentId: 'title_gen',
        userId: user?.id || 'user',
        chatHistory: []
      })
      
      return response.data.answer.replace(/[\"']/g, '').trim().slice(0, 50)
    } catch {
      return messages.find(m => m.role === 'user')?.content.slice(0, 50) || 'New Chat'
    }
  }

  const saveChatSession = async () => {
    const sessions = [...chatSessions]
    const existingIndex = sessions.findIndex(s => s.id === currentSessionId)
    
    let title = sessions[existingIndex]?.title
    if (!title || title === 'New Chat') {
      title = await generateChatTitle()
    }
    
    const session = {
      id: currentSessionId,
      title,
      messages,
      projectId: activeProject?.id,
      timestamp: new Date().toISOString()
    }

    if (existingIndex >= 0) {
      sessions[existingIndex] = session
    } else {
      sessions.unshift(session)
    }

    setChatSessions(sessions)
    localStorage.setItem('chatSessions', JSON.stringify(sessions))
  }

  const createNewChat = () => {
    const newId = `chat_${Date.now()}`
    setCurrentSessionId(newId)
    const welcomeMsg = activeProject 
      ? `Hi! I'm your AI assistant for ${activeProject.name}. How can I help you today?`
      : 'Hi! I\'m your AI learning assistant. Ask me anything!'
    setMessages([{ role: 'assistant', content: welcomeMsg }])
  }

  const loadSession = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSessionId(session.id)
      setMessages(session.messages)
    }
  }

  const deleteSession = (sessionId) => {
    const filtered = chatSessions.filter(s => s.id !== sessionId)
    setChatSessions(filtered)
    localStorage.setItem('chatSessions', JSON.stringify(filtered))
    if (currentSessionId === sessionId) {
      createNewChat()
    }
  }

  useEffect(() => {
    if (!currentSessionId) {
      createNewChat()
    }
  }, [])

  const handleAsk = async () => {
    if (!question.trim()) return

    const userMsg = { role: 'user', content: question }
    setMessages(prev => [...prev, userMsg])
    const currentQuestion = question
    setQuestion('')
    setLoading(true)

    try {
      const response = await aiAPI.question({
        question: currentQuestion,
        contentId: 'demo',
        userId: user?.id || 'user_123',
        chatHistory: messages.slice(-10)
      })
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.answer
      }])
    } catch (err) {
      console.error('AI error:', err)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const filteredChats = chatSessions.filter(s => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return s.title.toLowerCase().includes(query) ||
      s.messages.some(m => m.content.toLowerCase().includes(query))
  })

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4 px-6">
      {!sidebarCollapsed && (
      <div className="w-72 flex-shrink-0 rounded-2xl shadow-lg p-4" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>AI Chat</span>
          </div>
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="p-1 rounded transition-all"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <button
          onClick={createNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
        >
          <Plus size={20} />
          New chat
        </button>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border-primary)',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>

        <div className="flex gap-1 mb-4">
          <button
            onClick={() => setActiveView('chats')}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg transition-all font-medium text-xs"
            style={{
              backgroundColor: activeView === 'chats' ? 'var(--color-bg-tertiary)' : 'transparent',
              color: 'var(--color-text-primary)'
            }}
          >
            <MessageSquare size={14} />
            <span>Chats</span>
          </button>
          <button
            onClick={() => setActiveView('library')}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg transition-all font-medium text-xs"
            style={{
              backgroundColor: activeView === 'library' ? 'var(--color-bg-tertiary)' : 'transparent',
              color: 'var(--color-text-primary)'
            }}
          >
            <BookMarked size={14} />
            <span>Library</span>
          </button>
          <button
            onClick={() => {
              if (projects.length === 0) {
                setShowProjectModal(true)
              } else {
                setActiveView('projects')
              }
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg transition-all font-medium text-xs"
            style={{
              backgroundColor: activeView === 'projects' ? 'var(--color-bg-tertiary)' : 'transparent',
              color: 'var(--color-text-primary)'
            }}
          >
            <FolderOpen size={14} />
            <span>Projects</span>
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)' }}>
          {activeView === 'chats' && (
            <>
              {filteredChats.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <Search size={48} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--color-text-tertiary)' }} />
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>No chats found</p>
                </div>
              )}
              {filteredChats.filter(s => activeProject ? s.projectId === activeProject.id : !s.projectId).map((session) => (
            <div key={session.id} className="group relative">
              <button
                onClick={() => loadSession(session.id)}
                className="w-full text-left px-3 py-2 rounded-lg transition-all"
                style={{
                  backgroundColor: currentSessionId === session.id ? 'var(--color-bg-tertiary)' : 'transparent',
                  color: 'var(--color-text-primary)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
                onMouseLeave={(e) => {
                  if (currentSessionId !== session.id) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare size={16} className="mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{session.title}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      {new Date(session.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteSession(session.id)
                }}
                className="absolute right-2 top-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                style={{ color: '#ef4444' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
            </>
          )}

          {activeView === 'library' && (
            <div>
              {messages.length > 1 && (
                <button
                  onClick={saveToLibrary}
                  className="w-full px-3 py-2 mb-3 rounded-lg border-2 border-dashed text-sm transition-all hover:border-blue-500"
                  style={{
                    borderColor: 'var(--color-border-primary)',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  💾 Save Current Chat
                </button>
              )}
              {library.length === 0 && (
                <div className="text-center py-8">
                  <BookMarked size={48} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--color-text-tertiary)' }} />
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>No saved chats yet</p>
                </div>
              )}
              {library.map((item) => (
                <div key={item.id} className="group relative">
                  <button
                    onClick={() => {
                      setMessages(item.messages)
                      setCurrentSessionId(null)
                      setActiveView('chats')
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg transition-all"
                    style={{ color: 'var(--color-text-primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div className="flex items-start gap-2">
                      <BookMarked size={16} className="mt-1 flex-shrink-0" style={{ color: '#3b82f6' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate font-medium">{item.title}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeView === 'projects' && (
            <div>
              <button
                onClick={() => setShowProjectModal(true)}
                className="w-full px-3 py-2 mb-3 rounded-lg border-2 border-dashed text-sm transition-all hover:border-blue-500"
                style={{
                  borderColor: 'var(--color-border-primary)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <Plus size={16} className="inline mr-2" />
                New Project
              </button>
              {projects.length === 0 && (
                <div className="text-center py-8">
                  <FolderOpen size={48} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--color-text-tertiary)' }} />
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>No projects yet</p>
                </div>
              )}
              {projects.map((project) => (
                <div key={project.id} className="group relative mb-2">
                  <button
                    onClick={() => selectProject(project)}
                    className="w-full px-3 py-2.5 rounded-lg transition-all hover:scale-102"
                    style={{
                      backgroundColor: activeProject?.id === project.id ? '#3b82f6' : 'var(--color-bg-tertiary)',
                      color: activeProject?.id === project.id ? 'white' : 'var(--color-text-primary)',
                      border: activeProject?.id === project.id ? '2px solid #60a5fa' : '2px solid transparent'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{project.icon}</span>
                      <span className="font-semibold text-sm truncate">{project.name}</span>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteProject(project.id)
                    }}
                    className="absolute right-2 top-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="fixed left-4 top-24 p-2 rounded-lg z-50 transition-all"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
        >
          <ChevronRight size={20} />
        </button>
      )}

      <div className="flex-1 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeProject && (
              <>
                <span className="text-3xl">{activeProject.icon}</span>
                <div className="flex items-center gap-2">
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {activeProject.name}
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Project workspace</p>
                  </div>
                  <button
                    onClick={() => setActiveProject(null)}
                    className="ml-2 px-3 py-1 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-tertiary)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    Exit Project
                  </button>
                </div>
              </>
            )}
            {!activeProject && (
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  AI Learning Assistant
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Ask questions and get detailed answers</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {[
              { type: 'basic', icon: '📝', label: 'Basic', color: '#10b981' },
              { type: 'medium', icon: '📚', label: 'Medium', color: '#3b82f6' },
              { type: 'advanced', icon: '🎓', label: 'Advanced', color: '#a855f7' }
            ].map(({ type, icon, label, color }) => (
              <button
                key={type}
                onClick={() => setResponseType(type)}
                className="relative px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 hover:scale-105"
                style={{
                  background: responseType === type ? color : 'var(--color-bg-secondary)',
                  color: responseType === type ? 'white' : 'var(--color-text-secondary)',
                  border: `2px solid ${responseType === type ? color : 'var(--color-border-primary)'}`
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
                {responseType === type && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 rounded-2xl shadow-lg p-6 flex flex-col" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
          <div className="flex-1 space-y-6 overflow-y-auto mb-6">
          {messages.map((msg, idx) => (
            <div key={idx}>
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-[80%] px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-[95%]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                        <Sparkles className="text-white" size={16} />
                      </div>
                      <span className="font-semibold text-sm" style={{ color: 'var(--color-text-secondary)' }}>AI Assistant</span>
                    </div>
                    <FormattedMessage content={msg.content} />
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 px-6 py-3 rounded-2xl" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={createNewChat}
              className="p-3 rounded-xl transition-all"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
              title="New chat"
            >
              <Plus size={20} style={{ color: 'var(--color-text-primary)' }} />
            </button>
            <div className="flex-1 flex items-center gap-3 px-6 py-4 border-2 rounded-xl" style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border-primary)'
            }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                placeholder={activeProject ? `New chat in ${activeProject.name}` : 'Ask me anything...'}
                className="flex-1 bg-transparent focus:outline-none text-lg"
                style={{ color: 'var(--color-text-primary)' }}
              />
            </div>
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>

      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          onCreate={(data) => {
            createProject(data)
            setShowProjectModal(false)
          }}
        />
      )}
    </div>
  )
}

function FormattedMessage({ content }) {
  const [copiedIndex, setCopiedIndex] = useState(null)

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const parts = content.split(/(```[\s\S]*?```)/g)
  let codeBlockIndex = 0

  return (
    <div className="space-y-4">
      {parts.map((part, idx) => {
        if (part.startsWith('```')) {
          const lines = part.split('\n')
          const language = lines[0].replace('```', '').trim() || 'text'
          const code = lines.slice(1, -1).join('\n')
          const currentIndex = codeBlockIndex++

          return (
            <div key={idx} className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-border-primary)' }}>
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
                <span className="text-xs font-mono uppercase">{language}</span>
                <button
                  onClick={() => copyToClipboard(code, currentIndex)}
                  className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-sm"
                >
                  {copiedIndex === currentIndex ? (
                    <>
                      <Check size={16} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '14px',
                  padding: '1rem'
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          )
        }

        return (
          <div key={idx} className="prose max-w-none" style={{ color: 'var(--color-text-primary)' }}>
            {part.split('\n').map((line, lineIdx) => {
              if (line.startsWith('# ')) {
                return <h1 key={lineIdx} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>
              }
              if (line.startsWith('## ')) {
                return <h2 key={lineIdx} className="text-xl font-bold mt-3 mb-2">{line.substring(3)}</h2>
              }
              if (line.startsWith('### ')) {
                return <h3 key={lineIdx} className="text-lg font-bold mt-2 mb-1">{line.substring(4)}</h3>
              }

              const formatText = (text) => {
                const parts = []
                let current = text
                let idx = 0

                while (current.length > 0) {
                  if (current.startsWith('`')) {
                    const end = current.indexOf('`', 1)
                    if (end > 0) {
                      parts.push(
                        <code key={idx++} className="px-2 py-1 rounded text-sm font-mono" style={{
                          backgroundColor: 'var(--color-bg-tertiary)',
                          color: 'var(--color-accent-blue)'
                        }}>
                          {current.slice(1, end)}
                        </code>
                      )
                      current = current.slice(end + 1)
                      continue
                    }
                  }

                  if (current.startsWith('**')) {
                    const end = current.indexOf('**', 2)
                    if (end > 0) {
                      parts.push(<strong key={idx++}>{current.slice(2, end)}</strong>)
                      current = current.slice(end + 2)
                      continue
                    }
                  }

                  if (current.startsWith('*') && !current.startsWith('**')) {
                    const end = current.indexOf('*', 1)
                    if (end > 0) {
                      parts.push(<em key={idx++}>{current.slice(1, end)}</em>)
                      current = current.slice(end + 1)
                      continue
                    }
                  }

                  const next = current.search(/[*`]/)
                  if (next === -1) {
                    parts.push(current)
                    break
                  }
                  if (next > 0) {
                    parts.push(current.slice(0, next))
                    current = current.slice(next)
                  } else {
                    parts.push(current[0])
                    current = current.slice(1)
                  }
                }

                return parts
              }

              if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                return (
                  <li key={lineIdx} className="ml-6 mb-2 leading-relaxed" style={{ listStyleType: 'disc' }}>
                    {formatText(line.trim().substring(2))}
                  </li>
                )
              }

              if (/^\d+\.\s/.test(line.trim())) {
                return (
                  <li key={lineIdx} className="ml-6 mb-2 leading-relaxed" style={{ listStyleType: 'decimal' }}>
                    {formatText(line.trim().replace(/^\d+\.\s/, ''))}
                  </li>
                )
              }

              return line.trim() ? (
                <p key={lineIdx} className="leading-relaxed mb-2">{formatText(line)}</p>
              ) : (
                <br key={lineIdx} />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
