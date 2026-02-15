# Attributions

Norah Speech is made possible by the following open-source projects, free resources, and services.

---

## Symbol Images

### ARASAAC Pictograms

Fallback pictograms used in this app are provided by **ARASAAC** (Aragonese Portal of Augmentative and Alternative Communication).

- **Author**: Gobierno de Aragón (Government of Aragón, Spain)
- **Website**: [https://arasaac.org](https://arasaac.org)
- **License**: [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

> Pictographic symbols used are the property of the Government of Aragón and have been created by Sergio Palao for ARASAAC (https://arasaac.org), that distributes them under Creative Commons License BY-NC-SA 4.0.

The CC BY-NC-SA license means:
- **BY** — You must give appropriate credit
- **NC** — Non-commercial use only
- **SA** — Share-alike (derivatives must use the same license)

ARASAAC pictograms are stored in `public/symbols/{arasaacId}.png`.

### AI-Generated Symbol Images

Primary symbol images are generated using **Google Gemini Imagen** (via the `@google/genai` SDK). These images are stored in `public/symbols/ai/` and were generated once using the script at `scripts/generateSymbols.mjs`.

Use of generated images is subject to [Google's Generative AI Terms of Service](https://ai.google.dev/gemini-api/terms).

---

## Audio / Text-to-Speech

### Pre-generated Audio (Microsoft Edge TTS)

Pre-recorded audio files in `public/audio/` were generated using **edge-tts**, an open-source library that interfaces with Microsoft Edge's free neural text-to-speech service.

- **Library**: [edge-tts](https://github.com/rany2/edge-tts) — MIT License
- **Voices used**:
  - English: `en-US-JennyNeural`
  - French: `fr-FR-DeniseNeural`

Use of Microsoft Edge TTS voices is subject to [Microsoft's Terms of Service](https://www.microsoft.com/en-us/servicesagreement).

### Web Speech API (Fallback)

When pre-recorded audio is unavailable, the app falls back to the browser's built-in [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) (`speechSynthesis`). This is a browser-native feature and requires no third-party attribution.

---

## Open-Source Libraries

| Library | License | Description |
|---------|---------|-------------|
| [React](https://react.dev) | MIT | UI framework |
| [React DOM](https://react.dev) | MIT | React rendering for the browser |
| [Vite](https://vite.dev) | MIT | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com) | MIT | Utility-first CSS framework |
| [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) | MIT | PWA/service worker support via Workbox |
| [idb](https://github.com/jakearchibald/idb) | ISC | IndexedDB wrapper for local storage |
| [TypeScript](https://www.typescriptlang.org) | Apache 2.0 | Type-safe JavaScript |
| [Playwright](https://playwright.dev) | Apache 2.0 | End-to-end testing framework |
| [ESLint](https://eslint.org) | MIT | Code linting |
| [@google/genai](https://github.com/google/generative-ai-js) | Apache 2.0 | Gemini API SDK (used for symbol generation) |

---

## Fonts & Icons

The app uses system fonts and inline SVG icons. No third-party icon libraries or web fonts are used.

---

## Hosting

The app is hosted on [Vercel](https://vercel.com) using their free tier for open-source projects.
