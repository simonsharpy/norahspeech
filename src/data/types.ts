export type Language = 'en' | 'fr'

export interface BilingualLabel {
  en: string
  fr: string
}

export type CategoryId =
  | 'all'
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
  | 'phrases'

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

export interface QuickPhrase {
  id: string
  label: BilingualLabel
  /** Emoji icon displayed on the phrase button */
  icon: string
}

export interface BoardState {
  version: number
  categories: Category[]
  items: VocabularyItem[]
  /** User overrides: true = shown, false = hidden. Missing = use item's hiddenByDefault. */
  itemVisibility?: Record<string, boolean>
}
