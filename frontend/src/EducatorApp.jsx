import { useState } from 'react'
import { Brain, LogOut, Users, BookOpen, BarChart3, MessageSquare, User, Settings } from 'lucide-react'
import ThemeToggle from './components/shared/ThemeToggle'
import TeacherDashboard from './components/educator/TeacherDashboard'
import MyClasses from './components/educator/MyClasses'
import QuizCreator from './components/educator/QuizCreator'
import TeacherAnalytics from './components/educator/TeacherAnalytics'
import Messages from './components/educator/Messages'
import TeacherProfile from './components/educator/TeacherProfile'
import useUserStore from './stores/userStore'

export default function EducatorApp() {
  const [activeView, setActiveView] = useState('dashboard')
  const { user, logout } = useUserStore()

  const renderContent = () => {
    switch(activeView) {
      case 'classes': return <MyClasses />
      case 'quizzes': return <QuizCreator />
      case 'analytics': return <TeacherAnalytics />
      case 'messages': return <Messages />
      case 'profile': return <TeacherProfile />
      default: return <TeacherDashboard />
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
            <button onClick={() => setActiveView('dashboard')} className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-xl">
                <Brain className="text-white" size={28} />
              </div>
              <div>
                <span className="font-bold text-2xl" style={{ color: 'var(--color-text-primary)' }}>
                  Teacher Portal
                </span>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {user.name || user.email?.split('@')[0]}
                </p>
              </div>
            </button>
            
            <div className="flex items-center gap-2">
              <NavButton icon={Users} label="My Classes" active={activeView === 'classes'} onClick={() => setActiveView('classes')} />
              <NavButton icon={BookOpen} label="Quizzes" active={activeView === 'quizzes'} onClick={() => setActiveView('quizzes')} />
              <NavButton icon={BarChart3} label="Analytics" active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} />
              <NavButton icon={MessageSquare} label="Messages" active={activeView === 'messages'} onClick={() => setActiveView('messages')} />
              <NavButton icon={User} label="Profile" active={activeView === 'profile'} onClick={() => setActiveView('profile')} />
              <ThemeToggle />
              <button onClick={logout} className="ml-2 px-4 py-2 text-red-600 rounded-xl transition-all flex items-center gap-2">
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
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}
