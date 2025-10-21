import { useState } from 'react'
import { Sparkles, Brain, Target, Zap, LogOut, ClipboardCheck, User, BarChart, Library, MessageSquare } from 'lucide-react'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import QuizView from './components/student/QuizView'
import Profile from './components/student/Profile'
import KnowledgeHub from './components/hub/KnowledgeHub'
import AIChat from './components/shared/AIChat'
import ThemeToggle from './components/shared/ThemeToggle'
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

  const renderContent = () => {
    switch(activeView) {
      case 'chat':
        return <AIChat />
      case 'hub':
        return <KnowledgeHub />
      case 'quiz':
        return <QuizView contentId={currentContent?.id || 'demo'} competencyId="cs_001" />
      case 'profile':
        return <Profile />
      default:
        return <HomePage onNavigate={setActiveView} />
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
    </div>
  )
}

function HomePage({ onNavigate }) {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <Sparkles size={16} />
          <span>Powered by AI & Cognitive Science</span>
        </div>
        <h1 className="text-6xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
          Learn Smarter, Not Harder
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Your personal AI learning assistant that adapts to your cognitive state, 
          works offline, and maps your skills to real careers.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          icon={Brain}
          title="Adaptive Learning"
          description="BKT algorithm personalizes your learning path based on mastery"
          gradient="from-blue-500 to-cyan-500"
        />
        <FeatureCard
          icon={Zap}
          title="Works Offline"
          description="Learn anywhere with offline-first architecture and sync"
          gradient="from-purple-500 to-pink-500"
        />
        <FeatureCard
          icon={Target}
          title="Career Mapping"
          description="See how your skills match real job requirements"
          gradient="from-orange-500 to-red-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ActionCard
          icon={MessageSquare}
          title="AI Chat"
          description="Get instant answers with rich formatting and code examples"
          gradient="from-blue-600 to-blue-700"
          onClick={() => onNavigate('chat')}
        />
        <ActionCard
          icon={User}
          title="View Profile"
          description="Track progress, quests, and achievements"
          gradient="from-green-600 to-emerald-700"
          onClick={() => onNavigate('profile')}
        />
      </div>

      <div className="mt-16 grid grid-cols-4 gap-6">
        <StatCard number="5+" label="CS Topics" />
        <StatCard number="100%" label="Offline Ready" />
        <StatCard number="AI" label="Powered" />
        <StatCard number="∞" label="Possibilities" />
      </div>
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

function FeatureCard({ icon: Icon, title, description, gradient }) {
  return (
    <div className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className={`bg-gradient-to-br ${gradient} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="text-white" size={24} />
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
    </div>
  )
}

function ActionCard({ icon: Icon, title, description, gradient, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 text-left text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 group`}
    >
      <Icon className="mb-4 group-hover:scale-110 transition-transform" size={40} />
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-white/90">{description}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
        Get Started →
      </div>
    </button>
  )
}

function StatCard({ number, label }) {
  return (
    <div className="rounded-xl p-6 text-center shadow-md" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-accent-blue)' }}>
        {number}
      </div>
      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
    </div>
  )
}

export default App
