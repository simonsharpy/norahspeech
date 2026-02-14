import { useLanguage } from '../contexts/LanguageContext'

export function Header() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
      <button
        data-testid="language-toggle"
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-bold text-indigo-700 hover:bg-indigo-200 active:scale-95 transition-all cursor-pointer select-none"
        aria-label={language === 'fr' ? 'Switch to English' : 'Passer en français'}
      >
        <span className="text-base leading-none">{language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
        <span>{language === 'fr' ? 'FR' : 'EN'}</span>
      </button>

      <h1 className="text-lg font-bold text-gray-800">
        Norah Speech
      </h1>

      <div className="w-16" />
    </header>
  )
}
