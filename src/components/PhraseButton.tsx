import { useState } from 'react'
import type { QuickPhrase, Language } from '../data/types'

interface PhraseButtonProps {
  phrase: QuickPhrase
  language: Language
  onTap: (phrase: QuickPhrase) => void
}

export function PhraseButton({ phrase, language, onTap }: PhraseButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const label = phrase.label[language]

  function handleClick() {
    setIsPressed(true)
    onTap(phrase)
    setTimeout(() => setIsPressed(false), 200)
  }

  return (
    <button
      data-testid={`phrase-${phrase.id}`}
      onClick={handleClick}
      className={`
        flex items-center gap-3
        rounded-2xl px-4 py-4 shadow-sm
        transition-all duration-150 ease-out
        active:scale-95 select-none cursor-pointer
        w-full bg-gradient-to-r from-violet-50 to-indigo-50
        border-2 border-indigo-300
        hover:border-indigo-400 hover:shadow-md
        ${isPressed ? 'scale-95 brightness-90' : ''}
      `}
      aria-label={label}
    >
      <span className="text-3xl shrink-0 leading-none" role="img" aria-hidden="true">
        {phrase.icon}
      </span>
      <span className="text-base font-bold text-gray-900 leading-snug text-left sm:text-lg">
        {label}
      </span>
    </button>
  )
}
