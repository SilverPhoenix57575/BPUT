import { createClient } from '@supabase/supabase-js'
import offlineStorage from './pouchdb'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)

class HybridStorage {
  constructor() {
    this.online = navigator.onLine
    window.addEventListener('online', () => this.sync())
  }

  async saveContent(content, userId) {
    // Save locally first (offline-first)
    await offlineStorage.saveContent({ ...content, userId })
    
    // Sync to Supabase if online
    if (this.online) {
      try {
        await supabase.from('contents').insert({
          id: content.id,
          user_id: userId,
          filename: content.filename,
          content_type: content.type,
          extracted_text: content.extractedText,
          created_at: new Date().toISOString()
        })
      } catch (err) {
        console.log('Will sync later:', err)
      }
    }
  }

  async getContents(userId) {
    // Try online first
    if (this.online) {
      try {
        const { data } = await supabase
          .from('contents')
          .select('*')
          .eq('user_id', userId)
        
        // Update local cache
        for (const item of data) {
          await offlineStorage.saveContent(item)
        }
        return data
      } catch (err) {
        console.log('Using offline data:', err)
      }
    }
    
    // Fallback to offline
    return await offlineStorage.getAllContent(userId)
  }

  async sync() {
    this.online = true
    // Get all unsynced local data
    const localData = await offlineStorage.getAllContent()
    
    for (const item of localData) {
      if (!item.synced) {
        try {
          await supabase.from('contents').upsert(item)
          await offlineStorage.markSynced(item.id)
        } catch (err) {
          console.error('Sync failed:', err)
        }
      }
    }
  }
}

export default new HybridStorage()
