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
    createNewChat()
  }

  const selectProject = (project) => {
    setActiveProject(project)
    createNewChat()
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
      projectId: activeProject?.id || null,
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
    setActiveView('chats')
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

  const filteredChats = chatSessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4 px-6">
      {!sidebarCollapsed && (
      <div className="w-72 flex-shrink-0 rounded-2xl shadow-lg p-4" style={{
        backgroundColor: '#1a1a1a',
        borderColor: '#333',
        borderWidth: '1px'
      }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">AI Chat</span>
          </div>
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="p-1 rounded hover:bg-gray-800 text-gray-400"
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
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
          />
        </div>

        <div className="space-y-2 mb-4">
          <button
            onClick={() => setActiveView('library')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-white hover:bg-gray-800"
            style={{ backgroundColor: activeView === 'library' ? '#374151' : 'transparent' }}
          >
            <BookMarked size={18} />
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
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-white hover:bg-gray-800"
            style={{ backgroundColor: activeView === 'projects' ? '#374151' : 'transparent' }}
          >
            <FolderOpen size={18} />
            <span>Projects</span>
          </button>
        </div>

        <div className="border-t border-gray-700 pt-3 mb-3"></div>

        <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 420px)' }}>
          {activeView === 'chats' && filteredChats.map((session) => (
            <div key={session.id} className="group relative">
              <button
                onClick={() => loadSession(session.id)}
                className="w-full text-left px-3 py-2 rounded-lg transition-all"
                style={{
                  backgroundColor: currentSessionId === session.id ? '#374151' : 'transparent',
                  color: '#fff'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
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
                    <p className="text-xs text-gray-500">
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

          {activeView === 'library' && (
            <div>
              <button
                onClick={saveToLibrary}
                className="w-full px-3 py-2 mb-2 rounded-lg border-2 border-dashed border-gray-700 text-gray-400 text-sm hover:border-gray-500"
              >
                Save Current Chat
              </button>
              {library.map((item) => (
                <div key={item.id} className="group relative">
                  <button
                    onClick={() => {
                      setMessages(item.messages)
                      setActiveView('chats')
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg transition-all text-white hover:bg-gray-800"
                  >
                    <div className="flex items-start gap-2">
                      <BookMarked size={16} className="mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">
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
                className="w-full px-3 py-2 mb-2 rounded-lg border-2 border-dashed border-gray-700 text-gray-400 text-sm hover:border-gray-500"
              >
                <Plus size={16} className="inline mr-2" />
                New Project
              </button>
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => selectProject(project)}
                  className="w-full px-3 py-2 mb-2 rounded-lg transition-all text-white"
                  style={{
                    backgroundColor: activeProject?.id === project.id ? '#2563eb' : '#374151'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{project.icon}</span>
                    <span className="font-semibold text-sm">{project.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="fixed left-4 top-24 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 z-50"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <div className="flex-1 flex flex-col">
        {activeProject ? (
          <div className="mb-4 p-4 rounded-xl flex items-center justify-between" style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border-primary)',
            borderWidth: '1px'
          }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeProject.icon}</span>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {activeProject.name}
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Project workspace
                </p>
              </div>
            </div>
            <button
              className="px-4 py-2 rounded-lg font-medium transition-all bg-gray-700 text-white hover:bg-gray-600"
            >
              📎 Add files
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              AI Learning Assistant
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Ask questions and get detailed answers</p>
          </div>
        )}


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
