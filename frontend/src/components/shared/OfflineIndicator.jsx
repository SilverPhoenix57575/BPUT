import { useState, useEffect } from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import offlineStorage from '../../services/pouchdb'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg shadow-lg animate-pulse">
      <WifiOff size={20} />
      <span className="font-semibold">Offline Mode</span>
    </div>
  )
}
