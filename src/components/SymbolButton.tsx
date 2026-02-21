import { useState } from 'react'
import type { VocabularyItem, Language } from '../data/types'
import { getSymbolUrl, getArasaacUrl } from '../lib/arasaac'
import type { GridColumns } from '../contexts/GridSizeContext'

/** Image and text sizing per grid column count */
const sizeConfig: Record<GridColumns, { img: string; minH: string; text: string }> = {
  2: { img: 'h-28 w-28 sm:h-32 sm:w-32', minH: 'min-h-[160px]', text: 'text-lg font-bold sm:text-xl' },
  3: { img: 'h-20 w-20 sm:h-24 sm:w-24', minH: 'min-h-[110px]', text: 'text-sm font-bold sm:text-base' },
  4: { img: 'h-16 w-16 sm:h-20 sm:w-20', minH: 'min-h-[100px]', text: 'text-xs font-bold sm:text-sm' },
  5: { img: 'h-12 w-12 sm:h-16 sm:w-16', minH: 'min-h-[85px]', text: 'text-xs font-bold' },
}

interface SymbolButtonProps {
  item: VocabularyItem
  language: Language
  categoryColor: string
  gridColumns: GridColumns
  onTap: (item: VocabularyItem) => void
}

export function SymbolButton({ item, language, categoryColor, gridColumns, onTap }: SymbolButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const label = item.label[language]
  const sizes = sizeConfig[gridColumns]

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
        ${sizes.minH} w-full bg-white
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
          className={`${sizes.img} object-contain`}
          loading="lazy"
          draggable={false}
          onError={() => {
            if (!useFallback) setUseFallback(true)
          }}
        />
      </div>
      <span
        className={`${sizes.text} text-gray-900 leading-tight text-center w-full truncate px-1`}
        style={{ color: 'black' }} // Force high contrast
      >
        {label}
      </span>
    </button>
  )
}
