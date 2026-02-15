import type { Language, VocabularyItem } from '../data/types'

/**
 * Audio cache — preloads mp3 files as blob URLs so they play instantly on tap.
 *
 * Why blob URLs instead of <audio> preload?
 * iOS WebKit (used by ALL browsers on iPhone, including Chrome) ignores
 * audio.preload = "auto" and never fires "canplaythrough" unless the load
 * is triggered by a user gesture. Using fetch() to download the mp3 data
 * and storing it as a blob URL bypasses this restriction entirely.
 */

const cache = new Map<string, string>() // key → blob URL
const pending = new Set<string>()       // keys currently being fetched

function cacheKey(itemId: string, language: Language): string {
  return `${language}/${itemId}`
}

/**
 * Preload a single audio file into the cache via fetch().
 * Silently ignores files that fail to load (missing or network error).
 */
async function preloadOne(itemId: string, language: Language): Promise<void> {
  const key = cacheKey(itemId, language)
  if (cache.has(key) || pending.has(key)) return

  pending.add(key)

  try {
    const url = `${import.meta.env.BASE_URL}audio/${language}/${itemId}.mp3`
    const response = await fetch(url)
    if (!response.ok) return

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    cache.set(key, blobUrl)
  } catch {
    // Network error or missing file — will fall back to Web Speech API
  } finally {
    pending.delete(key)
  }
}

/**
 * Preload audio for all vocabulary items in all given languages.
 * Call this once on app startup. Downloads happen in parallel.
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
  const blobUrl = cache.get(key)
  if (!blobUrl) return undefined

  return new Audio(blobUrl)
}

/**
 * Check whether pre-generated audio is available for a specific item.
 */
export function hasAudio(itemId: string, language: Language): boolean {
  return cache.has(cacheKey(itemId, language))
}
