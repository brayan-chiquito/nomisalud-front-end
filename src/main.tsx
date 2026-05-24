import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { initThemeFromStorage } from './features/theme/themeStorage'
import './index.css'

initThemeFromStorage()

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found. Check your index.html.')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
