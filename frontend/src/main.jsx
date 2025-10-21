import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/shared/ErrorBoundary.jsx'
import { validateEnv } from './utils/envValidator.js'
import { registerServiceWorker } from './utils/registerSW.js'
import './theme.css'
import './index.css'

// Validate environment variables
validateEnv()

// Register service worker for offline support
registerServiceWorker()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
