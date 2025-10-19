import useProgressStore from '../../stores/progressStore'
import useCompetencyStore from '../../stores/competencyStore'

export default function ProgressDashboard() {
  const masteryLevels = useProgressStore(state => state.masteryLevels)
  const competencyGraph = useCompetencyStore(state => state.competencyGraph)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Progress</h2>

      <div className="grid gap-4">
        {competencyGraph.nodes.map(node => {
          const mastery = masteryLevels[node.id] || 0
          const percentage = Math.round(mastery * 100)

          return (
            <div key={node.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{node.name}</h3>
                <span className="text-sm font-bold text-blue-600">{percentage}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all ${
                    percentage >= 95 ? 'bg-green-600' :
                    percentage >= 70 ? 'bg-blue-600' :
                    percentage >= 40 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex gap-2 text-xs text-gray-600">
                {node.prerequisites.length > 0 && (
                  <span>Prerequisites: {node.prerequisites.join(', ')}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
