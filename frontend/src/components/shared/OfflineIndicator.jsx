import { Cloud, CloudOff, Wifi, WifiOff } from 'lucide-react'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { cn } from '../../utils/cn'

export default function OfflineIndicator() {
  const network = useNetworkStatus()

  const getConnectionLabel = () => {
    if (!network.isOnline) return 'Offline Mode'
    if (!network.effectiveType) return 'Online'
    return network.effectiveType.toUpperCase()
  }

  const getConnectionColor = () => {
    if (!network.isOnline) return 'text-amber-500'
    if (network.effectiveType === '4g') return 'text-green-500'
    if (network.effectiveType === '3g') return 'text-blue-500'
    if (network.effectiveType === '2g' || network.effectiveType === 'slow-2g') return 'text-orange-500'
    return 'text-gray-500'
  }

  const getIcon = () => {
    if (!network.isOnline) return <CloudOff className="h-4 w-4" />
    if (network.effectiveType === '2g' || network.effectiveType === 'slow-2g') return <WifiOff className="h-4 w-4" />
    return network.isOnline ? <Cloud className="h-4 w-4" /> : <Wifi className="h-4 w-4" />
  }

  return (
    <div className={cn(
      'fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
      'bg-white/90 backdrop-blur-sm shadow-lg border',
      getConnectionColor()
    )} title={`Network: ${getConnectionLabel()}${network.rtt ? ` | RTT: ${network.rtt}ms` : ''}`}>
      {getIcon()}
      <span>{getConnectionLabel()}</span>
      {network.saveData && <span className="text-[10px] opacity-70">(Data Saver)</span>}
    </div>
  )
}
