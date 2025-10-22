import { useState } from 'react'
import { Mail, Calendar, Settings as SettingsIcon, Award, Github, Linkedin, Share2, Edit, Lock, User as UserIcon, Palette, Brain, Pin, FileText, Trophy } from 'lucide-react'
import useUserStore from '../../stores/userStore'
import useProgressStore from '../../stores/progressStore'
import useGamificationStore from '../../stores/gamificationStore'
import Settings from './Settings'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('showcase')
  const user = useUserStore(state => state.user)
  const { quizzesTaken, masteredCompetencies, totalTimeSpent } = useProgressStore()
  const { xp, level, streak, achievements, dailyQuests } = useGamificationStore()
  const [profileData, setProfileData] = useState(null)
  
  useState(() => {
    const saved = localStorage.getItem('user-profile')
    if (saved) {
      setProfileData(JSON.parse(saved))
    }
  }, [])
  
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  
  const xpForNextLevel = level * 100
  const xpProgress = (xp / xpForNextLevel) * 100
  const earnedAchievements = achievements.filter(a => a.earned)

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Profile Header - Decluttered */}
      <div className="rounded-2xl shadow-lg p-8 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
            {(user.name || user.email)?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{user.name || 'Student'}</h1>
            <p className="text-lg text-white/90 mb-3">{profileData?.bio || 'Aspiring Frontend Developer'}</p>
            <div className="flex items-center gap-3">
              <a href="#" className="flex items-center gap-1 text-white/80 hover:text-white transition-colors">
                <Github size={18} />
                <span className="text-sm">GitHub</span>
              </a>
              <a href="#" className="flex items-center gap-1 text-white/80 hover:text-white transition-colors">
                <Linkedin size={18} />
                <span className="text-sm">LinkedIn</span>
              </a>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('settings')}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-white/90 transition-all flex items-center gap-2"
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>
      </div>



      {/* Tabs */}
      <div className="rounded-lg shadow mb-6" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <div className="flex border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
          <TabButton
            label="Showcase"
            active={activeTab === 'showcase'}
            onClick={() => setActiveTab('showcase')}
          />
          <TabButton
            label="Achievements"
            active={activeTab === 'achievements'}
            onClick={() => setActiveTab('achievements')}
          />
          <TabButton
            label="Leaderboard"
            active={activeTab === 'leaderboard'}
            onClick={() => setActiveTab('leaderboard')}
          />
          <TabButton
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>

        <div className="p-6">
          {activeTab === 'showcase' && <ShowcaseTab masteredCompetencies={masteredCompetencies} />}
          {activeTab === 'achievements' && <AchievementsTab achievements={achievements} />}
          {activeTab === 'leaderboard' && <LeaderboardTab currentLevel={level} currentXP={xp} />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-4 font-medium transition-all"
      style={{
        color: active ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)',
        borderBottom: active ? '2px solid var(--color-accent-blue)' : '2px solid transparent'
      }}
    >
      {label}
    </button>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl p-6 shadow-md" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className={`bg-gradient-to-br ${color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
        <Icon className="text-white" size={24} />
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
        {value}
      </div>
      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
    </div>
  )
}

function ShowcaseTab({ masteredCompetencies }) {
  const masteredSkills = ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'REST APIs']
  const pinnedItems = [
    { type: 'note', title: 'React Hooks Deep Dive', date: '2 days ago', icon: '📝' },
    { type: 'project', title: 'E-commerce Dashboard', date: '1 week ago', icon: '🚀' },
    { type: 'achievement', title: 'Quiz Master Badge', date: '3 days ago', icon: '🏆' }
  ]

  return (
    <div className="space-y-8">
      {/* Mastered Skills Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Mastered Skills
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {masteredSkills.map((skill, idx) => (
            <div key={idx} className="p-4 rounded-lg text-center shadow-sm" style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderWidth: '2px',
              borderColor: 'var(--color-accent-blue)'
            }}>
              <div className="text-2xl mb-2">✓</div>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{skill}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pinned Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Pinned Items
          </h3>
          <button className="text-sm px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>
            <Pin size={14} className="inline mr-1" />
            Manage Pins
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {pinnedItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg shadow" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderWidth: '1px',
              borderColor: 'var(--color-border-primary)'
            }}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{item.title}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{item.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shareable Link */}
      <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Share Your Portfolio
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          Create a public link to showcase your skills and achievements
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Share2 size={18} />
          Get Shareable Link
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
      <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ color: 'var(--color-text-primary)' }}>{value}</span>
    </div>
  )
}



