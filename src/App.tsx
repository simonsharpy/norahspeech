import { LanguageProvider } from './contexts/LanguageContext'
import { ModelingModeProvider } from './contexts/ModelingModeContext'
import { Board } from './components/Board'

export function App() {
  return (
    <LanguageProvider>
      <ModelingModeProvider>
        <Board />
      </ModelingModeProvider>
    </LanguageProvider>
  )
}
