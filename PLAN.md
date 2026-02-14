# Norah Speech — AAC Web App

## Overview

A free, open-source AAC (Augmentative and Alternative Communication) web app built as a **Progressive Web App (PWA)** so it can be installed on iPhone/iPad, work offline, and feel like a native app — without App Store fees.

### Who is it for?

Primarily for **Norah** (5 years old, autistic, partially verbal — sings and uses isolated words, good motor skills, pre-literate). Designed to be useful for other families in similar situations.

---

## Core Principles

- **Big, clear symbols** with spoken labels — no reading required
- **Bilingual** (French + English) with easy language switching
- **Offline-first** — works without internet after first load
- **Simple for the child, customizable for the parent**
- **Free and open-source**

---

## Features

### Phase 1 — Grid Board (MVP)

The essentials to get Norah communicating.

- [ ] **Symbol grid**: Large, tappable picture buttons organized by category
- [ ] **Categories**: People, Feelings, Food, Drinks, Actions, Places, Objects, Yes/No/Greetings
- [ ] **Text-to-speech**: Tap a symbol → it speaks the word out loud
- [ ] **Bilingual TTS**: French and English, switchable via a toggle
- [ ] **~30 core words** to start (research-backed AAC core vocabulary)
- [ ] **PWA / installable**: Add to Home Screen on iPhone/iPad, full-screen, app-like
- [ ] **Offline support**: Service worker caches everything for offline use
- [ ] **Responsive layout**: Optimized for iPhone and iPad

### Phase 2 — Sentence Building

- [ ] **Sentence strip**: Top bar where tapped symbols accumulate into a phrase
- [ ] **Play sentence**: Button to speak the full sentence aloud
- [ ] **Clear / backspace**: Remove last symbol or clear the whole sentence

### Phase 3 — Customization

- [ ] **Edit mode**: Add, remove, reorder symbols and categories
- [ ] **Custom photos**: Upload photos from camera roll (family, toys, school, etc.)
- [ ] **Custom labels**: Record or type a custom label for each symbol
- [ ] **Data stored locally**: All customizations saved on-device (IndexedDB)

### Phase 4 — Polish & Share

- [ ] **Visual/audio feedback**: Button press animation, optional sound effects
- [ ] **Themes**: Color schemes (Norah may have preferences)
- [ ] **Export/import boards**: Back up or share board configurations as JSON files
- [ ] **Usage logging** (optional, local-only): Track which words she uses most to guide vocabulary expansion

---

## Tech Stack

| Layer           | Choice                  | Why                                                      |
|-----------------|-------------------------|----------------------------------------------------------|
| Framework       | **React + TypeScript**  | Component-based, good PWA tooling, large ecosystem       |
| Build tool      | **Vite**                | Fast dev server, great PWA plugin (`vite-plugin-pwa`)    |
| Styling         | **Tailwind CSS**        | Rapid UI development, responsive utilities               |
| TTS             | **Web Speech API**      | Built into iOS Safari, supports French + English, free   |
| Symbols         | **ARASAAC**             | Free open-source AAC pictogram library (10,000+ symbols) |
| Offline         | **Service Worker (Workbox)** | Reliable offline caching via vite-plugin-pwa        |
| Local storage   | **IndexedDB (via idb)** | Store custom images and board config on-device           |
| E2E tests       | **Playwright**           | Real browser tests, reliable, great DX               |
| Hosting         | **Vercel**               | Free static hosting, HTTPS included                  |

### Why a PWA and not a native app?

- Free to distribute (no $99/year Apple Developer fee)
- Works on iPhone, iPad, Android, desktop — one codebase
- "Add to Home Screen" on iOS gives full-screen app experience
- Offline support via service workers
- No app review process, instant updates

### Why ARASAAC symbols?

