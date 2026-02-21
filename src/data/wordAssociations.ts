/**
 * Word association map for predictive suggestions.
 *
 * Maps a vocabulary item ID to an ordered list of likely follow-up word IDs.
 * Associations are designed for common AAC sentence patterns used by
 * pre-literate children (e.g. "I want eat", "go home", "more milk").
 *
 * The order matters: earlier entries are shown first as higher-priority suggestions.
 */
export const wordAssociations: Record<string, string[]> = {
  // ─── People → actions / feelings ─────────────────────────
  me: ['want', 'go', 'eat', 'drink', 'play', 'happy', 'sad', 'tired', 'hungry', 'help'],
  you: ['want', 'go', 'eat', 'drink', 'play', 'help', 'stop', 'look', 'come'],
  mom: ['help', 'come', 'look', 'want', 'go', 'love', 'please'],
  dad: ['help', 'come', 'look', 'want', 'go', 'play', 'please'],
  brother: ['play', 'stop', 'come', 'go', 'help', 'give'],
  sister: ['play', 'stop', 'come', 'go', 'help', 'give'],
  friend: ['play', 'come', 'go', 'help', 'hi', 'bye'],
  teacher: ['help', 'look', 'please', 'read', 'open'],
  baby: ['sleep', 'eat', 'drink', 'play', 'hug', 'happy', 'sad'],
  grandma: ['love', 'hug', 'come', 'help', 'hi', 'bye'],
  grandpa: ['love', 'hug', 'come', 'help', 'hi', 'bye'],

  // ─── Actions → objects / food / places / descriptors ─────
  want: ['eat', 'drink', 'play', 'go', 'more', 'help', 'water', 'milk', 'cookie', 'apple'],
  go: ['home', 'school', 'park', 'outside', 'bathroom', 'bed', 'car_place', 'store', 'now', 'please'],
  stop: ['please', 'now', 'play', 'eat'],
  more: ['eat', 'drink', 'play', 'milk', 'water', 'juice', 'cookie', 'please'],
  eat: ['apple', 'banana', 'cookie', 'bread', 'cheese', 'chicken', 'pasta', 'rice', 'yogurt', 'please'],
  drink: ['water', 'milk', 'juice', 'please', 'more'],
  play: ['outside', 'ball', 'toy', 'book', 'please', 'more', 'now'],
  give: ['me', 'please', 'water', 'milk', 'ball', 'book', 'toy'],
  make: ['cookie', 'bread', 'please', 'more'],
  look: ['me', 'book', 'please', 'what'],
  sleep: ['now', 'bed', 'night', 'tired', 'please'],
  come: ['here', 'please', 'now', 'home', 'play'],
  wait: ['please', 'now', 'me'],
  open: ['please', 'book', 'now'],
  close: ['please', 'now'],
  read: ['book', 'please', 'more', 'me'],
  sing: ['please', 'more', 'happy'],
  dance: ['please', 'more', 'happy', 'play'],
  hug: ['me', 'please', 'mom', 'dad', 'love'],
  wash: ['hand', 'please', 'now'],
  help: ['me', 'please', 'now', 'open', 'eat', 'drink'],

  // ─── Feelings → actions / people ─────────────────────────
  happy: ['play', 'dance', 'sing', 'love', 'thank_you', 'more'],
  sad: ['hug', 'help', 'mom', 'dad', 'want', 'cry'],
  angry: ['stop', 'help', 'want', 'no'],
  tired: ['sleep', 'bed', 'now', 'home'],
  scared: ['help', 'hug', 'mom', 'dad', 'stop'],
  sick: ['help', 'mom', 'dad', 'bed', 'hurt'],
  hungry: ['eat', 'want', 'more', 'please', 'now'],
  thirsty: ['drink', 'water', 'milk', 'juice', 'please'],
  excited: ['play', 'go', 'yes', 'more', 'now'],
  bored: ['play', 'go', 'what', 'want'],
  hurt: ['help', 'mom', 'dad', 'where'],

  // ─── Descriptors → nouns / actions ───────────────────────
  big: ['ball', 'book', 'cookie', 'more'],
  little: ['ball', 'book', 'cookie', 'baby'],
  hot: ['water', 'eat', 'outside', 'stop'],
  cold: ['water', 'milk', 'outside', 'blanket'],
  good: ['morning', 'night', 'eat', 'play', 'yes'],
  bad: ['stop', 'no', 'help', 'hurt'],
  all_done: ['eat', 'drink', 'play', 'go', 'thank_you'],

  // ─── Questions → people / actions / places ───────────────
  what: ['want', 'eat', 'drink', 'play', 'where'],
  where: ['go', 'mom', 'dad', 'home', 'school', 'park', 'bathroom'],
  who: ['mom', 'dad', 'friend', 'teacher'],
  when: ['go', 'eat', 'play', 'now', 'later', 'tomorrow'],
  why: ['stop', 'no', 'sad', 'angry'],
  how: ['help', 'make', 'open'],

  // ─── Social → actions / people ───────────────────────────
  hi: ['mom', 'dad', 'friend', 'teacher', 'happy'],
  bye: ['mom', 'dad', 'friend', 'teacher', 'love'],
  please: ['help', 'more', 'give', 'want', 'eat', 'drink'],
  thank_you: ['mom', 'dad', 'happy', 'love'],
  sorry: ['please', 'help', 'sad', 'hug'],
  love: ['mom', 'dad', 'you', 'hug'],
  good_morning: ['mom', 'dad', 'happy', 'eat'],
  good_night: ['mom', 'dad', 'sleep', 'love', 'hug'],

  // ─── Food → descriptors / actions ────────────────────────
  apple: ['please', 'more', 'eat', 'good', 'big'],
  banana: ['please', 'more', 'eat', 'good'],
  cookie: ['please', 'more', 'eat', 'good', 'big'],
  bread: ['please', 'more', 'eat', 'cheese'],
  cheese: ['please', 'more', 'eat', 'bread'],
  water: ['please', 'more', 'drink', 'cold'],
  milk: ['please', 'more', 'drink', 'cold'],
  juice: ['please', 'more', 'drink', 'cold'],
  chicken: ['please', 'more', 'eat', 'good'],
  pasta: ['please', 'more', 'eat', 'good'],
  rice: ['please', 'more', 'eat', 'good'],
  yogurt: ['please', 'more', 'eat', 'good'],

  // ─── Places → actions ────────────────────────────────────
  home: ['now', 'please', 'go', 'play', 'eat', 'sleep'],
  school: ['now', 'please', 'go', 'play', 'friend'],
  park: ['now', 'please', 'go', 'play', 'outside'],
  bathroom: ['now', 'please', 'go', 'help'],
  outside: ['now', 'please', 'go', 'play', 'cold', 'hot'],
  bed: ['now', 'please', 'sleep', 'tired', 'blanket'],
  car_place: ['go', 'now', 'please'],
  store: ['go', 'now', 'please', 'want'],

  // ─── Objects → actions / descriptors ─────────────────────
  book: ['read', 'please', 'more', 'big', 'new'],
  ball: ['play', 'big', 'little', 'give', 'please'],
  phone: ['please', 'want', 'give', 'look'],
  tv: ['please', 'want', 'look', 'more'],
  toy: ['play', 'want', 'please', 'give', 'new'],
  shoes: ['please', 'help', 'open', 'where'],
  hat: ['please', 'want', 'where', 'big', 'little'],
  blanket: ['please', 'want', 'cold', 'bed', 'sleep'],

  // ─── Time → actions ──────────────────────────────────────
  now: ['please', 'go', 'eat', 'drink', 'play', 'help'],
  later: ['please', 'go', 'eat', 'play'],
  today: ['go', 'play', 'eat', 'school', 'park'],
  tomorrow: ['go', 'play', 'school', 'park'],
  morning: ['eat', 'go', 'school', 'good_morning'],
  night: ['sleep', 'bed', 'good_night', 'tired'],

  // ─── Body → actions / feelings ───────────────────────────
  head: ['hurt', 'wash', 'hat'],
  hand: ['wash', 'hurt', 'help'],
  mouth: ['eat', 'drink', 'hurt', 'open'],
  eyes: ['look', 'hurt', 'open', 'close'],
  ears: ['hurt', 'sing', 'look'],
  tummy: ['hurt', 'hungry', 'eat'],
  feet: ['hurt', 'shoes', 'wash'],

  // ─── Yes/No → confirmation follow-ups ────────────────────
  yes: ['please', 'more', 'want', 'go', 'eat', 'drink', 'play', 'now'],
  no: ['stop', 'want', 'thank_you', 'more'],
}
