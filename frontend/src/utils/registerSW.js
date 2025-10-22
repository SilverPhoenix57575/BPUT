export function registerServiceWorker() {
  // Disable service worker in development to prevent cache issues
  if (import.meta.env.MODE === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered:', registration.scope)
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error)
        })
    })
  } else {
    console.log('Service Worker disabled in development mode')
  }
}
