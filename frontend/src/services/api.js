import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
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
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export const contentAPI = {
  upload: (formData) => api.post('/api/content/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  list: (userId) => api.get(`/api/content/list?userId=${userId}`),
  get: (id) => api.get(`/api/content/${id}`)
}

export const aiAPI = {
  enhance: (text, level) => api.post('/api/ai/enhance', { text, level }),
  question: (data) => api.post('/api/ai/question', data),
  quiz: (contentId, competencyId, numQuestions) => 
    api.post('/api/ai/quiz', { contentId, competencyId, numQuestions })
}

export const progressAPI = {
  save: (userId, competencyId, interactions) => 
    api.post('/api/progress/save', { userId, competencyId, interactions }),
  get: (userId) => api.get(`/api/progress/${userId}`)
}

export const careerAPI = {
  recommendations: (userId) => api.get(`/api/career/recommendations?userId=${userId}`)
}

export default api
