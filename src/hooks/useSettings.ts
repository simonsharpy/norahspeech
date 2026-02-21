import { useState, useCallback } from 'react'

const HOLD_TO_PREVIEW_KEY = 'norah-hold-to-preview'

function readSetting(key: string, defaultValue: boolean): boolean {
  try {
    const stored = localStorage.getItem(key)
    if (stored === null) return defaultValue
    return stored === 'true'
  } catch {
    return defaultValue
  }
}

function writeSetting(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, String(value))
  } catch {
    // localStorage may be unavailable (e.g. private browsing quota exceeded)
  }
}

export function useSettings() {
  const [holdToPreview, setHoldToPreviewState] = useState(() =>
    readSetting(HOLD_TO_PREVIEW_KEY, false)
  )

  const setHoldToPreview = useCallback((enabled: boolean) => {
    setHoldToPreviewState(enabled)
    writeSetting(HOLD_TO_PREVIEW_KEY, enabled)
  }, [])

  const toggleHoldToPreview = useCallback(() => {
    setHoldToPreviewState((prev) => {
      const next = !prev
      writeSetting(HOLD_TO_PREVIEW_KEY, next)
      return next
    })
  }, [])

  return { holdToPreview, setHoldToPreview, toggleHoldToPreview }
}
