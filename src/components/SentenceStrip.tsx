import type { VocabularyItem, Language } from '../data/types'

interface SentenceStripProps {
  sentence: VocabularyItem[]
  language: Language
  onPlay: () => void
  onClear: () => void
  onRemoveLast: () => void
}

export function SentenceStrip({ sentence, language, onPlay, onClear, onRemoveLast }: SentenceStripProps) {
  if (sentence.length === 0) {
    return (
      <div
        data-testid="sentence-strip"
        className="flex items-center justify-center h-14 mx-3 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200"
      >
        <span className="text-gray-400 text-sm">
          {language === 'fr' ? 'Appuie sur les images pour faire une phrase' : 'Tap symbols to build a sentence'}
        </span>
      </div>
    )
  }

  return (
    <div
      data-testid="sentence-strip"
      className="flex items-center gap-2 mx-3 rounded-xl bg-indigo-50 border-2 border-indigo-200 px-3 py-2 min-h-14"
    >
      <div className="flex flex-1 items-center gap-1.5 overflow-x-auto scrollbar-none">
        {sentence.map((item, index) => (
          <span
            key={`${item.id}-${index}`}
            className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-sm font-semibold text-gray-800 shadow-sm border border-indigo-100"
          >
            {item.label[language]}
          </span>
        ))}
      </div>
      <div className="flex shrink-0 gap-1.5">
        <button
          data-testid="play-sentence"
          onClick={onPlay}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md hover:bg-indigo-600 active:scale-95 transition-all cursor-pointer"
          aria-label={language === 'fr' ? 'Lire la phrase' : 'Play sentence'}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <button
          data-testid="backspace-sentence"
          onClick={onRemoveLast}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-400 text-white shadow-md hover:bg-orange-500 active:scale-95 transition-all cursor-pointer"
          aria-label={language === 'fr' ? 'Effacer le dernier' : 'Remove last'}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
            <line x1="18" y1="9" x2="12" y2="15" />
            <line x1="12" y1="9" x2="18" y2="15" />
          </svg>
        </button>
        <button
          data-testid="clear-sentence"
          onClick={onClear}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 text-white shadow-md hover:bg-red-500 active:scale-95 transition-all cursor-pointer"
          aria-label={language === 'fr' ? 'Tout effacer' : 'Clear all'}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
