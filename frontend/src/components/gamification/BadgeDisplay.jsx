import useProgressStore from '../../stores/progressStore'

const badges = {
  cs_001: { name: "Variable Master", icon: "🎯", description: "Mastered variables" },
  cs_002: { name: "Control Flow Champion", icon: "🔄", description: "Conquered loops" },
  cs_003: { name: "Function Expert", icon: "⚡", description: "Function mastery" },
  cs_004: { name: "Recursion Wizard", icon: "🧙", description: "Recursion unlocked" },
  cs_005: { name: "Array Ace", icon: "📊", description: "Array operations mastered" }
}

export default function BadgeDisplay() {
  const masteryLevels = useProgressStore(state => state.masteryLevels)

  const earnedBadges = Object.entries(masteryLevels)
    .filter(([id, level]) => level > 0.95)
    .map(([id]) => badges[id])
    .filter(Boolean)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Badges</h2>
      
      {earnedBadges.length === 0 ? (
        <p className="text-gray-600">Complete competencies to earn badges!</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {earnedBadges.map(badge => (
            <div key={badge.name} className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 text-center">
              <div className="text-5xl mb-3">{badge.icon}</div>
              <h3 className="font-bold text-white mb-1">{badge.name}</h3>
              <p className="text-xs text-white/80">{badge.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
