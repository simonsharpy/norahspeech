import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type GridColumns = 2 | 3 | 4 | 5

interface GridSizeContextValue {
  gridColumns: GridColumns
  setGridColumns: (columns: GridColumns) => void
}

const STORAGE_KEY = 'norah-grid-columns'
const DEFAULT_COLUMNS: GridColumns = 3

function loadGridColumns(): GridColumns {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = Number(stored)
      if (parsed === 2 || parsed === 3 || parsed === 4 || parsed === 5) {
        return parsed
      }
    }
  } catch {
    // localStorage may be unavailable (private browsing, etc.)
  }
  return DEFAULT_COLUMNS
}

function saveGridColumns(columns: GridColumns): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(columns))
  } catch {
    // Silently ignore storage errors
  }
}

const GridSizeContext = createContext<GridSizeContextValue | null>(null)

export function GridSizeProvider({ children }: { children: ReactNode }) {
  const [gridColumns, setGridColumnsState] = useState<GridColumns>(loadGridColumns)

  const setGridColumns = useCallback((columns: GridColumns) => {
    setGridColumnsState(columns)
    saveGridColumns(columns)
  }, [])

  return (
    <GridSizeContext.Provider value={{ gridColumns, setGridColumns }}>
      {children}
    </GridSizeContext.Provider>
  )
}

export function useGridSize(): GridSizeContextValue {
  const ctx = useContext(GridSizeContext)
  if (!ctx) {
    throw new Error('useGridSize must be used within a GridSizeProvider')
  }
  return ctx
}
