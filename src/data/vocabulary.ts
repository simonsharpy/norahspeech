import type { BoardState, Category, VocabularyItem } from './types'

export const defaultCategories: Category[] = [
  { id: 'all', label: { en: 'All', fr: 'Tout' }, color: '#64748b' },
  { id: 'social', label: { en: 'Social', fr: 'Social' }, color: '#ec4899' },
  { id: 'people', label: { en: 'People', fr: 'Personnes' }, color: '#8b5cf6' },
  { id: 'actions', label: { en: 'Actions', fr: 'Actions' }, color: '#3b82f6' },
  { id: 'feelings', label: { en: 'Feelings', fr: 'Émotions' }, color: '#f59e0b' },
  { id: 'descriptors', label: { en: 'Descriptors', fr: 'Descripteurs' }, color: '#10b981' },
  { id: 'questions', label: { en: 'Questions', fr: 'Questions' }, color: '#6366f1' },
]

export const defaultVocabulary: VocabularyItem[] = [
  // Social (7 words)
  { id: 'yes', label: { en: 'yes', fr: 'oui' }, categoryId: 'social', arasaacId: 5584 },
  { id: 'no', label: { en: 'no', fr: 'non' }, categoryId: 'social', arasaacId: 5526 },
  { id: 'hi', label: { en: 'hi', fr: 'salut' }, categoryId: 'social', arasaacId: 34567 },
  { id: 'bye', label: { en: 'bye', fr: 'au revoir' }, categoryId: 'social', arasaacId: 5896 },
  { id: 'please', label: { en: 'please', fr: 's\'il te plaît' }, categoryId: 'social', arasaacId: 8194 },
  { id: 'thank_you', label: { en: 'thank you', fr: 'merci' }, categoryId: 'social', arasaacId: 8128 },
  { id: 'help', label: { en: 'help', fr: 'aide' }, categoryId: 'social', arasaacId: 4570 },

  // People (4 words)
  { id: 'mom', label: { en: 'mom', fr: 'maman' }, categoryId: 'people', arasaacId: 2458 },
  { id: 'dad', label: { en: 'dad', fr: 'papa' }, categoryId: 'people', arasaacId: 2497 },
  { id: 'me', label: { en: 'me', fr: 'moi' }, categoryId: 'people', arasaacId: 6632 },
  { id: 'you', label: { en: 'you', fr: 'toi' }, categoryId: 'people', arasaacId: 6625 },

  // Actions (7 words)
  { id: 'want', label: { en: 'want', fr: 'vouloir' }, categoryId: 'actions', arasaacId: 5441 },
  { id: 'go', label: { en: 'go', fr: 'aller' }, categoryId: 'actions', arasaacId: 2432 },
  { id: 'stop', label: { en: 'stop', fr: 'arrêter' }, categoryId: 'actions', arasaacId: 7195 },
  { id: 'more', label: { en: 'more', fr: 'encore' }, categoryId: 'actions', arasaacId: 26913 },
  { id: 'eat', label: { en: 'eat', fr: 'manger' }, categoryId: 'actions', arasaacId: 2349 },
  { id: 'drink', label: { en: 'drink', fr: 'boire' }, categoryId: 'actions', arasaacId: 2276 },
  { id: 'play', label: { en: 'play', fr: 'jouer' }, categoryId: 'actions', arasaacId: 2439 },

  // Feelings (5 words)
  { id: 'happy', label: { en: 'happy', fr: 'content' }, categoryId: 'feelings', arasaacId: 3250 },
  { id: 'sad', label: { en: 'sad', fr: 'triste' }, categoryId: 'feelings', arasaacId: 2606 },
  { id: 'angry', label: { en: 'angry', fr: 'en colère' }, categoryId: 'feelings', arasaacId: 2374 },
  { id: 'tired', label: { en: 'tired', fr: 'fatigué' }, categoryId: 'feelings', arasaacId: 2314 },
  { id: 'scared', label: { en: 'scared', fr: 'peur' }, categoryId: 'feelings', arasaacId: 2261 },

  // Descriptors (4 words)
  { id: 'big', label: { en: 'big', fr: 'grand' }, categoryId: 'descriptors', arasaacId: 4658 },
  { id: 'little', label: { en: 'little', fr: 'petit' }, categoryId: 'descriptors', arasaacId: 4716 },
  { id: 'hot', label: { en: 'hot', fr: 'chaud' }, categoryId: 'descriptors', arasaacId: 2300 },
  { id: 'cold', label: { en: 'cold', fr: 'froid' }, categoryId: 'descriptors', arasaacId: 2401 },

  // Questions (2 words)
  { id: 'what', label: { en: 'what', fr: 'quoi' }, categoryId: 'questions', arasaacId: 22620 },
  { id: 'where', label: { en: 'where', fr: 'où' }, categoryId: 'questions', arasaacId: 7764 },
]

/** Bump this when default vocabulary changes to invalidate stale IndexedDB data */
export const BOARD_VERSION = 7

export const defaultBoard: BoardState = {
  version: BOARD_VERSION,
  categories: defaultCategories,
  items: defaultVocabulary,
}
