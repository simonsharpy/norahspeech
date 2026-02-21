import { useState, useCallback, useEffect, useMemo } from 'react'
import type { VocabularyItem, CategoryId } from '../data/types'
import { useLanguage } from '../contexts/LanguageContext'
import { useBoard } from '../hooks/useBoard'
import { useSpeech } from '../hooks/useSpeech'
import { useSuggestions } from '../hooks/useSuggestions'
import { preloadAllAudio } from '../lib/audioCache'
import { CategoryTabs } from './CategoryTabs'
import { SymbolButton } from './SymbolButton'
import { SentenceStrip } from './SentenceStrip'
import { SuggestionRow } from './SuggestionRow'
import { Header } from './Header'
import { TileConfigurator } from './TileConfigurator'

export function Board() {
  const { language } = useLanguage()
  const { board, visibleItems, toggleItemVisibility, isItemVisible } = useBoard()
  const { speak, speakSentence } = useSpeech()

  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')
  const [sentence, setSentence] = useState<VocabularyItem[]>([])
  const [configuratorOpen, setConfiguratorOpen] = useState(false)
  const suggestions = useSuggestions(sentence, visibleItems)

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
    speak(item, language)
    setSentence((prev) => [...prev, item])
  }, [speak, language])

  const handlePlaySentence = useCallback(() => {
    speakSentence(sentence, language)
  }, [sentence, speakSentence, language])

  const handleClearSentence = useCallback(() => {
    setSentence([])
  }, [])

  const handleRemoveLast = useCallback(() => {
    setSentence((prev) => prev.slice(0, -1))
  }, [])

  return (
    <div className="flex h-[100dvh] flex-col bg-gray-50">
      <Header onOpenConfigurator={() => setConfiguratorOpen(true)} />

      <div className="pt-3 pb-1">
        <SentenceStrip
          sentence={sentence}
          language={language}
          onPlay={handlePlaySentence}
          onClear={handleClearSentence}
          onRemoveLast={handleRemoveLast}
        />
      </div>

      {suggestions.length > 0 && (
        <div className="pb-1">
          <SuggestionRow
            suggestions={suggestions}
            language={language}
            onTap={handleSymbolTap}
          />
        </div>
      )}

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
