// Using localStorage instead of PouchDB (AWS S3 for backend storage)

class OfflineStorage {
  constructor() {
    this.isOnline = navigator.onLine
    window.addEventListener('online', () => this.isOnline = true)
    window.addEventListener('offline', () => this.isOnline = false)
  }

  setupSync() {
    // AWS S3 sync handled by backend
  }

  async saveContent(content) {
    const contents = JSON.parse(localStorage.getItem('contents') || '[]')
    const newContent = { _id: `content_${Date.now()}`, ...content, timestamp: new Date().toISOString() }
    contents.push(newContent)
    localStorage.setItem('contents', JSON.stringify(contents))
    return newContent
  }

  async getAllContent() {
    return JSON.parse(localStorage.getItem('contents') || '[]')
  }

  async saveProgress(userId, competencyId, data) {
    const key = `progress_${userId}_${competencyId}`
    localStorage.setItem(key, JSON.stringify({ userId, competencyId, ...data, updatedAt: new Date().toISOString() }))
  }

  async getProgress(userId) {
    const progress = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith(`progress_${userId}_`)) {
        progress.push(JSON.parse(localStorage.getItem(key)))
      }
    }
    return progress
  }
}

export default new OfflineStorage()
