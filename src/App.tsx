import { LanguageProvider } from './contexts/LanguageContext'
import { GridSizeProvider } from './contexts/GridSizeContext'
import { Board } from './components/Board'

export function App() {
  return (
    <LanguageProvider>
      <GridSizeProvider>
        <Board />
      </GridSizeProvider>
    </LanguageProvider>
  )
}
