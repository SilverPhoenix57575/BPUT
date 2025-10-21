import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const logStudySession = async (userId, activityType, topic, duration, score = null) => {
  try {
    await axios.post(`${API_URL}/api/analytics/session`, {
      userId,
      activityType,
      topic,
      duration,
      score
    })
  } catch (error) {
    // Silently fail - analytics endpoint not critical
    if (error.response?.status !== 404) {
      console.warn('Analytics logging failed (non-critical):', error.message)
    }
  }
}

export const awardAchievement = async (userId, badgeId, badgeName) => {
  try {
    await axios.post(`${API_URL}/api/analytics/achievement`, null, {
      params: { user_id: userId, badge_id: badgeId, badge_name: badgeName }
    })
  } catch (error) {
    // Silently fail - analytics endpoint not critical
    if (error.response?.status !== 404) {
      console.warn('Achievement logging failed (non-critical):', error.message)
    }
  }
}
