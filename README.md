# Norah Speech

A free, open-source AAC (Augmentative and Alternative Communication) web app for pre-literate children. Built as a Progressive Web App — installable on any device, works offline, no app store required.

## Why

Commercial AAC apps cost $200-400 and lock families into a single platform. Norah Speech is free, runs in any browser, and keeps all data on-device. Originally built for Norah (5, autistic, partially verbal), but designed for any family in a similar situation.

## Features

- **Symbol grid** — large, tappable picture buttons organized by category
- **Sentence building** — tap symbols to build phrases, then play them aloud
- **Text-to-speech** — pre-generated neural audio (English + French) with Web Speech API fallback
- **Bilingual** — full French/English support, switchable with one tap
- **90+ vocabulary words** across 12 categories (social, people, actions, feelings, food, places, objects, body, time, descriptors, questions)
- **Customizable** — show/hide individual tiles from the settings panel
- **Offline-first** — works without internet after the first load
- **Installable** — add to home screen on iOS/Android for a native app experience
- **Private** — zero data collection, no accounts, no tracking — everything stays on-device

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run typecheck    # TypeScript type checking
npm run test:e2e     # Playwright end-to-end tests
```

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Offline | vite-plugin-pwa (Workbox) |
| TTS | Pre-generated audio (Edge TTS) + Web Speech API fallback |
| Symbols | AI-generated (Gemini Imagen) + ARASAAC fallback |
| Storage | IndexedDB (on-device only) |
| Tests | Playwright |
| Hosting | Vercel |

## Project Structure

```
src/
├── components/       # React components (Board, Header, SymbolButton, etc.)
├── contexts/         # React contexts (language)
├── data/             # Vocabulary data and types
├── hooks/            # Custom hooks (useBoard, useSpeech)
└── lib/              # Utilities (storage, audio cache, ARASAAC helpers)
public/
├── audio/            # Pre-generated TTS audio (en/ and fr/)
├── symbols/          # ARASAAC fallback PNGs + AI-generated WebP images
└── terms.html        # Terms of service page
scripts/
├── generateSymbols.mjs   # AI symbol generation (Gemini)
├── generate-audio.py     # TTS audio generation (edge-tts)
└── download-symbols.sh   # ARASAAC pictogram downloader
tests/
└── board.spec.ts         # Playwright e2e tests
```

## Symbols

Primary symbols are AI-generated using Google Gemini Imagen in a consistent children's book illustration style. [ARASAAC](https://arasaac.org) pictograms serve as automatic fallback.

To regenerate AI symbols (requires a Gemini API key):

```bash
GEMINI_API_KEY=your_key npm run generate:symbols
```

## Audio

Pre-generated audio uses Microsoft Edge neural TTS voices (`en-US-JennyNeural`, `fr-FR-DeniseNeural`). To regenerate:

```bash
pip install edge-tts
python scripts/generate-audio.py
```

## Testing

```bash
npx playwright install chromium   # First time only
npm run test:e2e                  # Run all tests
npx playwright test --headed      # Debug with visible browser
```

## License

Source code is [MIT licensed](LICENSE). ARASAAC pictograms are [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). See [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for full third-party credits.

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/simonsharpy/norahspeech).
