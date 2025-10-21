import axios from 'axios'
import { API_CONFIG, ENDPOINTS } from '../config/api.config'
import { validateEnv } from '../utils/envValidator'

const env = validateEnv()

const api = axios.create({
  baseURL: env.apiUrl,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const contentAPI = {
  upload: (formData) => api.post(ENDPOINTS.CONTENT.UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  list: (userId) => api.get(`${ENDPOINTS.CONTENT.LIST}?userId=${userId}`),
  get: (id) => api.get(ENDPOINTS.CONTENT.GET(id))
}

export const aiAPI = {
  enhance: (text, level) => api.post(ENDPOINTS.AI.ENHANCE, { text, level }),
  question: (data) => api.post(ENDPOINTS.AI.QUESTION, data),
  quiz: (contentId, competencyId, numQuestions) => 
    api.post(ENDPOINTS.AI.QUIZ, { contentId, competencyId, numQuestions })
}

export const progressAPI = {
  save: (userId, competencyId, interactions) => 
    api.post(ENDPOINTS.PROGRESS.SAVE, { userId, competencyId, interactions }),
  get: (userId) => api.get(ENDPOINTS.PROGRESS.GET(userId))
}

export const careerAPI = {
  recommendations: (userId) => api.get(`${ENDPOINTS.CAREER.RECOMMENDATIONS}?userId=${userId}`)
}

export default api
