import { useLanguage } from '../contexts/LanguageContext'

export function Header() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
      <button
        data-testid="language-toggle"
        onClick={toggleLanguage}
        className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer select-none border border-gray-200"
        aria-label={language === 'fr' ? 'Switch to English' : 'Passer en français'}
      >
        <span className="text-lg leading-none">{language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
        <span>{language === 'fr' ? 'FR' : 'EN'}</span>
      </button>

      <h1 className="text-xl font-extrabold text-indigo-600 tracking-tight">
        Norah Speech
      </h1>

      <div className="w-20" />
    </header>
  )
}
