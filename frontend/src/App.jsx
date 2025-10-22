import { useState } from 'react'
import { Brain, LogOut, ClipboardCheck, User, Library, MessageSquare, Briefcase, Network } from 'lucide-react'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import QuizView from './components/student/QuizView'
import Profile from './components/student/Profile'
import CareerMapping from './components/student/CareerMapping'
import EnhancedDashboard from './components/student/EnhancedDashboard'
import KnowledgeHub from './components/hub/KnowledgeHub'
import MindMapCreator from './components/hub/MindMapCreator'
import AIChat from './components/shared/AIChat'
import PomodoroTimer from './components/shared/PomodoroTimer'
import ThemeToggle from './components/shared/ThemeToggle'
import OfflineIndicator from './components/shared/OfflineIndicator'
import EducatorApp from './EducatorApp'
import SchoolApp from './SchoolApp'
import useUserStore from './stores/userStore'
import useContentStore from './stores/contentStore'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [authView, setAuthView] = useState('signin')
  const { user, setUser, logout } = useUserStore()
  const [activeView, setActiveView] = useState('home')
  const currentContent = useContentStore(state => state.currentContent)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async (credentials) => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials)
      const { token, ...userData } = response.data
      localStorage.setItem('token', token)
      setUser({ ...userData, email: credentials.email })
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (userData) => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, userData)
      const { token, ...userInfo } = response.data
      localStorage.setItem('token', token)
      setUser({ ...userInfo, email: userData.email, name: userData.name })
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed')
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return authView === 'signin' 
      ? <SignIn onSignIn={handleSignIn} onSwitchToSignUp={() => setAuthView('signup')} loading={loading} error={error} />
      : <SignUp onSignUp={handleSignUp} onSwitchToSignIn={() => setAuthView('signin')} loading={loading} error={error} />
  }

  // Role-based routing
  if (user.role === 'educator' || user.role === 'teacher') {
    return <EducatorApp />
  }
  
  if (user.role === 'school' || user.role === 'institution') {
    return <SchoolApp />
  }

  const renderContent = () => {
    switch(activeView) {
      case 'chat':
        return <AIChat />
      case 'hub':
        return <KnowledgeHub />
      case 'mindmap':
        return <MindMapCreator />
      case 'quiz':
        return <QuizView contentId={currentContent?.id || 'demo'} competencyId="cs_001" />
      case 'profile':
        return <Profile />
      case 'career':
        return <CareerMapping />
      default:
        return <EnhancedDashboard onNavigate={setActiveView} />
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-secondary)' }}>
      <nav className="backdrop-blur-lg shadow-sm sticky top-0 z-50" style={{ 
        backgroundColor: 'var(--color-bg-primary)', 
        borderBottom: '1px solid var(--color-border-primary)'
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <button onClick={() => setActiveView('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <Brain className="text-white" size={28} />
              </div>
              <div>
                <span className="font-bold text-2xl" style={{ color: 'var(--color-text-primary)' }}>
                  AI Learning
                </span>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Welcome, {user.name || user.email}</p>
              </div>
            </button>
            
            <div className="flex items-center gap-2">
              <NavButton icon={MessageSquare} label="AI Chat" active={activeView === 'chat'} onClick={() => setActiveView('chat')} />
              <NavButton icon={Library} label="Knowledge Hub" active={activeView === 'hub'} onClick={() => setActiveView('hub')} />
              <NavButton icon={Network} label="Mind Map" active={activeView === 'mindmap'} onClick={() => setActiveView('mindmap')} />
              <NavButton icon={Briefcase} label="Career" active={activeView === 'career'} onClick={() => setActiveView('career')} />
              <NavButton icon={ClipboardCheck} label="Quiz" active={activeView === 'quiz'} onClick={() => setActiveView('quiz')} />
              <NavButton icon={User} label="Profile" active={activeView === 'profile'} onClick={() => setActiveView('profile')} />
              <ThemeToggle />
              <button
                onClick={logout}
                className="ml-2 px-4 py-2 text-red-600 rounded-xl transition-all flex items-center gap-2"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {renderContent()}
      </main>
      <PomodoroTimer />
      <OfflineIndicator />
    </div>
  )
}

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
      style={active ? {
        backgroundColor: 'var(--color-accent-blue)',
        color: '#ffffff'
      } : {
        color: 'var(--color-text-secondary)'
      }}
      onMouseEnter={(e) => !active && (e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)')}
      onMouseLeave={(e) => !active && (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}

export default App
