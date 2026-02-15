import type { BoardState, Category, VocabularyItem } from './types'

export const defaultCategories: Category[] = [
  { id: 'all', label: { en: 'All', fr: 'Tout' }, color: '#64748b' },
  { id: 'social', label: { en: 'Social', fr: 'Social' }, color: '#ec4899' },
  { id: 'people', label: { en: 'People', fr: 'Personnes' }, color: '#8b5cf6' },
  { id: 'actions', label: { en: 'Actions', fr: 'Actions' }, color: '#3b82f6' },
  { id: 'feelings', label: { en: 'Feelings', fr: 'Émotions' }, color: '#f59e0b' },
  { id: 'descriptors', label: { en: 'Descriptors', fr: 'Descripteurs' }, color: '#10b981' },
  { id: 'questions', label: { en: 'Questions', fr: 'Questions' }, color: '#6366f1' },
  { id: 'food', label: { en: 'Food', fr: 'Nourriture' }, color: '#f97316' },
  { id: 'places', label: { en: 'Places', fr: 'Lieux' }, color: '#0ea5e9' },
  { id: 'objects', label: { en: 'Objects', fr: 'Objets' }, color: '#a855f7' },
  { id: 'body', label: { en: 'Body', fr: 'Corps' }, color: '#ef4444' },
  { id: 'time', label: { en: 'Time', fr: 'Temps' }, color: '#14b8a6' },
]

