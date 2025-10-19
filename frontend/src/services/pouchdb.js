import PouchDB from 'pouchdb'

// Simplified for demo - plugin can be added later if needed

class OfflineStorage {
  constructor() {
    this.contentDB = new PouchDB('content')
    this.progressDB = new PouchDB('progress')
    this.notebooksDB = new PouchDB('notebooks')
    this.remoteURL = import.meta.env.VITE_COUCHDB_URL
    this.isOnline = navigator.onLine
    
    window.addEventListener('online', () => this.isOnline = true)
    window.addEventListener('offline', () => this.isOnline = false)
  }

  setupSync() {
    if (!this.remoteURL || this.remoteURL.includes('your-cloudant')) return
    
    this.contentDB.sync(this.remoteURL + '/content', { live: true, retry: true })
    this.progressDB.sync(this.remoteURL + '/progress', { live: true, retry: true })
    this.notebooksDB.sync(this.remoteURL + '/notebooks', { live: true, retry: true })
  }

  async saveContent(content) {
    return await this.contentDB.put({
      _id: `content_${Date.now()}`,
      ...content,
      timestamp: new Date().toISOString()
    })
  }

  async getAllContent() {
    const result = await this.contentDB.allDocs({ include_docs: true })
    return result.rows.map(row => row.doc)
  }

  async saveProgress(userId, competencyId, data) {
    const id = `progress_${userId}_${competencyId}`
    try {
      const existing = await this.progressDB.get(id).catch(() => null)
      await this.progressDB.put({
        _id: id,
        _rev: existing?._rev,
        userId,
        competencyId,
        ...data,
        updatedAt: new Date().toISOString()
      })
    } catch (err) {
      console.error('Progress save error:', err)
    }
  }

  async getProgress(userId) {
    const result = await this.progressDB.allDocs({ 
      include_docs: true,
      startkey: `progress_${userId}_`,
      endkey: `progress_${userId}_\ufff0`
    })
    return result.rows.map(row => row.doc)
  }
}

export default new OfflineStorage()
