// Centralized API configuration - single source of truth
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000, // 1 second
}

export const ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
  },
  CONTENT: {
    UPLOAD: '/api/content/upload',
    LIST: '/api/content/list',
    GET: (id) => `/api/content/${id}`,
  },
  AI: {
    ENHANCE: '/api/ai/enhance',
    QUESTION: '/api/ai/question',
    QUIZ: '/api/ai/quiz',
    FEEDBACK: '/api/ai/feedback',
    SIMPLIFY: '/api/ai/simplify',
  },
  PROGRESS: {
    SAVE: '/api/progress/save',
    GET: (userId) => `/api/progress/${userId}`,
  },
  CAREER: {
    RECOMMENDATIONS: '/api/career/recommendations',
  },
  ANALYTICS: {
    GET: (userId) => `/api/analytics/${userId}`,
  },
}
