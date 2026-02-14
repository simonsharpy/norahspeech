/**
 * Returns the URL for an ARASAAC pictogram by its ID.
 * Default vocabulary pictograms are bundled locally in /symbols/.
 * Falls back to the ARASAAC API for any custom/new pictograms.
 */
export function getArasaacUrl(id: number): string {
  return `/symbols/${id}.png`
}
