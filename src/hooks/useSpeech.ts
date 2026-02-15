import { useCallback, useRef } from 'react'
import type { Language, VocabularyItem } from '../data/types'
import { getCachedAudio, hasAudio } from '../lib/audioCache'

const LANG_MAP: Record<Language, string> = {
  en: 'en-US',
  fr: 'fr-FR',
}

/**
 * Fallback: speak text using the Web Speech API (built-in browser TTS).
 */
function fallbackSpeak(text: string, language: Language): void {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = LANG_MAP[language]
  utterance.rate = 0.9
  utterance.pitch = 1.0

  window.speechSynthesis.speak(utterance)
}

/**
 * Play an HTMLAudioElement and return a promise that resolves when it finishes.
 */
function playAudio(audio: HTMLAudioElement): Promise<void> {
  return new Promise((resolve, reject) => {
    audio.onended = () => resolve()
    audio.onerror = () => reject(new Error('Audio playback failed'))
    audio.play().catch(reject)
  })
}

/**
 * Hook that provides speech functions using pre-generated audio files
 * with automatic fallback to the Web Speech API.
 *
 * - `speak(item, language)` — speak a single vocabulary word
 * - `speakSentence(items, language)` — speak a sequence of words with natural pauses
 */
export function useSpeech() {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const abortRef = useRef(false)

  const stopCurrent = useCallback(() => {
    abortRef.current = true
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
    window.speechSynthesis?.cancel()
  }, [])

  /**
   * Speak a single vocabulary word.
   * Uses pre-generated audio if available, otherwise falls back to Web Speech API.
   */
  const speak = useCallback((item: VocabularyItem, language: Language) => {
    stopCurrent()

    const audio = getCachedAudio(item.id, language)
    if (audio) {
      currentAudioRef.current = audio
      audio.play().catch(() => {
        fallbackSpeak(item.label[language], language)
      })
    } else {
      fallbackSpeak(item.label[language], language)
    }
  }, [stopCurrent])

  /**
   * Speak a sentence (sequence of vocabulary items).
   * If all words have pre-generated audio, plays them sequentially with natural pauses.
   * Otherwise falls back to Web Speech API for the full sentence.
   */
  const speakSentence = useCallback(async (items: VocabularyItem[], language: Language) => {
    if (items.length === 0) return

    stopCurrent()
    abortRef.current = false

    const allAvailable = items.every((item) => hasAudio(item.id, language))

    if (allAvailable) {
      for (let i = 0; i < items.length; i++) {
        if (abortRef.current) return

        const audio = getCachedAudio(items[i].id, language)
        if (!audio) break

        currentAudioRef.current = audio
        try {
          await playAudio(audio)
        } catch {
          // If one word fails, fall back to Web Speech for the rest
          const remaining = items.slice(i).map((it) => it.label[language]).join(' ')
          fallbackSpeak(remaining, language)
          return
        }

        // Natural pause between words (150ms)
        if (i < items.length - 1 && !abortRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 150))
        }
      }
    } else {
      // Fall back to Web Speech API for the full sentence
      const sentence = items.map((item) => item.label[language]).join(' ')
      fallbackSpeak(sentence, language)
    }
  }, [stopCurrent])

  return { speak, speakSentence }
}
