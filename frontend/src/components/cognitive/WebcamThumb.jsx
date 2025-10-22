import { useState, useRef, useEffect } from 'react'
import { Camera, CameraOff } from 'lucide-react'
import { cn } from '../../utils/cn'

export const WebcamThumb = ({ onSnapshot, className }) => {
  const [enabled, setEnabled] = useState(false)
  const [stream, setStream] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const toggleWebcam = async () => {
    if (enabled && stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setEnabled(false)
    } else {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        })
        setStream(mediaStream)
        setEnabled(true)
      } catch (error) {
        console.error('Webcam access denied:', error)
      }
    }
  }

  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      onSnapshot?.(dataUrl)
    }
  }

  useEffect(() => {
    if (enabled) {
      const interval = setInterval(captureSnapshot, 3000)
      return () => clearInterval(interval)
    }
  }, [enabled])

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [stream])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !stream) return

    video.srcObject = stream
    video.muted = true
    video.playsInline = true
    video.play().catch(() => {})
  }, [stream])

  return (
    <div className={cn('space-y-2', className)}>
      <button onClick={toggleWebcam} className={cn('w-full rounded-xl p-3 flex items-center justify-center gap-2 hover:opacity-90 transition-smooth')} style={{
        backgroundColor: enabled ? '#8b5cf6' : 'var(--color-bg-secondary)',
        color: enabled ? 'white' : 'var(--color-text-primary)'
      }}>
        {enabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
        <span className="text-sm font-medium">{enabled ? 'Webcam Active' : 'Enable Webcam'}</span>
      </button>

      {enabled && (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  )
}
