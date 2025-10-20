export const THEME_KEY = 'app-theme'
export const THEMES = { LIGHT: 'light', DARK: 'dark' }

export function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? THEMES.DARK 
    : THEMES.LIGHT
}

export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY)
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme')
  const next = current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
  applyTheme(next)
  saveTheme(next)
  return next
}

export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || THEMES.LIGHT
}

export function initTheme() {
  const saved = getSavedTheme()
  const theme = saved || getSystemTheme()
  applyTheme(theme)
  return theme
}
