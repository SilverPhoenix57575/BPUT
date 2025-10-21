import { useState } from 'react'
import { User, Mail, Calendar, BarChart, Trophy, Award, Settings } from 'lucide-react'
import useUserStore from '../../stores/userStore'
import useProgressStore from '../../stores/progressStore'
import ProgressDashboard from './ProgressDashboard'
import QuestTracker from '../gamification/QuestTracker'
import BadgeDisplay from '../gamification/BadgeDisplay'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview')
  const user = useUserStore(state => state.user)
  const { quizzesTaken, masteredCompetencies, totalTimeSpent } = useProgressStore()

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
                <span>Joined {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <StatCard
          icon={BarChart}
          label="Quizzes Taken"
          value={quizzesTaken}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={Award}
          label="Topics Mastered"
          value={masteredCompetencies}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={Trophy}
          label="Study Time"
          value={formatTime(totalTimeSpent)}
          color="from-purple-500 to-pink-500"
        />
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
            label="Badges"
            active={activeTab === 'badges'}
            onClick={() => setActiveTab('badges')}
          />
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab user={user} />}
          {activeTab === 'progress' && <ProgressDashboard />}
          {activeTab === 'quests' && <QuestTracker />}
          {activeTab === 'badges' && <BadgeDisplay />}
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
            <Settings size={18} />
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