[ARASAAC](https://arasaac.org) is the most widely used free symbol set in AAC worldwide. Created by the Government of Aragón (Spain), it's licensed under Creative Commons (BY-NC-SA). Over 10,000 high-quality pictograms, available via API with multilingual labels.

---

## Starter Vocabulary (~30 core words)

Based on AAC core vocabulary research, these are the most versatile words for early communicators:

| Category     | Words                                      |
|--------------|--------------------------------------------|
| Social       | yes, no, hi, bye, please, thank you, help  |
| People       | mom/maman, dad/papa, me, you               |
| Actions      | want, go, stop, more, eat, drink, play     |
| Feelings     | happy, sad, angry, tired, scared           |
| Descriptors  | big, little, hot, cold                     |
| Questions    | what, where                                |

These will be the default board. Parents can add/remove words later.

---

## UI Sketch

```
┌─────────────────────────────────────────────┐
│  [FR/EN]               Norah Speech    [⚙]  │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐ │
│  │ I want  ·  eat  ·  apple        [▶][✕] │ │  ← Sentence strip (Phase 2)
│  └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│  [People] [Actions] [Food] [Feelings] ...   │  ← Category tabs
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐   │
│  │ 🖼️   │  │ 🖼️   │  │ 🖼️   │  │ 🖼️   │   │
│  │ want  │  │  go  │  │ stop │  │ more │   │  ← Symbol grid
│  └──────┘  └──────┘  └──────┘  └──────┘   │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐   │
│  │ 🖼️   │  │ 🖼️   │  │ 🖼️   │  │ 🖼️   │   │
│  │ eat  │  │drink │  │ play │  │ help │   │
│  └──────┘  └──────┘  └──────┘  └──────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

- Large buttons (~100px+) with high-contrast colors per category
- Symbol image on top, word label below (even though she can't read yet — it supports literacy exposure)
- Touch-friendly spacing, no tiny targets

---

## Project Structure

```
norahspeech/
├── public/
│   ├── symbols/          # ARASAAC pictograms (cached offline)
│   └── manifest.json     # PWA manifest
├── src/
│   ├── components/
│   │   ├── Board.tsx          # Main grid of symbols
│   │   ├── SymbolButton.tsx   # Individual tappable symbol
│   │   ├── SentenceStrip.tsx  # Sentence building bar
│   │   ├── CategoryTabs.tsx   # Category navigation
│   │   └── Settings.tsx       # Language toggle, edit mode
│   ├── data/
│   │   └── vocabulary.ts      # Default word list with translations
│   ├── hooks/
│   │   ├── useSpeech.ts       # Web Speech API wrapper
│   │   └── useBoard.ts        # Board state management
│   ├── lib/
│   │   ├── storage.ts         # IndexedDB helpers
│   │   └── arasaac.ts         # ARASAAC API helpers
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   └── board.spec.ts     # Playwright e2e tests
├── playwright.config.ts
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── CLAUDE.md
└── PLAN.md
```

---

## Testing Strategy

**Playwright end-to-end tests** — few tests, high confidence. No unit test framework; the app is UI-heavy and best validated by real browser interactions.

| Test | What it validates |
|------|-------------------|
| Board loads with symbols | App renders, categories visible, symbol buttons appear |
| Tap symbol triggers speech | `speechSynthesis.speak()` called with correct word |
| Category navigation | Tapping a tab switches the visible symbols |
| Language switch | Labels change, TTS language changes |
| Sentence building | Symbols accumulate in strip, play speaks full sentence |
| Clear sentence | Strip empties on clear |

TTS is stubbed in tests (CI has no audio) — we verify `speechSynthesis.speak()` is called with the right text. Tests run against a local Vite preview server in Chromium.

```bash
npm run test:e2e          # run all tests
npx playwright test --headed   # debug with visible browser
```

---

## Development Phases & Milestones

| Phase | What                    | Estimated effort |
|-------|-------------------------|------------------|
| 1     | Grid board MVP + e2e tests | ~2 sessions   |
| 2     | Sentence building       | ~1 session       |
| 3     | Customization & photos  | ~2 sessions      |
| 4     | Polish & sharing        | ~1-2 sessions    |

---

## Open Questions

1. **Norah's preferred colors/characters?** — Could theme the app around something she loves
Nothing very specific right now. 

2. **Does she attend school/therapy where they use a specific symbol system?** — Consistency helps
Yes but we don't have it yet.

3. **Would you want the sentence strip from day one, or is the simple grid enough to start?**
Yes I think it make sense
