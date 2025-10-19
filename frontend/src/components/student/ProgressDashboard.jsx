import { BookOpen, TrendingUp, Award, Target } from 'lucide-react'
import useProgressStore from '../../stores/progressStore'
import useCompetencyStore from '../../stores/competencyStore'

export default function ProgressDashboard() {
  const masteryLevels = useProgressStore(state => state.masteryLevels)
  const competencyGraph = useCompetencyStore(state => state.competencyGraph)

  const overallProgress = Object.values(masteryLevels).length > 0
    ? Math.round((Object.values(masteryLevels).reduce((a, b) => a + b, 0) / competencyGraph.nodes.length) * 100)
    : 0

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Your Learning Progress
        </h2>
        <p className="text-gray-600">Track your mastery across all competencies</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Target}
          label="Overall Progress"
          value={`${overallProgress}%`}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={BookOpen}
          label="Topics Mastered"
          value={Object.values(masteryLevels).filter(m => m > 0.95).length}
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={TrendingUp}
          label="In Progress"
          value={Object.values(masteryLevels).filter(m => m > 0 && m <= 0.95).length}
          gradient="from-yellow-500 to-orange-500"
        />
        <StatCard
          icon={Award}
          label="Badges Earned"
          value={Object.values(masteryLevels).filter(m => m > 0.95).length}
          gradient="from-purple-500 to-pink-500"
        />
      </div>

      {/* Competency Cards */}
      <div className="grid gap-4">
        {competencyGraph.nodes.map(node => {
          const mastery = masteryLevels[node.id] || 0
          const percentage = Math.round(mastery * 100)

          return (
            <div key={node.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{node.name}</h3>
                  {node.prerequisites.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Prerequisites: {node.prerequisites.join(', ')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    percentage >= 95 ? 'text-green-600' :
                    percentage >= 70 ? 'text-blue-600' :
                    percentage >= 40 ? 'text-yellow-600' : 'text-gray-400'
                  }`}>
                    {percentage}%
                  </div>
                  <div className="text-xs text-gray-500">Mastery</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div
                  className={`h-4 rounded-full transition-all ${
                    percentage >= 95 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    percentage >= 70 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                    percentage >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                    'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex gap-2">
                {percentage >= 95 ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    ✓ Mastered
                  </span>
                ) : percentage >= 40 ? (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    In Progress
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    Not Started
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, gradient }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className={`bg-gradient-to-br ${gradient} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
        <Icon className="text-white" size={24} />
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}
