import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/shared/ErrorBoundary.jsx'
import { validateEnv } from './utils/envValidator.js'
import { registerServiceWorker } from './utils/registerSW.js'
import './theme.css'
import './index.css'

console.log('🚀 AI Learning Platform - Initializing...')

try {
  // Validate environment variables
  console.log('✓ Validating environment...')
  const envConfig = validateEnv()
  console.log('✓ Environment validated:', envConfig)

  // Register service worker for offline support
  console.log('✓ Registering service worker...')
  registerServiceWorker()

  // Check if root element exists
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found! Check index.html')
  }
  console.log('✓ Root element found')

  console.log('✓ Rendering React app...')
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
  console.log('✓ React app rendered successfully!')
} catch (error) {
  console.error('❌ FATAL: App initialization failed:', error)
  // Render a basic error message if React fails to initialize
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui; background: #f8fafc;">
      <div style="text-align: center; padding: 2rem; max-width: 500px;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">⚠️ Initialization Error</h1>
        <p style="color: #64748b; margin-bottom: 1rem;">${error.message}</p>
        <p style="color: #94a3b8; font-size: 0.875rem;">Check browser console (F12) for details</p>
        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Reload Page</button>
      </div>
    </div>
  `
}
