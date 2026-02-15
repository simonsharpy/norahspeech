# TODO — Ideas & Future Work

## UX Improvements

- [ ] Persist language selection across refresh (save to localStorage/IndexedDB)
- [ ] Default to English instead of French

## Speech & Voice

- [ ] Better TTS for full sentences — current approach plays individual word clips sequentially, which sounds choppy. An API could synthesize the entire sentence as one natural utterance.
- [ ] Voice selection — let parents pick from available voices (different accents, child vs. adult voice, pitch)

## API / Backend (explore tradeoffs)

- [ ] Evaluate adding an optional lightweight API. Benefits:
  - **Sentence-level TTS** — send full sentence to a cloud TTS service (e.g. Google Cloud TTS, Azure Neural TTS) for natural prosody and intonation instead of concatenating word clips
  - **Voice customization** — expose more voices and parameters than what's available client-side
  - **Sync across devices** — share board configuration, hidden/visible tiles, and custom symbols between phone and tablet via a simple account or share link
  - **Shared configurations** — let therapists or schools push a board config to a family's devices
- [ ] Keep offline-first principle — API features should be progressive enhancements, never hard requirements. The app must always work without a connection.

## Other Ideas

- [ ] Export/import board config as JSON/QRCODE (no API needed, works offline)
- [ ] Usage analytics (local-only) — track which words Norah uses most to guide vocabulary expansion
- [ ] Custom photos — upload family photos as symbols (camera roll)
- [ ] Themes / color preferences
- [ ] Record some words
- [ ] Change size of tiles
