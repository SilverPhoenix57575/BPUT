import { Brain, AlertCircle, Zap } from 'lucide-react'
import { cn } from '../../utils/cn'

const stateConfig = {
  FOCUSED: {
    label: 'Focused',
    description: "You're engaged and learning effectively",
    bgClass: 'bg-green-100 dark:bg-green-900/20',
    textClass: 'text-green-700 dark:text-green-400',
    ringClass: 'ring-green-500/50',
    icon: Zap
  },
  CONFUSED: {
    label: 'Confused',
    description: 'Let me help clarify with a different approach',
    bgClass: 'bg-amber-100 dark:bg-amber-900/20',
    textClass: 'text-amber-700 dark:text-amber-400',
    ringClass: 'ring-amber-500/50',
    icon: AlertCircle
  },
  FRUSTRATED: {
    label: 'Frustrated',
    description: "Let's try a hands-on interactive example",
    bgClass: 'bg-red-100 dark:bg-red-900/20',
    textClass: 'text-red-700 dark:text-red-400',
    ringClass: 'ring-red-500/50',
    icon: Brain
  }
}

export const StateBadgeDetailed = ({ state, className }) => {
  const config = stateConfig[state]
  const Icon = config.icon

  return (
    <div className={cn('flex items-start gap-2 rounded-xl p-3 ring-1', config.bgClass, config.ringClass, className)}>
      <div className={cn('rounded-full p-1.5', config.bgClass)}>
        <Icon className={cn('h-5 w-5', config.textClass)} />
      </div>
      <div className="flex-1">
        <h3 className={cn('font-semibold text-sm', config.textClass)}>{config.label}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{config.description}</p>
      </div>
    </div>
  )
}
