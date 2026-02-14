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
}

export interface BoardState {
  version: number
  categories: Category[]
  items: VocabularyItem[]
}
