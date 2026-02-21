import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface ModelingModeContextValue {
  modelingMode: boolean
  toggleModelingMode: () => void
}

const ModelingModeContext = createContext<ModelingModeContextValue | null>(null)

export function ModelingModeProvider({ children }: { children: ReactNode }) {
  const [modelingMode, setModelingMode] = useState(false)

  const toggleModelingMode = useCallback(() => {
    setModelingMode((prev) => !prev)
  }, [])

  return (
    <ModelingModeContext.Provider value={{ modelingMode, toggleModelingMode }}>
      {children}
    </ModelingModeContext.Provider>
  )
}

export function useModelingMode(): ModelingModeContextValue {
  const ctx = useContext(ModelingModeContext)
  if (!ctx) {
    throw new Error('useModelingMode must be used within a ModelingModeProvider')
  }
  return ctx
}
