import { useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useSpeech } from '../hooks/useSpeech'
import type { Language } from '../data/types'

interface Emotion {
  id: string
  emoji: string
  label: { en: string; fr: string }
}

const emotions: Emotion[] = [
  { id: 'happy', emoji: '\u{1F60A}', label: { en: 'happy', fr: 'content' } },
  { id: 'sad', emoji: '\u{1F622}', label: { en: 'sad', fr: 'triste' } },
  { id: 'angry', emoji: '\u{1F620}', label: { en: 'angry', fr: 'en col\u00e8re' } },
  { id: 'scared', emoji: '\u{1F628}', label: { en: 'scared', fr: 'effray\u00e9' } },
  { id: 'tired', emoji: '\u{1F634}', label: { en: 'tired', fr: 'fatigu\u00e9' } },
  { id: 'excited', emoji: '\u{1F929}', label: { en: 'excited', fr: 'excit\u00e9' } },
  { id: 'calm', emoji: '\u{1F60C}', label: { en: 'calm', fr: 'calme' } },
  { id: 'frustrated', emoji: '\u{1F624}', label: { en: 'frustrated', fr: 'frustr\u00e9' } },
  { id: 'sick', emoji: '\u{1F922}', label: { en: 'sick', fr: 'malade' } },
  { id: 'silly', emoji: '\u{1F92A}', label: { en: 'silly', fr: 'rigolo' } },
  { id: 'loved', emoji: '\u{1F970}', label: { en: 'loved', fr: 'aim\u00e9' } },
  { id: 'bored', emoji: '\u{1F611}', label: { en: 'bored', fr: 'ennuy\u00e9' } },
]

function buildPhrase(emotionLabel: string, language: Language): string {
  if (language === 'fr') {
    return `Je me sens ${emotionLabel}`
  }
  return `I feel ${emotionLabel}`
}

interface EmotionBoardProps {
  onClose: () => void
}

export function EmotionBoard({ onClose }: EmotionBoardProps) {
  const { language } = useLanguage()
  const { speakText } = useSpeech()

  const handleEmotionTap = useCallback((emotion: Emotion) => {
    const phrase = buildPhrase(emotion.label[language], language)
    speakText(phrase, language)
  }, [language, speakText])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <h2 className="text-lg font-bold text-gray-800">
          {language === 'fr' ? 'Comment je me sens' : 'How I feel'}
        </h2>
        <button
          data-testid="close-emotion-board"
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
          aria-label={language === 'fr' ? 'Fermer' : 'Close'}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Subtitle */}
      <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 shrink-0">
        <p className="text-sm text-amber-700">
          {language === 'fr'
            ? 'Touche une \u00e9motion pour dire comment tu te sens.'
            : 'Tap an emotion to say how you feel.'}
        </p>
      </div>

      {/* Emotion grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div
          data-testid="emotion-grid"
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 max-w-xl mx-auto"
        >
          {emotions.map((emotion) => (
            <button
              key={emotion.id}
              data-testid={`emotion-${emotion.id}`}
              onClick={() => handleEmotionTap(emotion)}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white border-2 border-gray-200 px-2 py-4 hover:border-amber-300 hover:bg-amber-50 active:scale-95 transition-all cursor-pointer select-none shadow-sm"
            >
              <span className="text-5xl leading-none" role="img" aria-hidden="true">
                {emotion.emoji}
              </span>
              <span className="text-sm font-bold text-gray-700 text-center leading-tight">
                {emotion.label[language]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
