import { useState, useCallback, useEffect, useMemo } from 'react'
import type { VocabularyItem, CategoryId, Category } from '../data/types'
import { useLanguage } from '../contexts/LanguageContext'
import { useBoard } from '../hooks/useBoard'
import { useSpeech } from '../hooks/useSpeech'
import { useWordHistory } from '../hooks/useWordHistory'
import { preloadAllAudio } from '../lib/audioCache'
import { CategoryTabs } from './CategoryTabs'
import { SymbolButton } from './SymbolButton'
import { SentenceStrip } from './SentenceStrip'
import { Header } from './Header'
import { TileConfigurator } from './TileConfigurator'

const recentsCategory: Category = {
  id: 'recents',
  label: { en: 'Recents', fr: 'Récents' },
  color: '#6366f1',
}

const favoritesCategory: Category = {
  id: 'favorites',
  label: { en: 'Favorites', fr: 'Favoris' },
  color: '#e11d48',
}

export function Board() {
  const { language } = useLanguage()
  const { board, visibleItems, toggleItemVisibility, isItemVisible } = useBoard()
  const { speak, speakSentence } = useSpeech()
  const { recordTap, recentItems, favoriteItems } = useWordHistory(board.items)

  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')
  const [sentence, setSentence] = useState<VocabularyItem[]>([])
  const [configuratorOpen, setConfiguratorOpen] = useState(false)

  // Preload pre-generated audio files for all vocabulary items
  useEffect(() => {
    preloadAllAudio(board.items, ['en', 'fr'])
  }, [board.items])

  // Build the full category list: all + recents/favorites (if non-empty) + regular categories
  const visibleCategories = useMemo(() => {
    const visibleCategoryIds = new Set(visibleItems.map((item) => item.categoryId))
    const regularCategories = board.categories.filter(
      (c) => c.id === 'all' || visibleCategoryIds.has(c.id)
    )

    // Insert recents and favorites after "all" if they have items
    const dynamicTabs: Category[] = []
    if (recentItems.length > 0) {
      dynamicTabs.push(recentsCategory)
    }
    if (favoriteItems.length > 0) {
      dynamicTabs.push(favoritesCategory)
    }

    // Place dynamic tabs right after "all"
    const allTab = regularCategories.filter((c) => c.id === 'all')
    const rest = regularCategories.filter((c) => c.id !== 'all')
    return [...allTab, ...dynamicTabs, ...rest]
  }, [board.categories, visibleItems, recentItems.length, favoriteItems.length])

  // If the active category no longer has visible items, fall back to "all"
  const effectiveCategory = (
    activeCategory !== 'all' &&
    !visibleCategories.some((c) => c.id === activeCategory)
  )
    ? 'all'
    : activeCategory

  // Determine which items to display based on active category
  const filteredItems = useMemo(() => {
    if (effectiveCategory === 'recents') return recentItems
    if (effectiveCategory === 'favorites') return favoriteItems
    if (effectiveCategory === 'all') return visibleItems
    return visibleItems.filter((item) => item.categoryId === effectiveCategory)
  }, [effectiveCategory, recentItems, favoriteItems, visibleItems])

  // Resolve category color for the active tab
  const activeCategoryData = visibleCategories.find((c) => c.id === effectiveCategory)
  const categoryColor = activeCategoryData?.color ?? '#6366f1'

  const handleSymbolTap = useCallback((item: VocabularyItem) => {
    speak(item, language)
    setSentence((prev) => [...prev, item])
    recordTap(item.id)
  }, [speak, language, recordTap])

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
