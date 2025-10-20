import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { toggleTheme, getCurrentTheme, THEMES } from '../../utils/theme'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(THEMES.LIGHT)

  useEffect(() => {
    setTheme(getCurrentTheme())
    
    const observer = new MutationObserver(() => {
      setTheme(getCurrentTheme())
    })
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['data-theme'] 
    })
    
    return () => observer.disconnect()
  }, [])

  const handleToggle = () => {
    const newTheme = toggleTheme()
    setTheme(newTheme)
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg transition-colors"
      style={{ backgroundColor: 'transparent' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      aria-label="Toggle theme"
      title={`Switch to ${theme === THEMES.DARK ? 'light' : 'dark'} mode`}
    >
      {theme === THEMES.DARK ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} style={{ color: 'var(--color-text-secondary)' }} />
      )}
    </button>
  )
}
