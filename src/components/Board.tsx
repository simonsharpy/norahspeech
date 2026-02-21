import { useState, useCallback, useEffect, useMemo } from 'react'
import type { VocabularyItem, CategoryId } from '../data/types'
import { useLanguage } from '../contexts/LanguageContext'
import { useModelingMode } from '../contexts/ModelingModeContext'
import { useBoard } from '../hooks/useBoard'
import { useSpeech } from '../hooks/useSpeech'
import { preloadAllAudio } from '../lib/audioCache'
import { CategoryTabs } from './CategoryTabs'
import { SymbolButton } from './SymbolButton'
import { SentenceStrip } from './SentenceStrip'
import { Header } from './Header'
import { TileConfigurator } from './TileConfigurator'

export function Board() {
  const { language } = useLanguage()
  const { modelingMode } = useModelingMode()
  const { board, visibleItems, toggleItemVisibility, isItemVisible } = useBoard()
  const { speak, speakSentence } = useSpeech()

  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')
  const [sentence, setSentence] = useState<VocabularyItem[]>([])
  const [configuratorOpen, setConfiguratorOpen] = useState(false)
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null)

  // Preload pre-generated audio files for all vocabulary items
  useEffect(() => {
    preloadAllAudio(board.items, ['en', 'fr'])
  }, [board.items])

  // Only show categories that have at least one visible item (plus "all")
  const visibleCategories = useMemo(() => {
    const visibleCategoryIds = new Set(visibleItems.map((item) => item.categoryId))
    return board.categories.filter((c) => c.id === 'all' || visibleCategoryIds.has(c.id))
  }, [board.categories, visibleItems])

  // If the active category no longer has visible items, fall back to "all"
  const effectiveCategory = (activeCategory !== 'all' && !visibleCategories.some((c) => c.id === activeCategory))
    ? 'all'
    : activeCategory

  const filteredItems = effectiveCategory === 'all'
    ? visibleItems
    : visibleItems.filter((item) => item.categoryId === effectiveCategory)
  const activeCategoryData = board.categories.find((c) => c.id === effectiveCategory)
  const categoryColor = activeCategoryData?.color ?? '#6366f1'

  const handleSymbolTap = useCallback((item: VocabularyItem) => {
    if (!modelingMode) {
      speak(item, language)
    } else {
      // In modeling mode, highlight the tapped symbol briefly
      setHighlightedItemId(item.id)
      setTimeout(() => setHighlightedItemId(null), 800)
    }
    setSentence((prev) => [...prev, item])
  }, [speak, language, modelingMode])

  const handlePlaySentence = useCallback(() => {
    if (!modelingMode) {
      speakSentence(sentence, language)
    }
  }, [sentence, speakSentence, language, modelingMode])

  const handleClearSentence = useCallback(() => {
    setSentence([])
  }, [])

  const handleRemoveLast = useCallback(() => {
    setSentence((prev) => prev.slice(0, -1))
  }, [])

  return (
    <div className="flex h-[100dvh] flex-col bg-gray-50">
      <Header onOpenConfigurator={() => setConfiguratorOpen(true)} />

      {modelingMode && (
        <div
          data-testid="modeling-mode-banner"
          className="flex items-center justify-center gap-2 bg-amber-50 border-b border-amber-200 px-4 py-1.5"
        >
          <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <span className="text-sm font-semibold text-amber-700">
            {language === 'fr' ? 'Mode modélisation — son désactivé' : 'Modeling mode — sound off'}
          </span>
        </div>
      )}

      <div className="pt-3 pb-1">
        <SentenceStrip
          sentence={sentence}
          language={language}
          onPlay={handlePlaySentence}
          onClear={handleClearSentence}
          onRemoveLast={handleRemoveLast}
        />
      </div>

      <CategoryTabs
        categories={visibleCategories}
        activeCategory={effectiveCategory}
        language={language}
        onSelect={setActiveCategory}
      />

      <main className="flex-1 overflow-y-auto px-4 pb-6 pt-3">
        <div
          data-testid="symbol-grid"
          className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
        >
          {filteredItems.map((item) => {
            const color = effectiveCategory === 'all'
              ? (board.categories.find((c) => c.id === item.categoryId)?.color ?? categoryColor)
              : categoryColor
            return (
              <SymbolButton
                key={item.id}
                item={item}
                language={language}
                categoryColor={color}
                onTap={handleSymbolTap}
                highlighted={modelingMode && highlightedItemId === item.id}
              />
            )
          })}
        </div>
      </main>

      {configuratorOpen && (
        <TileConfigurator
          board={board}
          language={language}
          isItemVisible={isItemVisible}
          onToggle={toggleItemVisibility}
          onClose={() => setConfiguratorOpen(false)}
        />
      )}
    </div>
  )
}
