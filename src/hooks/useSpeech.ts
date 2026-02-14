import { useCallback } from 'react'
import type { Language } from '../data/types'

const LANG_MAP: Record<Language, string> = {
  en: 'en-US',
  fr: 'fr-FR',
}

/**
 * Hook that wraps the Web Speech API for text-to-speech.
 * Returns a `speak` function that takes a word and language.
 */
export function useSpeech() {
  const speak = useCallback((text: string, language: Language) => {
    if (!('speechSynthesis' in window)) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = LANG_MAP[language]
    utterance.rate = 0.9
    utterance.pitch = 1.0

    window.speechSynthesis.speak(utterance)
  }, [])

  const speakSentence = useCallback((words: string[], language: Language) => {
    if (!('speechSynthesis' in window)) return
    if (words.length === 0) return

    window.speechSynthesis.cancel()

    const sentence = words.join(' ')
    const utterance = new SpeechSynthesisUtterance(sentence)
    utterance.lang = LANG_MAP[language]
    utterance.rate = 0.9
    utterance.pitch = 1.0

    window.speechSynthesis.speak(utterance)
  }, [])

  return { speak, speakSentence }
}
