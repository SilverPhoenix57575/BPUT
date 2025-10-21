// Centralized API configuration - single source of truth
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000, // 1 second
  API_VERSION: 'v1',
}

export const ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/v1/auth/signup',
    LOGIN: '/api/v1/auth/login',
    ME: '/api/v1/auth/me',
  },
  CONTENT: {
    UPLOAD: '/api/v1/content/upload',
    LIST: '/api/v1/content/list',
    GET: (id) => `/api/v1/content/${id}`,
  },
  AI: {
    ENHANCE: '/api/v1/ai/enhance',
    QUESTION: '/api/v1/ai/question',
    QUIZ: '/api/v1/ai/quiz',
    FEEDBACK: '/api/v1/ai/feedback',
    SIMPLIFY: '/api/v1/ai/simplify',
  },
  PROGRESS: {
    SAVE: '/api/v1/progress/save',
    GET: (userId) => `/api/v1/progress/${userId}`,
  },
  CAREER: {
    RECOMMENDATIONS: '/api/v1/career/recommendations',
  },
  ANALYTICS: {
    GET: (userId) => `/api/v1/analytics/${userId}`,
  },
}
