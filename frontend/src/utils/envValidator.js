// Environment variable validation
export function validateEnv() {
  const required = ['VITE_API_URL']
  const missing = []
  
  required.forEach(key => {
    if (!import.meta.env[key]) {
      missing.push(key)
    }
  })
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`)
    console.warn('Using default values. Set these in .env file for production.')
  }
  
  return {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    isValid: missing.length === 0
  }
}
