import { useState } from 'react'
import { BookOpen, Upload, BarChart, Award, Home, Sparkles, Brain, Target, Zap, LogOut, GraduationCap, ClipboardCheck } from 'lucide-react'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import ContentUpload from './components/student/ContentUpload'
import LearningInterface from './components/student/LearningInterface'
import QuizView from './components/student/QuizView'
import ProgressDashboard from './components/student/ProgressDashboard'
import BadgeDisplay from './components/gamification/BadgeDisplay'
import useUserStore from './stores/userStore'
import useContentStore from './stores/contentStore'

function App() {
  const [authView, setAuthView] = useState('signin')
  const { user, setUser, logout } = useUserStore()
  const [activeView, setActiveView] = useState('home')
  const currentContent = useContentStore(state => state.currentContent)

  const handleSignIn = (credentials) => {
    setUser({ id: 'user_123', email: credentials.email, role: 'student' })
  }

  const handleSignUp = (userData) => {
    setUser({ id: 'user_' + Date.now(), ...userData })
  }

  if (!user) {
    return authView === 'signin' 
      ? <SignIn onSignIn={handleSignIn} onSwitchToSignUp={() => setAuthView('signup')} />
      : <SignUp onSignUp={handleSignUp} onSwitchToSignIn={() => setAuthView('signin')} />
  }

  const renderContent = () => {
    switch(activeView) {
      case 'upload':
        return <ContentUpload />
      case 'learn':
        return <LearningInterface content={currentContent} />
      case 'quiz':
        return <QuizView contentId={currentContent?.id || 'demo'} competencyId="cs_001" />
      case 'progress':
        return <ProgressDashboard />
      case 'badges':
        return <BadgeDisplay />
      default:
        return <HomePage onNavigate={setActiveView} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <Brain className="text-white" size={28} />
              </div>
              <div>
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Learning
                </span>
                <p className="text-xs text-gray-500">Welcome, {user.name || user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <NavButton icon={Home} label="Home" active={activeView === 'home'} onClick={() => setActiveView('home')} />
              <NavButton icon={Upload} label="Upload" active={activeView === 'upload'} onClick={() => setActiveView('upload')} />
              <NavButton icon={GraduationCap} label="Learn" active={activeView === 'learn'} onClick={() => setActiveView('learn')} />
              <NavButton icon={ClipboardCheck} label="Quiz" active={activeView === 'quiz'} onClick={() => setActiveView('quiz')} />
              <NavButton icon={BarChart} label="Progress" active={activeView === 'progress'} onClick={() => setActiveView('progress')} />
              <NavButton icon={Award} label="Badges" active={activeView === 'badges'} onClick={() => setActiveView('badges')} />
              <button
                onClick={logout}
                className="ml-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
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
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
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
          icon={Upload}
          title="Upload Content"
          description="PDF, Documents, Images, YouTube - we handle it all"
          gradient="from-blue-600 to-blue-700"
          onClick={() => onNavigate('upload')}
        />
        <ActionCard
          icon={BarChart}
          title="Track Progress"
          description="Visualize your mastery across all competencies"
          gradient="from-green-600 to-emerald-700"
          onClick={() => onNavigate('progress')}
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
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
        active 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}

function FeatureCard({ icon: Icon, title, description, gradient }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:-translate-y-1">
      <div className={`bg-gradient-to-br ${gradient} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="text-white" size={24} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
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
    <div className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-100">
      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
        {number}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}

export default App
