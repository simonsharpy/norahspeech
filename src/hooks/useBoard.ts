import { useState, useEffect, useCallback, useMemo } from 'react'
import type { BoardState, VocabularyItem } from '../data/types'
import { defaultBoard, BOARD_VERSION } from '../data/vocabulary'
import { loadBoard, saveBoard } from '../lib/storage'

/** Returns true if the item should be visible given the current visibility overrides */
function isItemVisible(item: VocabularyItem, visibility: Record<string, boolean>): boolean {
  if (item.id in visibility) return visibility[item.id]
  return !item.hiddenByDefault
}

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

  /** Toggle visibility for a single item */
  const toggleItemVisibility = useCallback((itemId: string) => {
    setBoard((prev) => {
      const item = prev.items.find((i) => i.id === itemId)
      if (!item) return prev
      const currentlyVisible = isItemVisible(item, prev.itemVisibility ?? {})
      return {
        ...prev,
        itemVisibility: {
          ...prev.itemVisibility,
          [itemId]: !currentlyVisible,
        },
      }
    })
  }, [])

  /** The subset of items that are currently visible */
  const visibleItems = useMemo(
    () => board.items.filter((item) => isItemVisible(item, board.itemVisibility ?? {})),
    [board.items, board.itemVisibility],
  )

  return { board, setBoard, isLoaded, toggleItemVisibility, visibleItems, isItemVisible: (item: VocabularyItem) => isItemVisible(item, board.itemVisibility ?? {}) }
}
