#!/bin/bash
# Download ARASAAC pictograms with consistent styling parameters
# Usage: bash scripts/download-symbols.sh

set -euo pipefail

SYMBOLS_DIR="public/symbols"
BASE_URL="https://api.arasaac.org/v1/pictograms"
# Consistent styling: color enabled, white skin, brown hair, 500px resolution
PARAMS="download=true&color=true&skin=white&hair=brown&resolution=500"

# All pictogram IDs used in vocabulary.ts (verified via ARASAAC API)
# Format: "id" (one per line)
IDS=(
  # Social
  5584   # yes
  5526   # no
  34567  # hi
  5896   # bye
  8194   # please
  8128   # thank you
  4570   # help
  11625  # sorry
  11536  # love
  6944   # good morning
  6942   # good night

  # People
  2458   # mom
  2497   # dad
  6632   # me
  6625   # you
  2423   # brother
  2422   # sister
  25790  # friend
  6556   # teacher
  6060   # baby
  23710  # grandma
  23718  # grandpa

  # Actions
  5441   # want
  2432   # go
  7195   # stop
  26913  # more
  2349   # eat
  2276   # drink
  2439   # play
  28431  # give
  32751  # make
  6564   # look
  6479   # sleep
  32669  # come
  36914  # wait
  24825  # open
  30383  # close
  7141   # read
  6960   # sing
  35747  # dance
  4550   # hug
  34826  # wash

  # Feelings
  3250   # happy
  2606   # sad
  2374   # angry
  2314   # tired
  2261   # scared
  7040   # sick
  4962   # hungry
  4963   # thirsty
  39090  # excited
  35531  # bored
  5484   # hurt

  # Descriptors
  4658   # big
  4716   # little
  2300   # hot
  2401   # cold
  4581   # good
  5504   # bad
  5306   # fast
  4676   # slow
  5388   # up
  5355   # down
  28429  # all done
  4667   # same
  4628   # different
  11316  # new

  # Questions
  22620  # what
  7764   # where
  9853   # who
  32874  # when
  36719  # why
  22619  # how

  # Food
  2462   # apple
  2530   # banana
  8312   # cookie
  2494   # bread
  2541   # cheese
  32464  # water
  2445   # milk
  11461  # juice
  4952   # chicken
  8652   # pasta
  6911   # rice
  2618   # yogurt

  # Places
  6964   # home
  32446  # school
  5379   # park
  5921   # bathroom
  5475   # outside
  25900  # bed
  2339   # car
  35695  # store

  # Objects
  25191  # book
  3241   # ball
  26479  # phone
  25498  # tv
  9813   # toy
  2775   # shoes
  2572   # hat
  2459   # blanket

  # Body
  2673   # head
  2928   # hand
  2663   # mouth
  2876   # eyes
  2871   # ears
  2786   # tummy
  25327  # feet

  # Time
  32747  # now
  32749  # later
  7131   # today
  38278  # tomorrow
  25704  # morning
  26997  # night
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
