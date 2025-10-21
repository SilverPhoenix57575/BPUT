import { Loader2 } from 'lucide-react'

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
      <p className="text-lg font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
        {message}
      </p>
    </div>
  )
}

export function LoadingOverlay({ message = 'Processing...' }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl">
        <LoadingState message={message} />
      </div>
    </div>
  )
}

export function InlineLoader({ size = 20 }) {
  return <Loader2 className="animate-spin text-blue-600" size={size} />
}
