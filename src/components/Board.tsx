import { useState, useCallback } from 'react'
import type { VocabularyItem, CategoryId } from '../data/types'
import { useLanguage } from '../contexts/LanguageContext'
import { useBoard } from '../hooks/useBoard'
import { useSpeech } from '../hooks/useSpeech'
import { CategoryTabs } from './CategoryTabs'
import { SymbolButton } from './SymbolButton'
import { SentenceStrip } from './SentenceStrip'
import { Header } from './Header'

export function Board() {
  const { language } = useLanguage()
  const { board } = useBoard()
  const { speak, speakSentence } = useSpeech()

  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')
  const [sentence, setSentence] = useState<VocabularyItem[]>([])

  const filteredItems = activeCategory === 'all'
    ? board.items
    : board.items.filter((item) => item.categoryId === activeCategory)
  const activeCategoryData = board.categories.find((c) => c.id === activeCategory)
  const categoryColor = activeCategoryData?.color ?? '#6366f1'

  const handleSymbolTap = useCallback((item: VocabularyItem) => {
    speak(item.label[language], language)
    setSentence((prev) => [...prev, item])
  }, [speak, language])

  const handlePlaySentence = useCallback(() => {
    const words = sentence.map((item) => item.label[language])
    speakSentence(words, language)
  }, [sentence, speakSentence, language])

  const handleClearSentence = useCallback(() => {
    setSentence([])
  }, [])

  const handleRemoveLast = useCallback(() => {
    setSentence((prev) => prev.slice(0, -1))
  }, [])

  return (
    <div className="flex h-[100dvh] flex-col bg-slate-50">
      <Header />

      <div className="py-2">
        <SentenceStrip
          sentence={sentence}
          language={language}
          onPlay={handlePlaySentence}
          onClear={handleClearSentence}
          onRemoveLast={handleRemoveLast}
        />
      </div>

      <CategoryTabs
        categories={board.categories}
        activeCategory={activeCategory}
        language={language}
        onSelect={setActiveCategory}
      />

      <main className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
        <div
          data-testid="symbol-grid"
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
        >
          {filteredItems.map((item) => {
            const color = activeCategory === 'all'
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
    </div>
  )
}
