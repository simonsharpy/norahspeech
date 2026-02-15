import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { App } from './App'
import './index.css'

// Register service worker with automatic updates.
// - Checks for a new SW every hour while the app is open
// - When a new version is found, skipWaiting + clientsClaim in the SW
//   config ensure it activates immediately, and this callback reloads.
registerSW({
  onRegisteredSW(_swUrl, registration) {
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000) // check every hour
    }
  },
  onOfflineReady() {
    // App is cached and ready for offline use — no action needed
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
