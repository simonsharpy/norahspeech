import { useState } from 'react'
import type { VocabularyItem, Language } from '../data/types'
import { getSymbolUrl, getArasaacUrl } from '../lib/arasaac'

interface SymbolButtonProps {
  item: VocabularyItem
  language: Language
  categoryColor: string
  onTap: (item: VocabularyItem) => void
}

export function SymbolButton({ item, language, categoryColor, onTap }: SymbolButtonProps) {
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
      data-testid={`symbol-${item.id}`}
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-between
        rounded-xl p-2 shadow-sm
        transition-all duration-150 ease-out
        active:scale-95 select-none cursor-pointer
        min-h-[110px] w-full bg-white
        border-b-4 border-r-2 border-t border-l
        hover:brightness-95
        ${isPressed ? 'scale-95 brightness-90' : ''}
      `}
      style={{
        borderColor: categoryColor,
      }}
      aria-label={label}
    >
      <div className="flex-1 flex items-center justify-center w-full">
        <img
          src={imgSrc}
          alt={label}
          className="h-20 w-20 object-contain sm:h-24 sm:w-24"
          loading="lazy"
          draggable={false}
          onError={() => {
            if (!useFallback) setUseFallback(true)
          }}
        />
      </div>
      <span 
        className="text-sm font-bold text-gray-900 leading-tight text-center sm:text-base w-full truncate px-1"
        style={{ color: 'black' }} // Force high contrast
      >
        {label}
      </span>
    </button>
  )
}
