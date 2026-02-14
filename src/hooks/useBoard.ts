import { useState, useEffect } from 'react'
import type { BoardState } from '../data/types'
import { defaultBoard, BOARD_VERSION } from '../data/vocabulary'
import { loadBoard, saveBoard } from '../lib/storage'

/**
 * Hook that manages board state.
 * Loads from IndexedDB on mount, falls back to default vocabulary.
 * If the saved board version doesn't match the current default, discard it.
 * Saves to IndexedDB whenever the board changes.
 */
export function useBoard() {
  const [board, setBoard] = useState<BoardState>(defaultBoard)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    loadBoard().then((saved) => {
      if (saved && saved.version === BOARD_VERSION) {
        setBoard(saved)
      }
      setIsLoaded(true)
    }).catch(() => {
      // If IndexedDB fails (e.g. private browsing), just use defaults
      setIsLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (isLoaded) {
      saveBoard(board).catch(() => {
        // Silently fail — user can still use the app with defaults
      })
    }
  }, [board, isLoaded])

  return { board, setBoard, isLoaded }
}
