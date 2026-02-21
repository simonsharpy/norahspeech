import { useState } from 'react'
import type { VocabularyItem, Language } from '../data/types'
import { getSymbolUrl, getArasaacUrl } from '../lib/arasaac'

interface CoreWordBarProps {
  coreWords: VocabularyItem[]
  language: Language
  onTap: (item: VocabularyItem) => void
}

function CoreSymbolButton({ item, language, onTap }: { item: VocabularyItem; language: Language; onTap: (item: VocabularyItem) => void }) {
  const [isPressed, setIsPressed] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const label = item.label[language]

  function handleClick() {
    setIsPressed(true)
    onTap(item)
    setTimeout(() => setIsPressed(false), 200)
  }

  const imgSrc = useFallback
    ? getArasaacUrl(item.arasaacId)
    : getSymbolUrl(item.id, item.arasaacId)

  return (
    <button
      data-testid={`core-symbol-${item.id}`}
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-between
        rounded-xl p-1.5 shadow-sm
        transition-all duration-150 ease-out
        active:scale-95 select-none cursor-pointer
        min-h-[90px] w-full bg-white
        border-2 border-indigo-300
        hover:brightness-95
        ${isPressed ? 'scale-95 brightness-90' : ''}
      `}
      aria-label={label}
    >
      <div className="flex flex-1 items-center justify-center w-full">
        <img
          src={imgSrc}
          alt={label}
          className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          loading="lazy"
          draggable={false}
          onError={() => {
            if (!useFallback) setUseFallback(true)
          }}
        />
      </div>
      <span className="text-xs font-bold text-gray-900 leading-tight text-center sm:text-sm w-full truncate px-0.5">
        {label}
      </span>
    </button>
  )
}

export function CoreWordBar({ coreWords, language, onTap }: CoreWordBarProps) {
  if (coreWords.length === 0) return null

  return (
    <div
      data-testid="core-word-bar"
      className="mx-3 rounded-2xl bg-indigo-50 border border-indigo-200 px-2 py-2 shadow-sm"
    >
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {coreWords.map((item) => (
          <CoreSymbolButton
            key={item.id}
            item={item}
            language={language}
            onTap={onTap}
          />
        ))}
      </div>
    </div>
  )
}