function AchievementsTab({ achievements }) {
  const earned = achievements.filter(a => a.earned)
  const inProgress = achievements.filter(a => !a.earned)
  const certificates = [
    { name: 'Frontend Developer Path', completedDate: 'Dec 2024', icon: '🎓' },
    { name: 'React Mastery', completedDate: 'Nov 2024', icon: '🏆' }
  ]

  return (
    <div className="space-y-8">
      {/* Certificates Section */}
      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Certificates</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {certificates.map((cert, idx) => (
            <div key={idx} className="p-6 rounded-lg shadow-lg" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderWidth: '2px',
              borderColor: 'var(--color-accent-blue)'
            }}>
              <div className="text-5xl mb-3">{cert.icon}</div>
              <p className="font-bold text-lg mb-1" style={{ color: 'var(--color-text-primary)' }}>{cert.name}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Completed: {cert.completedDate}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Achievements */}
      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Earned Badges</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {earned.map(achievement => (
            <div key={achievement.id} className="rounded-lg p-4 shadow text-center" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-accent-blue)',
              borderWidth: '2px'
            }}>
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className="font-bold mb-1 text-sm" style={{ color: 'var(--color-text-primary)' }}>{achievement.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* In Progress */}
      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>In Progress</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {inProgress.map(achievement => (
            <div key={achievement.id} className="rounded-lg p-4 shadow text-center" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-primary)',
              borderWidth: '1px'
            }}>
              <div className="text-4xl mb-2 opacity-50">{achievement.icon}</div>
              <p className="font-bold mb-1 text-sm" style={{ color: 'var(--color-text-primary)' }}>{achievement.name}</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-blue-500" style={{ width: `${(achievement.progress / achievement.target) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsTab() {
  const [activeSection, setActiveSection] = useState('public')

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Settings Sidebar */}
      <div className="space-y-2">
        <SettingsNavButton label="Public Profile" icon={UserIcon} active={activeSection === 'public'} onClick={() => setActiveSection('public')} />
        <SettingsNavButton label="Account" icon={Lock} active={activeSection === 'account'} onClick={() => setActiveSection('account')} />
        <SettingsNavButton label="Preferences" icon={Palette} active={activeSection === 'preferences'} onClick={() => setActiveSection('preferences')} />
        <SettingsNavButton label="AI Settings" icon={Brain} active={activeSection === 'ai'} onClick={() => setActiveSection('ai')} />
      </div>

      {/* Settings Content */}
      <div className="md:col-span-3">
        {activeSection === 'public' && <PublicProfileSettings />}
        {activeSection === 'account' && <AccountSettings />}
        {activeSection === 'preferences' && <PreferencesSettings />}
        {activeSection === 'ai' && <AISettings />}
      </div>
    </div>
  )
}

function SettingsNavButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3"
      style={{
        backgroundColor: active ? 'var(--color-accent-blue)' : 'var(--color-bg-secondary)',
        color: active ? '#ffffff' : 'var(--color-text-primary)'
      }}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  )
}

