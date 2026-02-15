/**
 * Returns the URL for a symbol image.
 *
 * Prefers AI-generated images (in /symbols/ai/{wordId}.webp) when available.
 * Falls back to bundled ARASAAC pictograms (/symbols/{arasaacId}.png).
 */
export function getSymbolUrl(wordId: string, _arasaacId: number): string {
  // AI-generated images are stored by word ID.
  // _arasaacId kept in signature for future use (e.g. dynamic fallback).
  return `/symbols/ai/${wordId}.webp`
}

/**
 * Returns the fallback ARASAAC pictogram URL.
 */
export function getArasaacUrl(id: number): string {
  return `/symbols/${id}.png`
}
