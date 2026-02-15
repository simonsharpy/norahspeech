import type { Language, VocabularyItem } from '../data/types'

/**
 * Audio cache — preloads mp3 files for vocabulary items so they play
 * instantly on tap. Falls back gracefully when files are unavailable.
 */

const cache = new Map<string, HTMLAudioElement>()

function cacheKey(itemId: string, language: Language): string {
  return `${language}/${itemId}`
}

/**
 * Preload a single audio file into the cache.
 * Silently ignores files that fail to load (missing or network error).
 */
function preloadOne(itemId: string, language: Language): void {
  const key = cacheKey(itemId, language)
  if (cache.has(key)) return

  const audio = new Audio(`${import.meta.env.BASE_URL}audio/${language}/${itemId}.mp3`)
  audio.preload = 'auto'
  audio.addEventListener('canplaythrough', () => {
    cache.set(key, audio)
  }, { once: true })
  // On error, simply don't cache — will fall back to Web Speech API
}

/**
 * Preload audio for all vocabulary items in all given languages.
 * Call this once on app startup.
 */
export function preloadAllAudio(items: VocabularyItem[], languages: Language[]): void {
  for (const item of items) {
    for (const lang of languages) {
      preloadOne(item.id, lang)
    }
  }
}

/**
 * Get a ready-to-play Audio element for a vocabulary item.
 * Returns undefined if the audio hasn't been preloaded or failed to load.
 */
export function getCachedAudio(itemId: string, language: Language): HTMLAudioElement | undefined {
  const key = cacheKey(itemId, language)
  const original = cache.get(key)
  if (!original) return undefined

  // Clone the node so we can play overlapping/sequential sounds
  const clone = original.cloneNode() as HTMLAudioElement
  return clone
}

/**
 * Check whether pre-generated audio is available for a specific item.
 */
export function hasAudio(itemId: string, language: Language): boolean {
  return cache.has(cacheKey(itemId, language))
}
