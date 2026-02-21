import { useMemo } from 'react'
import type { VocabularyItem } from '../data/types'
import { wordAssociations } from '../data/wordAssociations'

/** Maximum number of suggestions to show */
const MAX_SUGGESTIONS = 6

/**
 * Hook that returns suggested next words based on the last word in the sentence.
 *
 * Looks up the last word's ID in the word association map, then resolves those
 * IDs against the available vocabulary items. Only visible items are returned
 * as suggestions, and items already in the sentence are deprioritized (moved
 * to the end) rather than removed — repeating a word can be valid in AAC.
 */
export function useSuggestions(
  sentence: VocabularyItem[],
  visibleItems: VocabularyItem[],
): VocabularyItem[] {
  return useMemo(() => {
    if (sentence.length === 0) return []

    const lastWord = sentence[sentence.length - 1]
    const associatedIds = wordAssociations[lastWord.id]

    if (!associatedIds || associatedIds.length === 0) return []

    // Build a lookup for visible items by ID for O(1) access
    const visibleById = new Map<string, VocabularyItem>()
    for (const item of visibleItems) {
      visibleById.set(item.id, item)
    }

    // Resolve associated IDs to actual vocabulary items, preserving order
    const suggestions: VocabularyItem[] = []
    for (const id of associatedIds) {
      if (suggestions.length >= MAX_SUGGESTIONS) break
      const item = visibleById.get(id)
      if (item) {
        suggestions.push(item)
      }
    }

    return suggestions
  }, [sentence, visibleItems])
}
