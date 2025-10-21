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

// Response unwrapper
const unwrapResponse = (response) => {
  if (response.data?.success && response.data?.data !== undefined) {
    return { ...response, data: response.data.data }
  }
  return response
}

export const contentAPI = {
  upload: (formData) => api.post(ENDPOINTS.CONTENT.UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(unwrapResponse),
  list: (userId) => api.get(`${ENDPOINTS.CONTENT.LIST}?userId=${userId}`).then(unwrapResponse),
  get: (id) => api.get(ENDPOINTS.CONTENT.GET(id)).then(unwrapResponse)
}

export const aiAPI = {
  enhance: (text, level) => api.post(ENDPOINTS.AI.ENHANCE, { text, level }).then(unwrapResponse),
  question: (data) => api.post(ENDPOINTS.AI.QUESTION, data).then(unwrapResponse),
  quiz: (contentId, competencyId, numQuestions) => 
    api.post(ENDPOINTS.AI.QUIZ, { contentId, competencyId, numQuestions }).then(unwrapResponse)
}

export const progressAPI = {
  save: (userId, competencyId, interactions) => 
    api.post(ENDPOINTS.PROGRESS.SAVE, { userId, competencyId, interactions }).then(unwrapResponse),
  get: (userId) => api.get(ENDPOINTS.PROGRESS.GET(userId)).then(unwrapResponse)
}

export const careerAPI = {
  recommendations: (userId) => api.get(`${ENDPOINTS.CAREER.RECOMMENDATIONS}?userId=${userId}`).then(unwrapResponse)
}

export default api
