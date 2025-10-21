import { useState } from 'react'
import { Mail, Calendar, Settings as SettingsIcon, TrendingUp, Flame, Award } from 'lucide-react'
import useUserStore from '../../stores/userStore'
import useProgressStore from '../../stores/progressStore'
import useGamificationStore from '../../stores/gamificationStore'
import ProgressDashboard from './ProgressDashboard'
import QuestTracker from '../gamification/QuestTracker'
import BadgeDisplay from '../gamification/BadgeDisplay'
import Settings from './Settings'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview')
  const user = useUserStore(state => state.user)
  const { quizzesTaken, masteredCompetencies, totalTimeSpent } = useProgressStore()
  const { xp, level, streak, achievements, dailyQuests } = useGamificationStore()
  
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
      {/* Profile Header */}
      <div className="rounded-2xl shadow-lg p-8 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
            {(user.name || user.email)?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{user.name || 'Student'}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-6 shadow" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Level</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{level}</p>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              <span>{xp} XP</span>
              <span>{xpForNextLevel} XP</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl p-6 shadow" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <Flame className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Streak</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{streak} days</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-6 shadow" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <Award className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Achievements</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {earnedAchievements.length}/{achievements.length}
              </p>
            </div>
          </div>
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
            label="Overview"
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            label="Progress"
            active={activeTab === 'progress'}
            onClick={() => setActiveTab('progress')}
          />
          <TabButton
            label="Quests"
            active={activeTab === 'quests'}
            onClick={() => setActiveTab('quests')}
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
          {activeTab === 'overview' && <OverviewTab user={user} />}
          {activeTab === 'progress' && <ProgressDashboard />}
          {activeTab === 'quests' && <QuestsTab dailyQuests={dailyQuests} />}
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

function OverviewTab({ user }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Account Information
        </h3>
        <div className="space-y-3">
          <InfoRow label="Name" value={user.name || 'Not set'} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Role" value={user.role || 'Student'} />
          <InfoRow label="User ID" value={user.userId || user.id || 'N/A'} />
        </div>
      </div>

      <div className="pt-6 border-t" style={{ borderColor: 'var(--color-border-primary)' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Quick Actions
        </h3>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <SettingsIcon size={18} />
            Edit Profile
          </button>
        </div>
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

function QuestsTab({ dailyQuests }) {
  return (
    <div className="space-y-3">
      {dailyQuests.map(quest => (
        <div key={quest.id} className="rounded-lg p-4 shadow" style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{quest.name}</p>
              {quest.target && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-xs">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {quest.progress}/{quest.target}
                  </span>
                </div>
              )}
            </div>
            <div className="text-right">
              {quest.completed ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  ✓ Complete
                </span>
              ) : (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  +{quest.xp} XP
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AchievementsTab({ achievements }) {
  const earned = achievements.filter(a => a.earned)
  const inProgress = achievements.filter(a => !a.earned)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Earned</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {earned.map(achievement => (
            <div key={achievement.id} className="rounded-lg p-4 shadow text-center" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-accent-blue)',
              borderWidth: '2px'
            }}>
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className="font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{achievement.name}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>In Progress</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {inProgress.map(achievement => (
            <div key={achievement.id} className="rounded-lg p-4 shadow text-center" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-primary)',
              borderWidth: '1px'
            }}>
              <div className="text-4xl mb-2 opacity-50">{achievement.icon}</div>
              <p className="font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{achievement.name}</p>
              <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>{achievement.description}</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                {achievement.progress}/{achievement.target}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsTab() {
  return <Settings />
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
