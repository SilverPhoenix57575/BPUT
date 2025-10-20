export default function ProgressRing({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8, 
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  showPercentage = true,
  label = ''
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease'
            }}
          />
        </svg>
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-sm font-medium text-center" style={{ color: 'var(--color-text-secondary)' }}>
          {label}
        </span>
      )}
    </div>
  )
}
