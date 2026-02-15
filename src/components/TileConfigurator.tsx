import type { BoardState, Category, Language, VocabularyItem } from '../data/types'
import { getSymbolUrl, getArasaacUrl } from '../lib/arasaac'
import { useState } from 'react'

interface TileConfiguratorProps {
  board: BoardState
  language: Language
  isItemVisible: (item: VocabularyItem) => boolean
  onToggle: (itemId: string) => void
  onClose: () => void
}

function ToggleItem({
  item,
  language,
  visible,
  onToggle,
}: {
  item: VocabularyItem
  language: Language
  visible: boolean
  onToggle: (id: string) => void
}) {
  const [useFallback, setUseFallback] = useState(false)
  const label = item.label[language]
  const imgSrc = useFallback
    ? getArasaacUrl(item.arasaacId)
    : getSymbolUrl(item.id, item.arasaacId)

  return (
    <button
      onClick={() => onToggle(item.id)}
      className={`
        flex items-center gap-3 rounded-xl px-3 py-2.5
        border-2 transition-all duration-150 cursor-pointer select-none
        ${visible
          ? 'bg-white border-indigo-300 shadow-sm'
          : 'bg-gray-100 border-gray-200 opacity-60'
        }
      `}
    >
      <img
        src={imgSrc}
        alt={label}
        className="h-10 w-10 object-contain shrink-0"
        loading="lazy"
        draggable={false}
        onError={() => {
          if (!useFallback) setUseFallback(true)
        }}
      />
      <span className="text-sm font-semibold text-gray-800 truncate flex-1 text-left">
        {label}
      </span>
      <div
        className={`
          w-10 h-6 rounded-full shrink-0 transition-colors duration-200
          flex items-center px-0.5
          ${visible ? 'bg-indigo-500' : 'bg-gray-300'}
        `}
      >
        <div
          className={`
            w-5 h-5 rounded-full bg-white shadow-sm
            transition-transform duration-200
            ${visible ? 'translate-x-4' : 'translate-x-0'}
          `}
        />
      </div>
    </button>
  )
}

function CategorySection({
  category,
  items,
  language,
  isItemVisible,
  onToggle,
}: {
  category: Category
  items: VocabularyItem[]
  language: Language
  isItemVisible: (item: VocabularyItem) => boolean
  onToggle: (id: string) => void
}) {
  if (items.length === 0) return null
  const visibleCount = items.filter(isItemVisible).length

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-2 px-1">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <h3 className="text-base font-bold text-gray-700">
          {category.label[language]}
        </h3>
        <span className="text-xs text-gray-400 font-medium">
          {visibleCount}/{items.length}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <ToggleItem
            key={item.id}
            item={item}
            language={language}
            visible={isItemVisible(item)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  )
}

export function TileConfigurator({
  board,
  language,
  isItemVisible,
  onToggle,
  onClose,
}: TileConfiguratorProps) {
  // Skip the "all" category — it's just a filter tab, not a real category
  const realCategories = board.categories.filter((c) => c.id !== 'all')

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <h2 className="text-lg font-bold text-gray-800">
          {language === 'fr' ? 'Configurer les tuiles' : 'Configure tiles'}
        </h2>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
          aria-label={language === 'fr' ? 'Fermer' : 'Close'}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Description */}
      <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100 shrink-0">
        <p className="text-sm text-indigo-700">
          {language === 'fr'
            ? 'Activez ou désactivez les mots pour personnaliser le tableau de communication.'
            : 'Toggle words on or off to customize the communication board.'}
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {realCategories.map((category) => {
          const items = board.items.filter((item) => item.categoryId === category.id)
          return (
            <CategorySection
              key={category.id}
              category={category}
              items={items}
              language={language}
              isItemVisible={isItemVisible}
              onToggle={onToggle}
            />
          )
        })}

        {/* Footer links */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <a
            href="/terms.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-indigo-500 transition-colors"
          >
            {language === 'fr' ? 'Conditions d\'utilisation & attributions' : 'Terms of service & attributions'}
          </a>
        </div>
      </div>
    </div>
  )
}
