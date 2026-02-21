export type Language = 'en' | 'fr'

export interface BilingualLabel {
  en: string
  fr: string
}

export type CategoryId =
  | 'all'
  | 'recents'
  | 'favorites'
  | 'social'
  | 'people'
  | 'actions'
  | 'feelings'
  | 'descriptors'
  | 'questions'
  | 'food'
  | 'places'
  | 'objects'
  | 'body'
  | 'time'

export interface Category {
  id: CategoryId
  label: BilingualLabel
  color: string
}

export interface VocabularyItem {
  id: string
  label: BilingualLabel
  categoryId: CategoryId
  arasaacId: number
  /** If true, item is hidden unless the user explicitly enables it */
  hiddenByDefault?: boolean
}

export interface BoardState {
  version: number
  categories: Category[]
  items: VocabularyItem[]
  /** User overrides: true = shown, false = hidden. Missing = use item's hiddenByDefault. */
  itemVisibility?: Record<string, boolean>
}

/** Persisted word usage history for recents and favorites */
export interface WordHistory {
  /** Ordered list of recently tapped word IDs (most recent first), capped at max length */
  recentIds: string[]
  /** Tap counts per word ID, used to derive favorites */
  tapCounts: Record<string, number>
}
