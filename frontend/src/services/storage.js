// Local storage service (backend uses AWS S3)
class StorageService {
  saveContent(content) {
    const contents = JSON.parse(localStorage.getItem('contents') || '[]')
    contents.push(content)
    localStorage.setItem('contents', JSON.stringify(contents))
    return content
  }

  getAllContent() {
    return JSON.parse(localStorage.getItem('contents') || '[]')
  }

  saveProgress(userId, competencyId, mastery) {
    const progress = JSON.parse(localStorage.getItem('progress') || '{}')
    if (!progress[userId]) progress[userId] = {}
    progress[userId][competencyId] = mastery
    localStorage.setItem('progress', JSON.stringify(progress))
  }

  getProgress(userId) {
    const progress = JSON.parse(localStorage.getItem('progress') || '{}')
    return progress[userId] || {}
  }
}

export default new StorageService()
