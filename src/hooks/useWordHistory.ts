import { useState, useEffect, useCallback, useMemo } from 'react'
import type { VocabularyItem, WordHistory } from '../data/types'
import { loadWordHistory, saveWordHistory } from '../lib/storage'

const MAX_RECENTS = 12
const MAX_FAVORITES = 12

const EMPTY_HISTORY: WordHistory = {
  recentIds: [],
  tapCounts: {},
}

/**
 * Hook that tracks word usage history for recents and favorites.
 * Persists to IndexedDB so data survives page reloads.
 *
 * - `recordTap(itemId)` — call when a symbol is tapped
 * - `recentItems` — last N tapped items (most recent first), de-duplicated
 * - `favoriteItems` — top N most-tapped items sorted by frequency
 */
export function useWordHistory(allItems: VocabularyItem[]) {
  const [history, setHistory] = useState<WordHistory>(EMPTY_HISTORY)
  const [isLoaded, setIsLoaded] = useState(false)

  // Build a lookup map from item ID to VocabularyItem
  const itemMap = useMemo(() => {
    const map = new Map<string, VocabularyItem>()
    for (const item of allItems) {
      map.set(item.id, item)
    }
    return map
  }, [allItems])

  // Load persisted history on mount
  useEffect(() => {
    loadWordHistory()
      .then((saved) => {
        if (saved) {
          setHistory(saved)
        }
        setIsLoaded(true)
      })
      .catch(() => {
        setIsLoaded(true)
      })
  }, [])

  // Persist whenever history changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveWordHistory(history).catch(() => {
        // Silently fail — app still works with in-memory state
      })
    }
  }, [history, isLoaded])

  /** Record a tap on a word */
  const recordTap = useCallback((itemId: string) => {
    setHistory((prev) => {
      // Update recents: remove existing occurrence, prepend, cap at MAX_RECENTS
      const filteredRecents = prev.recentIds.filter((id) => id !== itemId)
      const newRecents = [itemId, ...filteredRecents].slice(0, MAX_RECENTS)

      // Update tap counts
      const newCounts = { ...prev.tapCounts }
      newCounts[itemId] = (newCounts[itemId] ?? 0) + 1

      return {
        recentIds: newRecents,
        tapCounts: newCounts,
      }
    })
  }, [])

  /** Recent items resolved to VocabularyItems (most recent first) */
  const recentItems = useMemo(() => {
    const items: VocabularyItem[] = []
    for (const id of history.recentIds) {
      const item = itemMap.get(id)
      if (item) {
        items.push(item)
      }
    }
    return items
  }, [history.recentIds, itemMap])

  /** Favorite items: top N by tap count, sorted descending */
  const favoriteItems = useMemo(() => {
    const entries = Object.entries(history.tapCounts)
      .filter(([, count]) => count >= 2) // Only show words tapped at least twice
      .sort(([, a], [, b]) => b - a)
      .slice(0, MAX_FAVORITES)

    const items: VocabularyItem[] = []
    for (const [id] of entries) {
      const item = itemMap.get(id)
      if (item) {
        items.push(item)
      }
    }
    return items
  }, [history.tapCounts, itemMap])

  return { recordTap, recentItems, favoriteItems }
}
