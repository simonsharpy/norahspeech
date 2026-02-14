import { LanguageProvider } from './contexts/LanguageContext'
import { Board } from './components/Board'

export function App() {
  return (
    <LanguageProvider>
      <Board />
    </LanguageProvider>
  )
}