export const defaultVocabulary: VocabularyItem[] = [
  // ─── Social ────────────────────────────────────────────
  { id: 'yes', label: { en: 'yes', fr: 'oui' }, categoryId: 'social', arasaacId: 5584 },
  { id: 'no', label: { en: 'no', fr: 'non' }, categoryId: 'social', arasaacId: 5526 },
  { id: 'hi', label: { en: 'hi', fr: 'salut' }, categoryId: 'social', arasaacId: 34567 },
  { id: 'bye', label: { en: 'bye', fr: 'au revoir' }, categoryId: 'social', arasaacId: 5896 },
  { id: 'please', label: { en: 'please', fr: 's\'il te plaît' }, categoryId: 'social', arasaacId: 8194 },
  { id: 'thank_you', label: { en: 'thank you', fr: 'merci' }, categoryId: 'social', arasaacId: 8128 },
  { id: 'help', label: { en: 'help', fr: 'aide' }, categoryId: 'social', arasaacId: 4570 },
  // Extra social
  { id: 'sorry', label: { en: 'sorry', fr: 'pardon' }, categoryId: 'social', arasaacId: 11625, hiddenByDefault: true },
  { id: 'love', label: { en: 'love', fr: 'amour' }, categoryId: 'social', arasaacId: 11536, hiddenByDefault: true },
  { id: 'good_morning', label: { en: 'good morning', fr: 'bonjour' }, categoryId: 'social', arasaacId: 6944, hiddenByDefault: true },
  { id: 'good_night', label: { en: 'good night', fr: 'bonne nuit' }, categoryId: 'social', arasaacId: 6942, hiddenByDefault: true },

  // ─── People ────────────────────────────────────────────
  { id: 'mom', label: { en: 'mom', fr: 'maman' }, categoryId: 'people', arasaacId: 2458 },
  { id: 'dad', label: { en: 'dad', fr: 'papa' }, categoryId: 'people', arasaacId: 2497 },
  { id: 'me', label: { en: 'me', fr: 'moi' }, categoryId: 'people', arasaacId: 6632 },
  { id: 'you', label: { en: 'you', fr: 'toi' }, categoryId: 'people', arasaacId: 6625 },
  // Extra people
  { id: 'brother', label: { en: 'brother', fr: 'frère' }, categoryId: 'people', arasaacId: 2423, hiddenByDefault: true },
  { id: 'sister', label: { en: 'sister', fr: 'sœur' }, categoryId: 'people', arasaacId: 2422, hiddenByDefault: true },
  { id: 'friend', label: { en: 'friend', fr: 'ami' }, categoryId: 'people', arasaacId: 25790, hiddenByDefault: true },
  { id: 'teacher', label: { en: 'teacher', fr: 'enseignant' }, categoryId: 'people', arasaacId: 6556, hiddenByDefault: true },
  { id: 'baby', label: { en: 'baby', fr: 'bébé' }, categoryId: 'people', arasaacId: 6060, hiddenByDefault: true },
  { id: 'grandma', label: { en: 'grandma', fr: 'mamie' }, categoryId: 'people', arasaacId: 23710, hiddenByDefault: true },
  { id: 'grandpa', label: { en: 'grandpa', fr: 'papi' }, categoryId: 'people', arasaacId: 23718, hiddenByDefault: true },

  // ─── Actions ───────────────────────────────────────────
  { id: 'want', label: { en: 'want', fr: 'vouloir' }, categoryId: 'actions', arasaacId: 5441 },
  { id: 'go', label: { en: 'go', fr: 'aller' }, categoryId: 'actions', arasaacId: 2432 },
  { id: 'stop', label: { en: 'stop', fr: 'arrêter' }, categoryId: 'actions', arasaacId: 7195 },
  { id: 'more', label: { en: 'more', fr: 'encore' }, categoryId: 'actions', arasaacId: 26913 },
  { id: 'eat', label: { en: 'eat', fr: 'manger' }, categoryId: 'actions', arasaacId: 2349 },
  { id: 'drink', label: { en: 'drink', fr: 'boire' }, categoryId: 'actions', arasaacId: 2276 },
  { id: 'play', label: { en: 'play', fr: 'jouer' }, categoryId: 'actions', arasaacId: 2439 },
  // Extra actions
  { id: 'give', label: { en: 'give', fr: 'donner' }, categoryId: 'actions', arasaacId: 28431, hiddenByDefault: true },
  { id: 'make', label: { en: 'make', fr: 'faire' }, categoryId: 'actions', arasaacId: 32751, hiddenByDefault: true },
  { id: 'look', label: { en: 'look', fr: 'regarder' }, categoryId: 'actions', arasaacId: 6564, hiddenByDefault: true },
  { id: 'sleep', label: { en: 'sleep', fr: 'dormir' }, categoryId: 'actions', arasaacId: 6479, hiddenByDefault: true },
  { id: 'come', label: { en: 'come', fr: 'venir' }, categoryId: 'actions', arasaacId: 32669, hiddenByDefault: true },
  { id: 'wait', label: { en: 'wait', fr: 'attendre' }, categoryId: 'actions', arasaacId: 36914, hiddenByDefault: true },
  { id: 'open', label: { en: 'open', fr: 'ouvrir' }, categoryId: 'actions', arasaacId: 24825, hiddenByDefault: true },
  { id: 'close', label: { en: 'close', fr: 'fermer' }, categoryId: 'actions', arasaacId: 30383, hiddenByDefault: true },
  { id: 'read', label: { en: 'read', fr: 'lire' }, categoryId: 'actions', arasaacId: 7141, hiddenByDefault: true },
  { id: 'sing', label: { en: 'sing', fr: 'chanter' }, categoryId: 'actions', arasaacId: 6960, hiddenByDefault: true },
  { id: 'dance', label: { en: 'dance', fr: 'danser' }, categoryId: 'actions', arasaacId: 35747, hiddenByDefault: true },
  { id: 'hug', label: { en: 'hug', fr: 'câlin' }, categoryId: 'actions', arasaacId: 4550, hiddenByDefault: true },
  { id: 'wash', label: { en: 'wash', fr: 'laver' }, categoryId: 'actions', arasaacId: 34826, hiddenByDefault: true },

  // ─── Feelings ──────────────────────────────────────────
  { id: 'happy', label: { en: 'happy', fr: 'content' }, categoryId: 'feelings', arasaacId: 3250 },
  { id: 'sad', label: { en: 'sad', fr: 'triste' }, categoryId: 'feelings', arasaacId: 2606 },
  { id: 'angry', label: { en: 'angry', fr: 'en colère' }, categoryId: 'feelings', arasaacId: 2374 },
  { id: 'tired', label: { en: 'tired', fr: 'fatigué' }, categoryId: 'feelings', arasaacId: 2314 },
  { id: 'scared', label: { en: 'scared', fr: 'peur' }, categoryId: 'feelings', arasaacId: 2261 },
  // Extra feelings
  { id: 'sick', label: { en: 'sick', fr: 'malade' }, categoryId: 'feelings', arasaacId: 7040, hiddenByDefault: true },
  { id: 'hungry', label: { en: 'hungry', fr: 'faim' }, categoryId: 'feelings', arasaacId: 4962, hiddenByDefault: true },
  { id: 'thirsty', label: { en: 'thirsty', fr: 'soif' }, categoryId: 'feelings', arasaacId: 4963, hiddenByDefault: true },
  { id: 'excited', label: { en: 'excited', fr: 'excité' }, categoryId: 'feelings', arasaacId: 39090, hiddenByDefault: true },
  { id: 'bored', label: { en: 'bored', fr: 'ennuyé' }, categoryId: 'feelings', arasaacId: 35531, hiddenByDefault: true },
  { id: 'hurt', label: { en: 'hurt', fr: 'mal' }, categoryId: 'feelings', arasaacId: 5484, hiddenByDefault: true },

  // ─── Descriptors ───────────────────────────────────────
  { id: 'big', label: { en: 'big', fr: 'grand' }, categoryId: 'descriptors', arasaacId: 4658 },
  { id: 'little', label: { en: 'little', fr: 'petit' }, categoryId: 'descriptors', arasaacId: 4716 },
  { id: 'hot', label: { en: 'hot', fr: 'chaud' }, categoryId: 'descriptors', arasaacId: 2300 },
  { id: 'cold', label: { en: 'cold', fr: 'froid' }, categoryId: 'descriptors', arasaacId: 2401 },
  // Extra descriptors
  { id: 'good', label: { en: 'good', fr: 'bon' }, categoryId: 'descriptors', arasaacId: 4581, hiddenByDefault: true },
  { id: 'bad', label: { en: 'bad', fr: 'mauvais' }, categoryId: 'descriptors', arasaacId: 5504, hiddenByDefault: true },
  { id: 'fast', label: { en: 'fast', fr: 'vite' }, categoryId: 'descriptors', arasaacId: 5306, hiddenByDefault: true },
  { id: 'slow', label: { en: 'slow', fr: 'lent' }, categoryId: 'descriptors', arasaacId: 4676, hiddenByDefault: true },
  { id: 'up', label: { en: 'up', fr: 'en haut' }, categoryId: 'descriptors', arasaacId: 5388, hiddenByDefault: true },
  { id: 'down', label: { en: 'down', fr: 'en bas' }, categoryId: 'descriptors', arasaacId: 5355, hiddenByDefault: true },
  { id: 'all_done', label: { en: 'all done', fr: 'fini' }, categoryId: 'descriptors', arasaacId: 28429, hiddenByDefault: true },
  { id: 'same', label: { en: 'same', fr: 'pareil' }, categoryId: 'descriptors', arasaacId: 4667, hiddenByDefault: true },
  { id: 'different', label: { en: 'different', fr: 'différent' }, categoryId: 'descriptors', arasaacId: 4628, hiddenByDefault: true },
  { id: 'new', label: { en: 'new', fr: 'nouveau' }, categoryId: 'descriptors', arasaacId: 11316, hiddenByDefault: true },

  // ─── Questions ─────────────────────────────────────────
  { id: 'what', label: { en: 'what', fr: 'quoi' }, categoryId: 'questions', arasaacId: 22620 },
  { id: 'where', label: { en: 'where', fr: 'où' }, categoryId: 'questions', arasaacId: 7764 },
  // Extra questions
  { id: 'who', label: { en: 'who', fr: 'qui' }, categoryId: 'questions', arasaacId: 9853, hiddenByDefault: true },
  { id: 'when', label: { en: 'when', fr: 'quand' }, categoryId: 'questions', arasaacId: 32874, hiddenByDefault: true },
  { id: 'why', label: { en: 'why', fr: 'pourquoi' }, categoryId: 'questions', arasaacId: 36719, hiddenByDefault: true },
  { id: 'how', label: { en: 'how', fr: 'comment' }, categoryId: 'questions', arasaacId: 22619, hiddenByDefault: true },

  // ─── Food (all hidden by default — new category) ──────
  { id: 'apple', label: { en: 'apple', fr: 'pomme' }, categoryId: 'food', arasaacId: 2462, hiddenByDefault: true },
  { id: 'banana', label: { en: 'banana', fr: 'banane' }, categoryId: 'food', arasaacId: 2530, hiddenByDefault: true },
  { id: 'cookie', label: { en: 'cookie', fr: 'biscuit' }, categoryId: 'food', arasaacId: 8312, hiddenByDefault: true },
  { id: 'bread', label: { en: 'bread', fr: 'pain' }, categoryId: 'food', arasaacId: 2494, hiddenByDefault: true },
  { id: 'cheese', label: { en: 'cheese', fr: 'fromage' }, categoryId: 'food', arasaacId: 2541, hiddenByDefault: true },
  { id: 'water', label: { en: 'water', fr: 'eau' }, categoryId: 'food', arasaacId: 32464, hiddenByDefault: true },
  { id: 'milk', label: { en: 'milk', fr: 'lait' }, categoryId: 'food', arasaacId: 2445, hiddenByDefault: true },
  { id: 'juice', label: { en: 'juice', fr: 'jus' }, categoryId: 'food', arasaacId: 11461, hiddenByDefault: true },
  { id: 'chicken', label: { en: 'chicken', fr: 'poulet' }, categoryId: 'food', arasaacId: 4952, hiddenByDefault: true },
  { id: 'pasta', label: { en: 'pasta', fr: 'pâtes' }, categoryId: 'food', arasaacId: 8652, hiddenByDefault: true },
  { id: 'rice', label: { en: 'rice', fr: 'riz' }, categoryId: 'food', arasaacId: 6911, hiddenByDefault: true },
  { id: 'yogurt', label: { en: 'yogurt', fr: 'yaourt' }, categoryId: 'food', arasaacId: 2618, hiddenByDefault: true },

  // ─── Places (all hidden by default — new category) ────
  { id: 'home', label: { en: 'home', fr: 'maison' }, categoryId: 'places', arasaacId: 6964, hiddenByDefault: true },
  { id: 'school', label: { en: 'school', fr: 'école' }, categoryId: 'places', arasaacId: 32446, hiddenByDefault: true },
  { id: 'park', label: { en: 'park', fr: 'parc' }, categoryId: 'places', arasaacId: 5379, hiddenByDefault: true },
  { id: 'bathroom', label: { en: 'bathroom', fr: 'salle de bain' }, categoryId: 'places', arasaacId: 5921, hiddenByDefault: true },
  { id: 'outside', label: { en: 'outside', fr: 'dehors' }, categoryId: 'places', arasaacId: 5475, hiddenByDefault: true },
  { id: 'bed', label: { en: 'bed', fr: 'lit' }, categoryId: 'places', arasaacId: 25900, hiddenByDefault: true },
  { id: 'car_place', label: { en: 'car', fr: 'voiture' }, categoryId: 'places', arasaacId: 2339, hiddenByDefault: true },
  { id: 'store', label: { en: 'store', fr: 'magasin' }, categoryId: 'places', arasaacId: 35695, hiddenByDefault: true },

  // ─── Objects (all hidden by default — new category) ───
  { id: 'book', label: { en: 'book', fr: 'livre' }, categoryId: 'objects', arasaacId: 25191, hiddenByDefault: true },
  { id: 'ball', label: { en: 'ball', fr: 'ballon' }, categoryId: 'objects', arasaacId: 3241, hiddenByDefault: true },
  { id: 'phone', label: { en: 'phone', fr: 'téléphone' }, categoryId: 'objects', arasaacId: 26479, hiddenByDefault: true },
  { id: 'tv', label: { en: 'TV', fr: 'télé' }, categoryId: 'objects', arasaacId: 25498, hiddenByDefault: true },
  { id: 'toy', label: { en: 'toy', fr: 'jouet' }, categoryId: 'objects', arasaacId: 9813, hiddenByDefault: true },
  { id: 'shoes', label: { en: 'shoes', fr: 'chaussures' }, categoryId: 'objects', arasaacId: 2775, hiddenByDefault: true },
  { id: 'hat', label: { en: 'hat', fr: 'chapeau' }, categoryId: 'objects', arasaacId: 2572, hiddenByDefault: true },
  { id: 'blanket', label: { en: 'blanket', fr: 'couverture' }, categoryId: 'objects', arasaacId: 2459, hiddenByDefault: true },

  // ─── Body (all hidden by default — new category) ──────
  { id: 'head', label: { en: 'head', fr: 'tête' }, categoryId: 'body', arasaacId: 2673, hiddenByDefault: true },
  { id: 'hand', label: { en: 'hand', fr: 'main' }, categoryId: 'body', arasaacId: 2928, hiddenByDefault: true },
  { id: 'mouth', label: { en: 'mouth', fr: 'bouche' }, categoryId: 'body', arasaacId: 2663, hiddenByDefault: true },
  { id: 'eyes', label: { en: 'eyes', fr: 'yeux' }, categoryId: 'body', arasaacId: 2876, hiddenByDefault: true },
  { id: 'ears', label: { en: 'ears', fr: 'oreilles' }, categoryId: 'body', arasaacId: 2871, hiddenByDefault: true },
  { id: 'tummy', label: { en: 'tummy', fr: 'ventre' }, categoryId: 'body', arasaacId: 2786, hiddenByDefault: true },
  { id: 'feet', label: { en: 'feet', fr: 'pieds' }, categoryId: 'body', arasaacId: 25327, hiddenByDefault: true },

  // ─── Time (all hidden by default — new category) ──────
  { id: 'now', label: { en: 'now', fr: 'maintenant' }, categoryId: 'time', arasaacId: 32747, hiddenByDefault: true },
  { id: 'later', label: { en: 'later', fr: 'plus tard' }, categoryId: 'time', arasaacId: 32749, hiddenByDefault: true },
  { id: 'today', label: { en: 'today', fr: 'aujourd\'hui' }, categoryId: 'time', arasaacId: 7131, hiddenByDefault: true },
  { id: 'tomorrow', label: { en: 'tomorrow', fr: 'demain' }, categoryId: 'time', arasaacId: 38278, hiddenByDefault: true },
  { id: 'morning', label: { en: 'morning', fr: 'matin' }, categoryId: 'time', arasaacId: 25704, hiddenByDefault: true },
  { id: 'night', label: { en: 'night', fr: 'nuit' }, categoryId: 'time', arasaacId: 26997, hiddenByDefault: true },
]

/** Bump this when default vocabulary changes to invalidate stale IndexedDB data */
export const BOARD_VERSION = 9

export const defaultBoard: BoardState = {
  version: BOARD_VERSION,
  categories: defaultCategories,
  items: defaultVocabulary,
  itemVisibility: {},
}
