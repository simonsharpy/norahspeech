import { useState } from 'react'
import type { VocabularyItem, Language } from '../data/types'
import { getSymbolUrl, getArasaacUrl } from '../lib/arasaac'

interface SuggestionRowProps {
  suggestions: VocabularyItem[]
  language: Language
  onTap: (item: VocabularyItem) => void
}

function SuggestionButton({ item, language, onTap }: {
  item: VocabularyItem
  language: Language
  onTap: (item: VocabularyItem) => void
}) {
  const [useFallback, setUseFallback] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const label = item.label[language]

  const imgSrc = useFallback
    ? getArasaacUrl(item.arasaacId)
    : getSymbolUrl(item.id, item.arasaacId)

  function handleClick() {
    setIsPressed(true)
    onTap(item)
    setTimeout(() => setIsPressed(false), 200)
  }

  return (
    <button
      data-testid={`suggestion-${item.id}`}
      onClick={handleClick}
      className={`
        flex shrink-0 flex-col items-center justify-between
        rounded-xl p-2 shadow-sm
        transition-all duration-150 ease-out
        active:scale-95 select-none cursor-pointer
        min-h-[90px] w-[85px] bg-amber-50
        border-2 border-amber-300
        hover:bg-amber-100
        ${isPressed ? 'scale-95 brightness-90' : ''}
      `}
      aria-label={label}
    >
      <div className="flex flex-1 items-center justify-center w-full">
        <img
          src={imgSrc}
          alt={label}
          className="h-14 w-14 object-contain"
          loading="lazy"
          draggable={false}
          onError={() => {
            if (!useFallback) setUseFallback(true)
          }}
        />
      </div>
      <span className="text-xs font-bold text-amber-900 leading-tight text-center w-full truncate px-0.5">
        {label}
      </span>
    </button>
  )
}

export function SuggestionRow({ suggestions, language, onTap }: SuggestionRowProps) {
  if (suggestions.length === 0) return null

  return (
    <div
      data-testid="suggestion-row"
      className="mx-3 rounded-xl bg-amber-50/80 border-2 border-amber-200 px-3 py-2"
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-xs font-semibold text-amber-600 uppercase tracking-wide">
          {language === 'fr' ? 'Suggestions' : 'Next'}
        </span>
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {suggestions.map((item) => (
            <SuggestionButton
              key={item.id}
              item={item}
              language={language}
              onTap={onTap}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
