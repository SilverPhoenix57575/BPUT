import { StateBadgeDetailed } from './StateBadge'
import { useCognitiveStore, useMetricsStore } from '../../stores/cognitiveStore'
import { WebcamThumb } from './WebcamThumb'
import { Activity, Brain, Mic2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

export const CognitiveMonitor = () => {
  const { currentState, events, setState } = useCognitiveStore()
  const { facialExpression, vocalState, textFriction, frictionIntensity, setFrictionIntensity, facialCandidates, vocalCandidates } = useMetricsStore()

  const recentEvents = events.slice(-5).reverse()

  const rafRef = useRef(null)
  useEffect(() => {
    const step = () => {
      setFrictionIntensity(frictionIntensity * 0.92)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [frictionIntensity, setFrictionIntensity])

  useEffect(() => {
    let score = 0
    if (textFriction.rephraseCount > 1) score += 3
    if (textFriction.backspaceCount > 10) score += 2
    if (textFriction.backspaceCount > 20) score += 3
    if (vocalState === 'frustrated') { setState('FRUSTRATED'); return }
    if (vocalState === 'stressed') score += 4
    if (vocalState === 'hesitant') score += 3
    if (facialExpression === 'sad') { setState('CONFUSED'); return }
    if (['fear','angry','frustrated'].includes(String(facialExpression))) score += 3
    else if (facialExpression === 'surprise') score += 1

    if (score >= 8) setState('FRUSTRATED')
    else if (score >= 4) setState('CONFUSED')
    else setState('FOCUSED')
  }, [facialExpression, vocalState, textFriction.rephraseCount, textFriction.backspaceCount, setState])

  return (
    <div className="glass-strong rounded-3xl elevated p-6 h-full flex flex-col gap-4 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderWidth: '1px' }}>
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>Cognitive Monitor</h2>
      </div>

      <StateBadgeDetailed state={currentState} className="scale-95" />

      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Live Metrics</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div style={{ color: 'var(--color-text-secondary)' }}>Facial</div>
            <div className="font-medium capitalize" style={{ color: 'var(--color-text-primary)' }}>{facialExpression ?? 'n/a'}</div>
            {facialCandidates && facialCandidates.length > 0 && (
              <div className="mt-1 space-y-1">
                {facialCandidates.map((c) => (
                  <div key={c.label} className="flex items-center gap-2 text-[10px] capitalize">
                    <span className="w-14" style={{ color: 'var(--color-text-secondary)' }}>{c.label}</span>
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600" style={{ width: `${Math.round(c.score * 100)}%` }} />
                    </div>
                    <span className="w-8 text-right" style={{ color: 'var(--color-text-primary)' }}>{Math.round(c.score * 100)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div style={{ color: 'var(--color-text-secondary)' }}>Vocal</div>
            <div className="font-medium capitalize" style={{ color: 'var(--color-text-primary)' }}>{vocalState ?? 'n/a'}</div>
            {vocalCandidates && vocalCandidates.length > 0 && (
              <div className="mt-1 space-y-1">
                {vocalCandidates.map((c) => (
                  <div key={c.label} className="flex items-center gap-2 text-[10px] capitalize">
                    <span className="w-14" style={{ color: 'var(--color-text-secondary)' }}>{c.label}</span>
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: `${Math.round(c.score * 100)}%` }} />
                    </div>
                    <span className="w-8 text-right" style={{ color: 'var(--color-text-primary)' }}>{Math.round(c.score * 100)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div style={{ color: 'var(--color-text-secondary)' }}>Text friction</div>
            <div className="font-medium" style={{ color: 'var(--color-text-primary)' }}>R:{textFriction.rephraseCount} B:{textFriction.backspaceCount}</div>
          </div>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="h-full bg-purple-600 transition-all duration-150" style={{ width: `${Math.round(frictionIntensity * 100)}%` }} />
        </div>
      </div>

      <WebcamThumb className="shrink-0" onSnapshot={async (image) => {
        try {
          // Placeholder - integrate with your backend API
          console.log('Captured snapshot for facial analysis')
        } catch (e) {
          console.error('Facial analysis error:', e)
        }
      }} />

      <div className="flex-1 min-h-0 overflow-auto">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          <Activity className="h-4 w-4" />
          Recent Activity
        </h3>
        <div className="space-y-2">
          {recentEvents.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No activity yet</p>
          ) : (
            recentEvents.map((event) => (
              <div key={event.id} className="text-xs p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{event.type}</span>
                <span className="ml-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
