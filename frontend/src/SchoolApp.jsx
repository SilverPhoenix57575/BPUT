import { useState } from 'react'
import { Brain, LogOut, Users, School, BarChart3, Settings, User } from 'lucide-react'
import ThemeToggle from './components/shared/ThemeToggle'
import SchoolDashboard from './components/school/SchoolDashboard'
import TeacherManagement from './components/school/TeacherManagement'
import ClassroomManagement from './components/school/ClassroomManagement'
import StudentManagement from './components/school/StudentManagement'
import SchoolAnalytics from './components/school/SchoolAnalytics'
import SchoolSettings from './components/school/SchoolSettings'
import useUserStore from './stores/userStore'

export default function SchoolApp() {
  const [activeView, setActiveView] = useState('dashboard')
  const { user, logout } = useUserStore()

  const renderContent = () => {
    switch(activeView) {
      case 'teachers': return <TeacherManagement />
      case 'classrooms': return <ClassroomManagement />
      case 'students': return <StudentManagement />
      case 'analytics': return <SchoolAnalytics />
      case 'settings': return <SchoolSettings />
      default: return <SchoolDashboard />
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
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-xl">
                <Brain className="text-white" size={28} />
              </div>
              <div>
                <span className="font-bold text-2xl" style={{ color: 'var(--color-text-primary)' }}>
                  School Portal
                </span>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {user.name || user.email?.split('@')[0]}
                </p>
              </div>
            </button>
            
            <div className="flex items-center gap-2">
              <NavButton icon={Users} label="Teachers" active={activeView === 'teachers'} onClick={() => setActiveView('teachers')} />
              <NavButton icon={School} label="Classrooms" active={activeView === 'classrooms'} onClick={() => setActiveView('classrooms')} />
              <NavButton icon={User} label="Students" active={activeView === 'students'} onClick={() => setActiveView('students')} />
              <NavButton icon={BarChart3} label="Analytics" active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} />
              <NavButton icon={Settings} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
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
