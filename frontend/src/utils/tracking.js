// Analytics tracking utility
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class AnalyticsTracker {
  constructor() {
    this.sessionStart = Date.now()
    this.events = []
  }

  // Track any event
  track(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: Date.now(),
      data,
      sessionDuration: Date.now() - this.sessionStart
    }
    
    this.events.push(event)
    console.log('📊 Tracked:', eventName, data)
    
    // Store in localStorage for offline support
    this.saveToLocalStorage(event)
    
    return event
  }

  // Track dashboard interactions
  trackDashboardClick(widget, action = 'click') {
    return this.track('dashboard_interaction', {
      widget,
      action,
      timestamp: new Date().toISOString()
    })
  }

  // Track career interactions
  trackCareerInteraction(action, careerTitle, data = {}) {
    return this.track('career_interaction', {
      action,
      careerTitle,
      ...data,
      timestamp: new Date().toISOString()
    })
  }

  // Track navigation
  trackNavigation(from, to) {
    return this.track('navigation', {
      from,
      to,
      timestamp: new Date().toISOString()
    })
  }

  // Track time spent
  trackTimeSpent(page, duration) {
    return this.track('time_spent', {
      page,
      duration,
      timestamp: new Date().toISOString()
    })
  }

  // Save to localStorage
  saveToLocalStorage(event) {
    try {
      const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]')
      stored.push(event)
      // Keep only last 100 events
      if (stored.length > 100) {
        stored.shift()
      }
      localStorage.setItem('analytics_events', JSON.stringify(stored))
    } catch (err) {
      console.error('Failed to save analytics:', err)
    }
  }

  // Send to backend (batch)
  async sendToBackend(userId) {
    if (!userId || this.events.length === 0) return

    try {
      await axios.post(`${API_URL}/api/analytics/track`, {
        user_id: userId,
        events: this.events
      })
      this.events = []
    } catch (err) {
      console.error('Failed to send analytics:', err)
    }
  }

  // Get all events
  getEvents() {
    return this.events
  }

  // Get events from localStorage
  getStoredEvents() {
    try {
      return JSON.parse(localStorage.getItem('analytics_events') || '[]')
    } catch {
      return []
    }
  }
}

// Create singleton instance
const tracker = new AnalyticsTracker()

export default tracker
