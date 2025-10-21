let PouchDB, PouchDBFind
try {
  PouchDB = require('pouchdb-browser').default
  PouchDBFind = require('pouchdb-find').default
  if (PouchDB && PouchDBFind) {
    PouchDB.plugin(PouchDBFind)
  }
} catch (err) {
  console.warn('PouchDB not available, using fallback storage')
}

class OfflineStorage {
  constructor() {
    this.usePouchDB = !!PouchDB
    this.isOnline = navigator.onLine
    
    if (this.usePouchDB) {
      this.contentDB = new PouchDB('ai_learning_content')
      this.progressDB = new PouchDB('ai_learning_progress')
      this.notesDB = new PouchDB('ai_learning_notes')
      this.createIndexes()
    }
    
    window.addEventListener('online', () => {
      this.isOnline = true
      if (this.usePouchDB) this.syncAll()
    })
    window.addEventListener('offline', () => this.isOnline = false)
  }

  async createIndexes() {
    if (!this.usePouchDB) return
    try {
      await this.contentDB.createIndex({ index: { fields: ['userId', 'timestamp'] } })
      await this.progressDB.createIndex({ index: { fields: ['userId', 'competencyId'] } })
      await this.notesDB.createIndex({ index: { fields: ['userId', 'topic'] } })
    } catch (err) {
      console.warn('Index creation failed:', err)
    }
  }

  setupSync(remoteUrl) {
    if (!remoteUrl) return
    
    this.contentDB.sync(new PouchDB(`${remoteUrl}/content`), { live: true, retry: true })
    this.progressDB.sync(new PouchDB(`${remoteUrl}/progress`), { live: true, retry: true })
    this.notesDB.sync(new PouchDB(`${remoteUrl}/notes`), { live: true, retry: true })
  }

  async syncAll() {
    if (!this.isOnline) return
    try {
      await Promise.all([
        this.contentDB.sync(new PouchDB('content')),
        this.progressDB.sync(new PouchDB('progress')),
        this.notesDB.sync(new PouchDB('notes'))
      ])
    } catch (err) {
      console.log('Sync skipped:', err.message)
    }
  }

  async saveContent(content) {
    const doc = {
      _id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...content,
      timestamp: new Date().toISOString()
    }
    if (this.usePouchDB) {
      await this.contentDB.put(doc)
    } else {
      const contents = JSON.parse(localStorage.getItem('contents') || '[]')
      contents.push(doc)
      localStorage.setItem('contents', JSON.stringify(contents))
    }
    return doc
  }

  async getAllContent(userId) {
    if (this.usePouchDB) {
      try {
        const result = await this.contentDB.find({
          selector: { userId },
          sort: [{ timestamp: 'desc' }]
        })
        return result.docs
      } catch {
        const result = await this.contentDB.allDocs({ include_docs: true })
        return result.rows.map(r => r.doc).filter(d => d.userId === userId)
      }
    } else {
      const contents = JSON.parse(localStorage.getItem('contents') || '[]')
      return contents.filter(c => c.userId === userId)
    }
  }

  async saveProgress(userId, competencyId, data) {
    const _id = `progress_${userId}_${competencyId}`
    if (this.usePouchDB) {
      try {
        const existing = await this.progressDB.get(_id)
        await this.progressDB.put({ ...existing, ...data, updatedAt: new Date().toISOString() })
      } catch {
        await this.progressDB.put({ _id, userId, competencyId, ...data, updatedAt: new Date().toISOString() })
      }
    } else {
      localStorage.setItem(_id, JSON.stringify({ _id, userId, competencyId, ...data, updatedAt: new Date().toISOString() }))
    }
  }

  async getProgress(userId) {
    if (this.usePouchDB) {
      try {
        const result = await this.progressDB.find({ selector: { userId } })
        return result.docs
      } catch {
        const result = await this.progressDB.allDocs({ include_docs: true })
        return result.rows.map(r => r.doc).filter(d => d.userId === userId)
      }
    } else {
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

  async saveNote(userId, note) {
    const doc = {
      _id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      ...note,
      createdAt: new Date().toISOString()
    }
    if (this.usePouchDB) {
      await this.notesDB.put(doc)
    } else {
      const notes = JSON.parse(localStorage.getItem('notes') || '[]')
      notes.push(doc)
      localStorage.setItem('notes', JSON.stringify(notes))
    }
    return doc
  }

  async getNotes(userId, topic = null) {
    if (this.usePouchDB) {
      try {
        const selector = topic ? { userId, topic } : { userId }
        const result = await this.notesDB.find({ selector, sort: [{ createdAt: 'desc' }] })
        return result.docs
      } catch {
        const result = await this.notesDB.allDocs({ include_docs: true })
        return result.rows.map(r => r.doc).filter(d => d.userId === userId && (!topic || d.topic === topic))
      }
    } else {
      const notes = JSON.parse(localStorage.getItem('notes') || '[]')
      return notes.filter(n => n.userId === userId && (!topic || n.topic === topic))
    }
  }

  getStatus() {
    return {
      online: this.isOnline,
      databases: this.usePouchDB ? ['content', 'progress', 'notes'] : ['localStorage'],
      ready: true,
      mode: this.usePouchDB ? 'PouchDB' : 'localStorage'
    }
  }
}

export default new OfflineStorage()
