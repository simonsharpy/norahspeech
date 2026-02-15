import { useState } from 'react'
import type { VocabularyItem, Language } from '../data/types'
import { getSymbolUrl, getArasaacUrl } from '../lib/arasaac'

interface SentenceStripProps {
  sentence: VocabularyItem[]
  language: Language
  onPlay: () => void
  onClear: () => void
  onRemoveLast: () => void
}

function SentenceSymbol({ item, language }: { item: VocabularyItem; language: Language }) {
  const [useFallback, setUseFallback] = useState(false)
  const imgSrc = useFallback
    ? getArasaacUrl(item.arasaacId)
    : getSymbolUrl(item.id, item.arasaacId)

  return (
    <div className="shrink-0 flex flex-col items-center justify-center rounded-xl bg-white border border-gray-200 p-1 h-full min-w-[4rem] shadow-sm">
      <img
        src={imgSrc}
        alt={item.label[language]}
        className="h-12 w-12 object-contain"
        draggable={false}
        onError={() => {
          if (!useFallback) setUseFallback(true)
        }}
      />
      <span className="text-sm font-bold text-gray-900 leading-tight text-center truncate w-full px-1">
        {item.label[language]}
      </span>
    </div>
  )
}

export function SentenceStrip({ sentence, language, onPlay, onClear, onRemoveLast }: SentenceStripProps) {
  if (sentence.length === 0) {
    return (
      <div
        data-testid="sentence-strip"
        className="flex items-center justify-center h-24 mx-3 rounded-2xl bg-white border-2 border-dashed border-gray-300 shadow-sm"
      >
        <span className="text-gray-400 text-base font-medium">
          {language === 'fr' ? 'Appuie sur les images pour faire une phrase' : 'Tap symbols to build a sentence'}
        </span>
      </div>
    )
  }

  return (
    <div
      data-testid="sentence-strip"
      className="flex items-center gap-2 mx-3 rounded-2xl bg-white border-2 border-indigo-100 px-2 py-2 h-28 shadow-sm"
    >
      <div className="flex flex-1 items-center gap-2 overflow-x-auto scrollbar-none h-full">
        {sentence.map((item, index) => (
          <SentenceSymbol key={`${item.id}-${index}`} item={item} language={language} />
        ))}
      </div>
      <div className="flex shrink-0 gap-1 pl-1 border-l border-gray-100 h-full items-center">
        <button
          data-testid="play-sentence"
          onClick={onPlay}
          className="flex h-full w-16 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
          aria-label={language === 'fr' ? 'Lire la phrase' : 'Play sentence'}
        >
          <svg className="h-8 w-8 ml-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <div className="flex flex-col gap-1 h-full">
          <button
            data-testid="backspace-sentence"
            onClick={onRemoveLast}
            className="flex flex-1 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 active:scale-95 transition-all cursor-pointer"
            aria-label={language === 'fr' ? 'Effacer le dernier' : 'Remove last'}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <line x1="18" y1="9" x2="12" y2="15" />
              <line x1="12" y1="9" x2="18" y2="15" />
            </svg>
          </button>
          <button
            data-testid="clear-sentence"
            onClick={onClear}
            className="flex flex-1 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 active:scale-95 transition-all cursor-pointer"
            aria-label={language === 'fr' ? 'Tout effacer' : 'Clear all'}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
