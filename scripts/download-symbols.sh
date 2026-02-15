#!/bin/bash
# Download ARASAAC pictograms with consistent styling parameters
# Usage: bash scripts/download-symbols.sh

set -euo pipefail

SYMBOLS_DIR="public/symbols"
BASE_URL="https://api.arasaac.org/v1/pictograms"
# Consistent styling: color enabled, white skin, brown hair, 500px resolution
PARAMS="download=true&color=true&skin=white&hair=brown&resolution=500"

# All pictogram IDs used in vocabulary.ts
# Format: "id" (one per line)
IDS=(
  # Social
  5584   # yes (checkmark - no skin/hair, but re-download for consistency)
  5526   # no (X mark - same)
  34567  # hi (colored person waving)
  5896   # bye (colored person waving goodbye)
  8194   # please (colored person asking)
  8128   # thank you (colored person, hand on heart)
  4570   # help (two reaching hands)

  # People
  2458   # mom
  2497   # dad
  6632   # me
  6625   # you

  # Actions
  5441   # want
  2432   # go (colored person walking)
  7195   # stop (colored person, palm out)
  26913  # more
  2349   # eat (colored person eating)
  2276   # drink (colored person drinking)
  2439   # play (two colored kids playing)

  # Feelings
  3250   # happy (skin-toned face)
  2606   # sad (skin-toned face)
  2374   # angry (skin-toned face)
  2314   # tired (skin-toned face)
  2261   # scared (skin-toned face)

  # Descriptors
  4658   # big
  4716   # little
  2300   # hot
  2401   # cold (colored person shivering)

  # Questions
  22620  # what
  7764   # where
)

mkdir -p "$SYMBOLS_DIR"

echo "Downloading ${#IDS[@]} ARASAAC pictograms..."
for id in "${IDS[@]}"; do
  OUTPUT="$SYMBOLS_DIR/$id.png"
  echo "  Downloading pictogram $id..."
  curl -s -o "$OUTPUT" "$BASE_URL/$id?$PARAMS"
  if [ ! -s "$OUTPUT" ]; then
    echo "  WARNING: Failed to download pictogram $id"
  fi
done

echo "Done! Downloaded ${#IDS[@]} pictograms to $SYMBOLS_DIR/"
