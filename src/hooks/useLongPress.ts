import { useRef, useCallback } from 'react'

const LONG_PRESS_THRESHOLD_MS = 500

interface UseLongPressOptions {
  /** Called immediately on short tap (< threshold) */
  onShortTap: () => void
  /** Called when long press is detected (after threshold) */
  onLongPressStart: () => void
  /** Called when released after a long press */
  onLongPressEnd: () => void
  /** Called when long press is cancelled (e.g. touch moves off) */
  onCancel: () => void
  /** Whether long-press behavior is enabled. When false, all interactions are short taps. */
  enabled: boolean
}

interface LongPressHandlers {
  onMouseDown: (e: React.MouseEvent) => void
  onMouseUp: (e: React.MouseEvent) => void
  onMouseLeave: (e: React.MouseEvent) => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
  onTouchCancel: (e: React.TouchEvent) => void
  onContextMenu: (e: React.MouseEvent | React.TouchEvent) => void
}

export function useLongPress({
  onShortTap,
  onLongPressStart,
  onLongPressEnd,
  onCancel,
  enabled,
}: UseLongPressOptions): LongPressHandlers {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPressRef = useRef(false)
  const isActiveRef = useRef(false)
  // Track whether the interaction started from touch to prevent duplicate mouse events
  const isTouchRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startPress = useCallback(() => {
    if (!enabled) return

    isActiveRef.current = true
    isLongPressRef.current = false

    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true
      onLongPressStart()
    }, LONG_PRESS_THRESHOLD_MS)
  }, [enabled, onLongPressStart])

  const endPress = useCallback(() => {
    if (!enabled) {
      isActiveRef.current = false
      return
    }

    clearTimer()

    if (!isActiveRef.current) return
    isActiveRef.current = false

    if (isLongPressRef.current) {
      onLongPressEnd()
    } else {
      onShortTap()
    }
    isLongPressRef.current = false
  }, [enabled, clearTimer, onLongPressEnd, onShortTap])

  const cancelPress = useCallback(() => {
    clearTimer()
    if (isActiveRef.current && isLongPressRef.current) {
      onCancel()
    }
    isActiveRef.current = false
    isLongPressRef.current = false
  }, [clearTimer, onCancel])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Skip if this was triggered by a touch event
    if (isTouchRef.current) return
    if (e.button !== 0) return
    startPress()
  }, [startPress])

  const handleMouseUp = useCallback((_e: React.MouseEvent) => {
    if (isTouchRef.current) {
      isTouchRef.current = false
      return
    }
    endPress()
  }, [endPress])

  const handleMouseLeave = useCallback((_e: React.MouseEvent) => {
    if (isTouchRef.current) return
    cancelPress()
  }, [cancelPress])

  const handleTouchStart = useCallback((_e: React.TouchEvent) => {
    isTouchRef.current = true
    startPress()
  }, [startPress])

  const handleTouchEnd = useCallback((_e: React.TouchEvent) => {
    endPress()
  }, [endPress])

  const handleTouchCancel = useCallback((_e: React.TouchEvent) => {
    cancelPress()
  }, [cancelPress])

  const handleContextMenu = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent native context menu on long press
    if (enabled) {
      e.preventDefault()
    }
  }, [enabled])

  return {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
    onContextMenu: handleContextMenu,
  }
}
