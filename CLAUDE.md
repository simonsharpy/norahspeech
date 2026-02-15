# CLAUDE.md — Project Guide for AI Assistants

## Project

**Norah Speech** — A free, open-source AAC (Augmentative and Alternative Communication) PWA for pre-literate, autistic children. See `PLAN.md` for full context.

## Tech Stack

- **React 19 + TypeScript** — UI framework
- **Vite** — build tool
- **Tailwind CSS v4** — styling
- **vite-plugin-pwa (Workbox)** — offline support / service worker
- **Web Speech API** — text-to-speech fallback (primary TTS uses pre-generated audio files)
- **Gemini Imagen** — AI-generated symbol images (via `@google/genai`), with ARASAAC as fallback
- **ARASAAC** — open-source AAC pictogram library (https://arasaac.org), used as fallback
- **IndexedDB via idb** — local on-device storage for custom boards/photos
- **Playwright** — end-to-end tests

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # ESLint
npm run typecheck    # TypeScript type checking (tsc --noEmit)
npm run test:e2e     # Run Playwright end-to-end tests
npx playwright test tests/board.spec.ts          # Run a single test file
npx playwright test --grep "speaks word"         # Run tests matching a pattern
GEMINI_API_KEY=key npm run generate:symbols      # Generate AI symbol images (one-time)
GEMINI_API_KEY=key npm run generate:symbols -- --force  # Regenerate all images
GEMINI_API_KEY=key npm run generate:symbols -- --only=happy  # Generate a single image
```

## Code Style & Conventions

- **TypeScript strict mode** — no `any` unless absolutely unavoidable, and always with a `// eslint-disable-next-line` + comment explaining why
- **Functional components only** — no class components
- **Named exports** — prefer `export function Foo()` over `export default`
- **File naming**: `PascalCase.tsx` for components, `camelCase.ts` for everything else
- **One component per file** — small helper components used only in one place can live in the same file
- **Tailwind for all styling** — no CSS files, no inline style objects unless dynamic values require it
- **No `console.log`** in committed code — use it for debugging then remove
- **Imports**: React/library imports first, then project imports, then types. No barrel files (`index.ts` re-exports).

## Architecture Notes

### Data flow

- **Vocabulary data** lives in `src/data/vocabulary.ts` as a typed constant (default board)
- **Board state** is managed via a React hook (`useBoard`) that loads from IndexedDB on mount and falls back to the default vocabulary
- **Speech** is handled by `useSpeech` hook — uses pre-generated audio files with Web Speech API as fallback
- **Audio cache** (`src/lib/audioCache.ts`) preloads mp3 files as blob URLs on startup for instant playback (works around iOS WebKit preload restrictions)
- **Language** (fr/en) is a React context so all components can access it

### Symbols

- **AI-generated images** (Gemini Imagen) are the primary symbol source, stored in `public/symbols/ai/{wordId}.webp`
- Generated once via `npm run generate:symbols` and committed as static assets
- **ARASAAC pictograms** serve as fallback (in `public/symbols/{arasaacId}.png`) — the `<img>` `onError` handler automatically falls back if an AI image is missing
- Each vocabulary entry stores both a word `id` (for AI images) and an `arasaacId` (for fallback)
- Custom symbols are stored as blobs in IndexedDB
- The generation script lives in `scripts/generateSymbols.mjs` and uses a consistent children's book illustration style prompt

### Offline strategy

- Service worker (via vite-plugin-pwa) precaches the app shell
- ARASAAC images are cached at runtime on first load via a Workbox runtime caching strategy
- All user data is in IndexedDB (never on a server)

### Audio / TTS

- Pre-generated mp3 files live in `public/audio/{en,fr}/{itemId}.mp3`
- `useSpeech` plays pre-generated audio when available, falls back to Web Speech API (`speechSynthesis`)
- Sentence playback plays individual word clips sequentially with a 120ms inter-word pause
- **Audio files must be tightly trimmed** (no leading/trailing silence) — otherwise sentence playback sounds sluggish. Use ffmpeg's `silenceremove` filter when generating new clips:
  ```bash
  ffmpeg -i input.mp3 -af "silenceremove=start_periods=1:start_threshold=-30dB,areverse,silenceremove=start_periods=1:start_threshold=-30dB,areverse" -b:a 48k output.mp3
  ```

### Bilingual support

- Each vocabulary item has `label: { en: string, fr: string }`
- TTS uses `speechSynthesis` with `lang: "en-US"` or `lang: "fr-FR"` based on current language context
- UI chrome (category names, buttons) also has bilingual strings

## Testing Strategy

We use **Playwright** for a small set of high-confidence end-to-end tests. No unit test framework — the app is UI-heavy and best validated by testing real user interactions in a real browser.

### Test philosophy

- **Few tests, high value**: each test exercises a real user flow end-to-end
- **No mocking the DOM or speech API** — tests run in a real Chromium browser
- **TTS is stubbed at the `speechSynthesis` level** in tests since CI has no audio output — we assert that `speechSynthesis.speak()` was called with the right utterance text
- **Tests must not be flaky** — use Playwright's built-in auto-waiting, avoid arbitrary `sleep()`

### What to test (see `tests/` folder)

1. **Board loads with symbols** — app renders, category tabs appear, symbol buttons are visible
2. **Tap symbol triggers speech** — tap a symbol, verify `speechSynthesis.speak()` is called with the correct word
3. **Category navigation** — tap a category tab, verify the grid updates to show that category's symbols
4. **Language switch** — toggle language, verify labels change and TTS uses the new language
5. **Sentence building** — tap multiple symbols, verify they appear in the sentence strip, play button speaks the full sentence
6. **Clear sentence** — build a sentence, tap clear, verify the strip is empty

### Running tests

```bash
# Install browsers (first time only)
npx playwright install chromium

# Run all tests
npm run test:e2e

# Run with headed browser (useful for debugging)
npx playwright test --headed

# Run a single file
npx playwright test tests/board.spec.ts
```

### Writing new tests

- Put test files in `tests/*.spec.ts`
- Use `page.getByRole()`, `page.getByText()`, `page.getByTestId()` — prefer accessible selectors
- Stub speechSynthesis in `page.addInitScript()` before navigating
- Keep tests independent — each test should work in isolation

## Deployment

- **Vercel** — auto-deploys from `main` branch
- The app is fully static (no server, no API routes, no database)
- HTTPS is required for service workers and Web Speech API

## Important Files

| File | Purpose |
|------|---------|
| `PLAN.md` | Product plan, features, vocabulary, UI sketch |
| `src/data/vocabulary.ts` | Default word list — edit this to change starter words |
| `src/hooks/useSpeech.ts` | TTS wrapper — single word and sentence playback logic |
| `src/lib/audioCache.ts` | Preloads mp3 audio as blob URLs for instant playback |
| `public/audio/` | Pre-generated mp3 files (`{en,fr}/{itemId}.mp3`) — must be silence-trimmed |
| `src/hooks/useBoard.ts` | Board state — loading, saving, editing symbols |
| `vite.config.ts` | Vite + PWA config |
| `tests/` | Playwright e2e tests |
| `playwright.config.ts` | Playwright configuration |