function PublicProfileSettings() {
  const { user, setUser } = useUserStore()
  const [displayName, setDisplayName] = useState(user.name || '')
  const [bio, setBio] = useState('Aspiring Frontend Developer')
  const [github, setGithub] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaving(true)
    // Update user store
    setUser({ ...user, name: displayName })
    // Save to localStorage
    localStorage.setItem('user-profile', JSON.stringify({ displayName, bio, github, linkedin }))
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Public Profile</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Display Name</label>
          <input 
            type="text" 
            placeholder="Your Name" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg" 
            style={{ backgroundColor: 'var(--color-bg-secondary)', borderWidth: '1px', borderColor: 'var(--color-border-primary)', color: 'var(--color-text-primary)' }} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Bio / Headline</label>
          <textarea 
            rows="3" 
            placeholder="Aspiring Frontend Developer" 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 rounded-lg" 
            style={{ backgroundColor: 'var(--color-bg-secondary)', borderWidth: '1px', borderColor: 'var(--color-border-primary)', color: 'var(--color-text-primary)' }} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>GitHub URL</label>
          <input 
            type="url" 
            placeholder="https://github.com/username" 
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className="w-full px-4 py-2 rounded-lg" 
            style={{ backgroundColor: 'var(--color-bg-secondary)', borderWidth: '1px', borderColor: 'var(--color-border-primary)', color: 'var(--color-text-primary)' }} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>LinkedIn URL</label>
          <input 
            type="url" 
            placeholder="https://linkedin.com/in/username" 
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className="w-full px-4 py-2 rounded-lg" 
            style={{ backgroundColor: 'var(--color-bg-secondary)', borderWidth: '1px', borderColor: 'var(--color-border-primary)', color: 'var(--color-text-primary)' }} 
          />
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function AccountSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Account Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
          <input type="email" placeholder="your@email.com" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderWidth: '1px', borderColor: 'var(--color-border-primary)', color: 'var(--color-text-primary)' }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Change Password</label>
          <input type="password" placeholder="New password" className="w-full px-4 py-2 rounded-lg mb-2" style={{ backgroundColor: 'var(--color-bg-secondary)', borderWidth: '1px', borderColor: 'var(--color-border-primary)', color: 'var(--color-text-primary)' }} />
          <input type="password" placeholder="Confirm password" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)', borderWidth: '1px', borderColor: 'var(--color-border-primary)', color: 'var(--color-text-primary)' }} />
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Update Account</button>
        <div className="pt-6 border-t" style={{ borderColor: 'var(--color-border-primary)' }}>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete Account</button>
        </div>
      </div>
    </div>
  )
}

function PreferencesSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <div>
            <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Dark Mode</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Toggle dark/light theme</p>
          </div>
          <input type="checkbox" className="w-12 h-6" />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <div>
            <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Email Notifications</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Receive updates via email</p>
          </div>
          <input type="checkbox" className="w-12 h-6" defaultChecked />
        </div>
      </div>
    </div>
  )
}

function AISettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>AI Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <div>
            <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Enable Emotion Detection</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>AI analyzes your learning emotions</p>
          </div>
          <input type="checkbox" className="w-12 h-6" defaultChecked />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <div>
            <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Enable Text Friction Monitoring</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Detects when you're struggling with topics</p>
          </div>
          <input type="checkbox" className="w-12 h-6" defaultChecked />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <div>
            <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Personalized Recommendations</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Get AI-powered learning suggestions</p>
          </div>
          <input type="checkbox" className="w-12 h-6" defaultChecked />
        </div>
      </div>
    </div>
  )
}

function LeaderboardTab({ currentLevel, currentXP }) {
  const [view, setView] = useState('global')
  
  const globalLeaderboard = [
    { rank: 1, name: 'Alex Chen', level: 15, xp: 2450, avatar: '👨💻' },
    { rank: 2, name: 'Sarah Kim', level: 14, xp: 2100, avatar: '👩🎓' },
    { rank: 3, name: 'You', level: currentLevel, xp: currentXP, avatar: '🎯', isCurrentUser: true },
    { rank: 4, name: 'Mike Johnson', level: 12, xp: 1800, avatar: '👨🔬' },
    { rank: 5, name: 'Emma Davis', level: 11, xp: 1650, avatar: '👩💼' }
  ]

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('global')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'global' ? 'bg-blue-600 text-white' : ''}`}
          style={view !== 'global' ? { backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' } : {}}
        >
          Global
        </button>
        <button
          onClick={() => setView('class')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'class' ? 'bg-blue-600 text-white' : ''}`}
          style={view !== 'class' ? { backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' } : {}}
        >
          My Class
        </button>
      </div>

      <div className="rounded-lg shadow overflow-hidden" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        {globalLeaderboard.map(user => (
          <div 
            key={user.rank} 
            className={`p-4 border-b flex items-center gap-4`}
            style={{ 
              borderColor: 'var(--color-border-primary)',
              backgroundColor: user.isCurrentUser ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
            }}
          >
            <div className="text-2xl font-bold w-8" style={{ color: 'var(--color-text-tertiary)' }}>
              {user.rank}
            </div>
            <div className="text-3xl">{user.avatar}</div>
            <div className="flex-1">
              <p className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {user.name} {user.isCurrentUser && '(You)'}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Level {user.level} • {user.xp} XP
              </p>
            </div>
            {user.rank <= 3 && (
              <div className="text-2xl">
                {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
