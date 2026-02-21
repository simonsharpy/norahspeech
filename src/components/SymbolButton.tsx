import { useState, useCallback } from 'react'
import type { VocabularyItem, Language } from '../data/types'
import { getSymbolUrl, getArasaacUrl } from '../lib/arasaac'
import { useLongPress } from '../hooks/useLongPress'

interface SymbolButtonProps {
  item: VocabularyItem
  language: Language
  categoryColor: string
  onTap: (item: VocabularyItem) => void
  holdToPreview?: boolean
}

export function SymbolButton({ item, language, categoryColor, onTap, holdToPreview = false }: SymbolButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const label = item.label[language]

  const handleShortTap = useCallback(() => {
    setIsPressed(true)
    onTap(item)
    setTimeout(() => setIsPressed(false), 200)
  }, [item, onTap])

  const handleLongPressStart = useCallback(() => {
    setIsPreviewing(true)
  }, [])

  const handleLongPressEnd = useCallback(() => {
    setIsPreviewing(false)
    onTap(item)
  }, [item, onTap])

  const handleCancel = useCallback(() => {
    setIsPreviewing(false)
  }, [])

  const longPressHandlers = useLongPress({
    onShortTap: handleShortTap,
    onLongPressStart: handleLongPressStart,
    onLongPressEnd: handleLongPressEnd,
    onCancel: handleCancel,
    enabled: holdToPreview,
  })

  function handleClick() {
    // When hold-to-preview is enabled, the useLongPress hook handles all interactions.
    // Prevent the default click from also firing.
    if (holdToPreview) return

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
      {...longPressHandlers}
      className={`
        flex flex-col items-center justify-between
        rounded-xl p-2 shadow-sm
        transition-all duration-150 ease-out
        active:scale-95 select-none cursor-pointer
        min-h-[110px] w-full bg-white
        border-b-4 border-r-2 border-t border-l
        hover:brightness-95
        ${isPressed ? 'scale-95 brightness-90' : ''}
        ${isPreviewing ? 'scale-110 z-10 ring-4 ring-indigo-400 shadow-xl brightness-105' : ''}
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
          className={`
            object-contain transition-all duration-150
            ${isPreviewing ? 'h-24 w-24 sm:h-28 sm:w-28' : 'h-20 w-20 sm:h-24 sm:w-24'}
          `}
          loading="lazy"
          draggable={false}
          onError={() => {
            if (!useFallback) setUseFallback(true)
          }}
        />
      </div>
      <span
        className={`
          font-bold text-gray-900 leading-tight text-center w-full truncate px-1
          ${isPreviewing ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}
        `}
        style={{ color: 'black' }}
      >
        {label}
      </span>
    </button>
  )
}
