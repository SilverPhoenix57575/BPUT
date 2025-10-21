import { Award, Lock, Star, Trophy } from 'lucide-react'
import useProgressStore from '../../stores/progressStore'

const badges = {
  cs_001: { name: "Variable Master", icon: "🎯", description: "Mastered variables and data types", color: "from-blue-500 to-cyan-500" },
  cs_002: { name: "Control Flow Champion", icon: "🔄", description: "Conquered loops and conditionals", color: "from-purple-500 to-pink-500" },
  cs_003: { name: "Function Expert", icon: "⚡", description: "Function mastery achieved", color: "from-yellow-500 to-orange-500" },
  cs_004: { name: "Recursion Wizard", icon: "🧙", description: "Unlocked the power of recursion", color: "from-green-500 to-emerald-500" },
  cs_005: { name: "Array Ace", icon: "📊", description: "Array operations mastered", color: "from-red-500 to-pink-500" }
}

export default function BadgeDisplay() {
  const masteryLevels = useProgressStore(state => state.masteryLevels)

  const earnedBadges = Object.entries(masteryLevels)
    .filter(([id, level]) => level > 0.95)
    .map(([id]) => ({ id, ...badges[id] }))
    .filter(badge => badge.name)

  const lockedBadges = Object.keys(badges)
    .filter(id => !masteryLevels[id] || masteryLevels[id] <= 0.95)
    .map(id => ({ id, ...badges[id] }))

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Your Achievements
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Earn badges by mastering competencies</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl p-6 shadow-xl" style={{ backgroundColor: 'var(--color-accent-blue)', color: '#ffffff' }}>
          <Trophy size={40} className="mb-3" />
          <div className="text-4xl font-bold mb-1">{earnedBadges.length}</div>
          <div style={{ opacity: 0.9 }}>Badges Earned</div>
        </div>
        <div className="rounded-2xl p-6 shadow-xl" style={{ backgroundColor: 'var(--color-accent-purple)', color: '#ffffff' }}>
          <Star size={40} className="mb-3" />
          <div className="text-4xl font-bold mb-1">{lockedBadges.length}</div>
          <div style={{ opacity: 0.9 }}>To Unlock</div>
        </div>
        <div className="rounded-2xl p-6 shadow-xl" style={{ backgroundColor: 'var(--color-success)', color: '#ffffff' }}>
          <Award size={40} className="mb-3" />
          <div className="text-4xl font-bold mb-1">{Math.round((earnedBadges.length / Object.keys(badges).length) * 100)}%</div>
          <div className="text-white/90">Completion</div>
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Earned Badges</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {earnedBadges.map(badge => (
              <div key={badge.id} className={`bg-gradient-to-br ${badge.color} rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-all`}>
                <div className="text-6xl mb-4 text-center">{badge.icon}</div>
                <h4 className="text-xl font-bold mb-2 text-center">{badge.name}</h4>
                <p className="text-white/90 text-sm text-center">{badge.description}</p>
                <div className="mt-4 text-center">
                  <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Unlocked
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Locked Badges</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {lockedBadges.map(badge => (
              <div key={badge.id} className="rounded-2xl p-6 border-2 relative overflow-hidden" style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)'
              }}>
                <div className="absolute top-4 right-4">
                  <Lock className="text-gray-400" size={24} />
                </div>
                <div className="text-6xl mb-4 text-center opacity-30 grayscale">{badge.icon}</div>
                <h4 className="text-xl font-bold mb-2 text-center" style={{ color: 'var(--color-text-secondary)' }}>{badge.name}</h4>
                <p className="text-sm text-center" style={{ color: 'var(--color-text-tertiary)' }}>{badge.description}</p>
                <div className="mt-4 text-center">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{
                    backgroundColor: 'var(--color-bg-tertiary)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    Complete {badge.id} to unlock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {earnedBadges.length === 0 && (
        <div className="text-center py-12">
          <Award className="mx-auto mb-4 text-gray-300" size={80} />
          <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-secondary)' }}>No Badges Yet</h3>
          <p style={{ color: 'var(--color-text-tertiary)' }}>Complete competencies to earn your first badge!</p>
        </div>
      )}
    </div>
  )
}
