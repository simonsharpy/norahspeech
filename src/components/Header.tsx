import { useLanguage } from '../contexts/LanguageContext'

export type BoardMode = 'grid' | 'scene'

interface HeaderProps {
  boardMode: BoardMode
  onToggleMode: () => void
  onOpenConfigurator: () => void
}

export function Header({ boardMode, onToggleMode, onOpenConfigurator }: HeaderProps) {
  const { language, toggleLanguage } = useLanguage()

  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <button
          data-testid="language-toggle"
          onClick={toggleLanguage}
          className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer select-none border border-gray-200"
          aria-label={language === 'fr' ? 'Switch to English' : 'Passer en francais'}
        >
          <span className="text-lg leading-none">{language === 'fr' ? '\u{1F1EB}\u{1F1F7}' : '\u{1F1EC}\u{1F1E7}'}</span>
          <span>{language === 'fr' ? 'FR' : 'EN'}</span>
        </button>

        <button
          data-testid="mode-toggle"
          onClick={onToggleMode}
          className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer select-none border border-gray-200"
          aria-label={
            boardMode === 'grid'
              ? (language === 'fr' ? 'Passer en mode scene' : 'Switch to scene mode')
              : (language === 'fr' ? 'Passer en mode grille' : 'Switch to grid mode')
          }
        >
          {boardMode === 'grid' ? (
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
            </svg>
          )}
          <span className="hidden sm:inline">
            {boardMode === 'grid'
              ? (language === 'fr' ? 'Scenes' : 'Scenes')
              : (language === 'fr' ? 'Grille' : 'Grid')
            }
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2.5">
        <img
          src="/logo-header.png"
          alt=""
          className="h-9 w-9"
        />
        <h1 className="text-xl font-extrabold tracking-tight">
          <span className="text-indigo-500">Norah</span>
          <span className="text-pink-400 ml-1.5">Speech</span>
        </h1>
      </div>

      <button
        data-testid="configure-tiles"
        onClick={onOpenConfigurator}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer border border-gray-200"
        aria-label={language === 'fr' ? 'Configurer les tuiles' : 'Configure tiles'}
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>
    </header>
  )
}
