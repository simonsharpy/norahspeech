import { useState } from 'react'
import type { VocabularyItem, Language } from '../data/types'
import { getArasaacUrl } from '../lib/arasaac'

interface SymbolButtonProps {
  item: VocabularyItem
  language: Language
  categoryColor: string
  onTap: (item: VocabularyItem) => void
}

export function SymbolButton({ item, language, categoryColor, onTap }: SymbolButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const label = item.label[language]

  function handleClick() {
    setIsPressed(true)
    onTap(item)
    setTimeout(() => setIsPressed(false), 200)
  }

  return (
    <button
      data-testid={`symbol-${item.id}`}
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-center gap-1
        rounded-2xl p-2 shadow-md
        transition-all duration-150 ease-out
        active:scale-95 select-none cursor-pointer
        min-h-[100px] w-full
        ${isPressed ? 'scale-95 ring-4 ring-white/60' : ''}
      `}
      style={{
        backgroundColor: categoryColor,
      }}
      aria-label={label}
    >
      <img
        src={getArasaacUrl(item.arasaacId)}
        alt={label}
        className="h-16 w-16 rounded-lg bg-white/90 p-1 object-contain sm:h-20 sm:w-20"
        loading="lazy"
        draggable={false}
      />
      <span className="text-sm font-semibold text-white drop-shadow-sm leading-tight text-center sm:text-base">
        {label}
      </span>
    </button>
  )
}
