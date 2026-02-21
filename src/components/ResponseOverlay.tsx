import { useState, useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useSpeech } from '../hooks/useSpeech'
import type { Language } from '../data/types'

interface ResponseOption {
  id: string
  label: { en: string; fr: string }
  color: string
  activeColor: string
  textColor: string
}

const RESPONSE_OPTIONS: ResponseOption[] = [
  {
    id: 'yes',
    label: { en: 'Yes', fr: 'Oui' },
    color: 'bg-green-500',
    activeColor: 'active:bg-green-600',
    textColor: 'text-white',
  },
  {
    id: 'no',
    label: { en: 'No', fr: 'Non' },
    color: 'bg-red-500',
    activeColor: 'active:bg-red-600',
    textColor: 'text-white',
  },
  {
    id: 'maybe',
    label: { en: 'Maybe', fr: 'Peut-\u00eatre' },
    color: 'bg-yellow-400',
    activeColor: 'active:bg-yellow-500',
    textColor: 'text-gray-900',
  },
  {
    id: 'idk',
    label: { en: "I don't know", fr: 'Je ne sais pas' },
    color: 'bg-gray-400',
    activeColor: 'active:bg-gray-500',
    textColor: 'text-white',
  },
]

function ResponseButton({
  option,
  language,
  onTap,
}: {
  option: ResponseOption
  language: Language
  onTap: (option: ResponseOption) => void
}) {
  return (
    <button
      onClick={() => onTap(option)}
      className={`
        w-full rounded-2xl px-6 py-6
        text-2xl font-extrabold
        ${option.color} ${option.activeColor} ${option.textColor}
        active:scale-95 transition-all duration-150
        cursor-pointer select-none
        shadow-lg
      `}
      data-testid={`response-${option.id}`}
    >
      {option.label[language]}
    </button>
  )
}

export function ResponseOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useLanguage()
  const { speakText } = useSpeech()

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleResponse = useCallback((option: ResponseOption) => {
    speakText(option.label[language], language)
    setIsOpen(false)
  }, [speakText, language])

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={handleOpen}
        data-testid="response-fab"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white shadow-xl hover:bg-indigo-600 active:scale-90 transition-all duration-150 cursor-pointer select-none"
        aria-label={language === 'fr' ? 'R\u00e9ponse rapide' : 'Quick response'}
      >
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60">
          {/* Backdrop tap to close */}
          <div
            className="absolute inset-0"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Response panel */}
          <div className="relative z-10 flex w-full max-w-sm flex-col gap-4 px-6">
            <h2 className="text-center text-lg font-bold text-white mb-2">
              {language === 'fr' ? 'R\u00e9ponse rapide' : 'Quick response'}
            </h2>

            {RESPONSE_OPTIONS.map((option) => (
              <ResponseButton
                key={option.id}
                option={option}
                language={language}
                onTap={handleResponse}
              />
            ))}

            {/* Close button */}
            <button
              onClick={handleClose}
              className="mt-2 self-center flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all cursor-pointer"
              aria-label={language === 'fr' ? 'Fermer' : 'Close'}
              data-testid="response-close"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
