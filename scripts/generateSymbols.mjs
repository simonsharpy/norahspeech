#!/usr/bin/env node

/**
 * Generate AI symbol images for Norah Speech using Gemini's native image generation.
 *
 * Usage:
 *   GEMINI_API_KEY=your_key node scripts/generateSymbols.mjs
 *
 * Options:
 *   --force     Regenerate all images (by default, existing images are skipped)
 *   --only=id   Generate only a specific word (e.g. --only=happy)
 *
 * Output:
 *   Saves WebP images to public/symbols/ai/{id}.webp
 *
 * Requires:
 *   cwebp (from libwebp) must be installed for PNG→WebP conversion.
 */

import { GoogleGenAI } from '@google/genai'
import { writeFile, mkdir, access, unlink } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUTPUT_DIR = join(ROOT, 'public', 'symbols', 'ai')

// ---------------------------------------------------------------------------
// Vocabulary — mirrors src/data/vocabulary.ts
// We duplicate here so the script stays dependency-free (no tsx/ts-node).
// ---------------------------------------------------------------------------

const vocabulary = [
  // ─── Social ────────────────────────────────────────────
  { id: 'yes', prompt: 'a child giving a big thumbs up, next to a large bright green circle with a white checkmark. The child is smiling and nodding.' },
  { id: 'no', prompt: 'a child with arms crossed in an X shape in front of their body, next to a large bright red circle with a white X. The child has a serious face shaking head side to side.' },
  { id: 'hi', prompt: 'a child facing the viewer waving one hand high above their head in greeting, with a bright yellow sun rising behind them. Cheerful open-mouth smile.' },
  { id: 'bye', prompt: 'a child seen from behind walking away on a path, turning back to wave one hand. There are small footprints on the path.' },
  { id: 'please', prompt: 'a child with both hands pressed together in front of their chest in a prayer/pleading gesture, looking up with big hopeful eyes and a gentle smile.' },
  { id: 'thank_you', prompt: 'a child holding a big red heart shape with both hands in front of their chest, eyes closed with a grateful warm smile.' },
  { id: 'help', prompt: 'a child with both arms stretched upward reaching toward a bigger hand coming from above to help them. The child looks hopeful, with an exclamation mark nearby.' },
  { id: 'sorry', prompt: 'a child with a remorseful expression, head tilted down, eyes looking up apologetically, hands clasped behind their back. A small broken vase is on the floor next to them.' },
  { id: 'love', prompt: 'a child hugging a big bright red heart tightly with both arms, eyes closed, huge warm smile, small pink hearts floating around them.' },
  { id: 'good_morning', prompt: 'a child stretching arms wide in bed with a cheerful smile, a bright yellow sun rising through a window, birds on the windowsill.' },
  { id: 'good_night', prompt: 'a child in pajamas yawning gently, holding a teddy bear, with a crescent moon and stars in a dark blue sky through a window.' },

  // ─── People ────────────────────────────────────────────
  { id: 'mom', prompt: 'a warm mother figure with long hair, wearing an apron, with a big pink heart floating above her. She has her arms open wide for a hug. Clearly an adult woman.' },
  { id: 'dad', prompt: 'a warm father figure with short hair and a beard, wearing a sweater, with a big blue heart floating above him. He has his arms open wide for a hug. Clearly an adult man.' },
  { id: 'me', prompt: 'a child pointing at themselves with both index fingers toward their own chest, with a big colorful arrow pointing down at them from above.' },
  { id: 'you', prompt: 'a child pointing directly forward at the viewer with one index finger extended, with a big colorful arrow pointing outward toward the viewer.' },
  { id: 'brother', prompt: 'two boys standing side by side, one taller than the other, the taller one with an arm around the smaller one. Both smiling. A blue heart between them.' },
  { id: 'sister', prompt: 'two girls standing side by side, one taller than the other, the taller one with an arm around the smaller one. Both smiling. A pink heart between them.' },
  { id: 'friend', prompt: 'two children of different appearances holding hands and smiling at each other, with a yellow star between them.' },
  { id: 'teacher', prompt: 'a friendly adult figure standing next to a small chalkboard, holding a pointer, wearing glasses and smiling warmly at a child.' },
  { id: 'baby', prompt: 'a cute baby sitting on the floor in a onesie, holding a rattle, with a pacifier nearby. Big round eyes and rosy cheeks.' },
  { id: 'grandma', prompt: 'a warm elderly woman with white/grey hair, glasses, wearing a cardigan, holding a plate of cookies. Gentle smile with rosy cheeks.' },
  { id: 'grandpa', prompt: 'a warm elderly man with white/grey hair, wearing a vest and glasses, sitting in a comfy chair. Gentle smile, holding a book.' },

  // ─── Actions ───────────────────────────────────────────
  { id: 'want', prompt: 'a child reaching both hands forward eagerly toward a glowing star or shiny object floating in front of them, eyes wide with desire, fingers grasping.' },
  { id: 'go', prompt: 'a child running forward energetically with a large bright green arrow pointing to the right behind them. Hair and clothes flowing with motion.' },
  { id: 'stop', prompt: 'a child holding up one flat open palm directly facing the viewer in a clear STOP gesture, with a red octagonal stop sign behind them.' },
  { id: 'more', prompt: 'a child tapping fingertips together repeatedly (ASL sign for MORE), with a large green plus sign (+) symbol floating next to them.' },
  { id: 'eat', prompt: 'a child sitting at a table with a plate of food, holding a spoon and bringing it to their open mouth. Food is colorful (fruits, vegetables).' },
  { id: 'drink', prompt: 'a child holding a big colorful cup or glass with both hands, tilting it to drink from it. Water droplets visible.' },
  { id: 'play', prompt: 'a child sitting on the floor surrounded by colorful toys — building blocks, a toy car, a teddy bear — playing happily with a big smile.' },
  { id: 'give', prompt: 'a child extending both hands forward, offering a colorful wrapped gift box to the viewer. Generous smile, arms stretched out.' },
  { id: 'make', prompt: 'a child at a table with art supplies — paint, crayons, paper — creating something colorful. Paint on their hands, focused happy expression.' },
  { id: 'look', prompt: 'a child with wide open eyes, one hand shading their eyes like a visor, looking intently into the distance. A large eye symbol nearby.' },
  { id: 'sleep', prompt: 'a child peacefully sleeping in a bed with a pillow and blanket, small Zzz letters floating above them. Moon and stars visible.' },
  { id: 'come', prompt: 'a child beckoning toward themselves with one hand, waving the viewer closer. A large curved green arrow pointing toward the child.' },
  { id: 'wait', prompt: 'a child standing still with hands at their sides, calm patient expression, with a clock or hourglass floating nearby.' },
  { id: 'open', prompt: 'a child pulling open a big colorful treasure chest with both hands, light and sparkles coming from inside. Excited face.' },
  { id: 'close', prompt: 'a child pushing a big door shut with both hands, the door partially closed. Determined expression.' },
  { id: 'read', prompt: 'a child sitting cross-legged holding an open picture book, eyes looking at the colorful pages. Small letters floating up from the book.' },
  { id: 'sing', prompt: 'a child with mouth open wide singing, musical notes of different colors floating around them. Happy joyful expression, maybe holding a microphone.' },
  { id: 'dance', prompt: 'a child spinning and dancing with arms out, one leg lifted, colorful ribbons or streamers flowing around them. Hair bouncing, huge smile.' },
  { id: 'hug', prompt: 'two children hugging each other warmly, eyes closed, smiling. Pink hearts floating around them.' },
  { id: 'wash', prompt: 'a child at a sink washing their hands with soap bubbles, water splashing. Clean sparkling hands. Soap dispenser nearby.' },

  // ─── Feelings ──────────────────────────────────────────
  { id: 'happy', prompt: 'a child with an enormous beaming smile, rosy cheeks, eyes squeezed into happy crescents, arms thrown up in the air in celebration. Yellow sparkles and stars around them.' },
  { id: 'sad', prompt: 'a child with downturned mouth, big visible teardrops falling from their eyes, shoulders slumped, looking down. A small blue rain cloud above their head.' },
  { id: 'angry', prompt: 'a child with a very angry red face, furrowed eyebrows, gritted teeth, fists clenched at their sides, stomping one foot. Small red zigzag anger marks near their head.' },
  { id: 'tired', prompt: 'a child with droopy half-closed eyes, mouth wide open in a big yawn, one hand rubbing their eye. A pillow and crescent moon with stars nearby.' },
  { id: 'scared', prompt: 'a child with huge round wide eyes, mouth in a surprised O shape, hands up near their face, trembling. Their hair is standing up slightly. Small lightning bolts of fear around them.' },
  { id: 'sick', prompt: 'a child with a pale green face, thermometer in mouth, wrapped in a blanket, looking miserable. A red cross medical symbol nearby.' },
  { id: 'hungry', prompt: 'a child holding their tummy with both hands, mouth open, looking at an empty plate on a table. Stomach growl lines coming from their belly.' },
  { id: 'thirsty', prompt: 'a child in a sunny setting, mouth open and tongue out slightly, reaching toward an empty glass. A water droplet symbol nearby.' },
  { id: 'excited', prompt: 'a child jumping up in the air with both fists raised high, huge open-mouth smile, eyes sparkling. Colorful confetti and exclamation marks around them.' },
  { id: 'bored', prompt: 'a child slumped over a table, chin resting on one hand, droopy eyelids, looking sideways with a flat expression. A clock on the wall.' },
  { id: 'hurt', prompt: 'a child holding their knee with both hands, a small bandage on it, tears in their eyes, mouth in a pained grimace. A small red cross symbol nearby.' },

  // ─── Descriptors ───────────────────────────────────────
  { id: 'big', prompt: 'a tiny child standing next to a very large friendly elephant, arms stretched wide to show how big it is. Emphasis on the size contrast.' },
  { id: 'little', prompt: 'a child kneeling down and looking through a magnifying glass at a tiny ladybug on a leaf. Emphasis on something very small and delicate.' },
  { id: 'hot', prompt: 'a child with a flushed red face, sweating, fanning themselves with one hand. A big bright orange sun with wavy heat lines above them. Warm red and orange colors.' },
  { id: 'cold', prompt: 'a child bundled in a scarf and hat, hugging themselves and shivering, with visible breath in cold air. Snowflakes falling around them. Blue and white color tones.' },
  { id: 'good', prompt: 'a child giving two thumbs up with a bright confident smile, a gold star and sparkles above them. Warm positive colors.' },
  { id: 'bad', prompt: 'a child with a frowning face shaking their head, a thumbs down gesture with one hand. A dark cloud with a red X nearby.' },
  { id: 'fast', prompt: 'a child running very fast with speed lines behind them, hair blown back by wind, a small rabbit running alongside them.' },
  { id: 'slow', prompt: 'a child walking very slowly and carefully, one foot barely lifted, next to a cute friendly turtle. Calm, unhurried expression.' },
  { id: 'up', prompt: 'a child pointing upward with one hand, looking up. A large bright arrow pointing straight up above them. A bird flying high.' },
  { id: 'down', prompt: 'a child pointing downward with one hand, looking down. A large bright arrow pointing straight down below them. A ball on the ground.' },
  { id: 'all_done', prompt: 'a child with both palms facing outward, waving them side to side in a "finished" gesture. A green checkmark and an empty clean plate on a table.' },
  { id: 'same', prompt: 'two identical teddy bears side by side with an equals sign between them. A child pointing at both with a smile.' },
  { id: 'different', prompt: 'a red circle and a blue square side by side with a not-equals sign between them. A child looking at both with a curious tilted head.' },
  { id: 'new', prompt: 'a child excitedly holding up a shiny new toy still in sparkly wrapping, eyes wide with wonder. Sparkle effects and stars around the toy.' },

  // ─── Questions ─────────────────────────────────────────
  { id: 'what', prompt: 'a child with tilted head, one eyebrow raised, both palms facing up in a shrug gesture, with a very large colorful question mark floating prominently above their head.' },
  { id: 'where', prompt: 'a child holding binoculars up to their eyes, looking and searching, with a very large colorful question mark floating above their head and small footprints on the ground.' },
  { id: 'who', prompt: 'a child with a curious expression, hand on chin, looking at silhouettes of different people. A large colorful question mark above and a magnifying glass over the silhouettes.' },
  { id: 'when', prompt: 'a child looking at a big colorful clock with a puzzled expression, one finger on their chin. A large question mark next to the clock.' },
  { id: 'why', prompt: 'a child sitting and thinking deeply, finger on temple, with thought bubbles showing a question mark. Multiple small question marks floating around their head.' },
  { id: 'how', prompt: 'a child with hands spread apart in a questioning gesture, looking at puzzle pieces scattered on a table. A large wrench and gear symbol with a question mark.' },

  // ─── Food ──────────────────────────────────────────────
  { id: 'apple', prompt: 'a single shiny red apple with a green leaf on top, sitting on a light surface. Simple, bright, clearly recognizable.' },
  { id: 'banana', prompt: 'a single bright yellow banana with a slight curve, simple and clearly recognizable on a light background.' },
  { id: 'cookie', prompt: 'a round golden-brown chocolate chip cookie with visible chocolate chips, a few crumbs around it. Warm and appetizing.' },
  { id: 'bread', prompt: 'a loaf of golden bread with a slice cut from it, sitting on a light surface. Warm, fresh-looking with steam.' },
  { id: 'cheese', prompt: 'a wedge of bright yellow cheese with holes in it, simple and clearly recognizable on a light background.' },
  { id: 'water', prompt: 'a clear glass of water with a few ice cubes, water droplets on the outside of the glass. Blue tint, refreshing look.' },
  { id: 'milk', prompt: 'a glass of white milk next to a small milk carton, simple and clearly recognizable. White and blue colors.' },
  { id: 'juice', prompt: 'a glass of bright orange juice with a straw, next to a halved orange. Fresh and colorful.' },
  { id: 'chicken', prompt: 'a cooked chicken drumstick on a plate, golden brown and appetizing. Simple, clearly recognizable as chicken.' },
  { id: 'pasta', prompt: 'a bowl of spaghetti pasta with red tomato sauce on top, a fork twirling some noodles. Colorful and appetizing.' },
  { id: 'rice', prompt: 'a bowl of white fluffy rice with steam rising from it, a spoon beside the bowl. Simple and clean.' },
  { id: 'yogurt', prompt: 'a cup of yogurt with a spoon in it, topped with colorful berries (strawberry, blueberry). Fresh and appetizing.' },

  // ─── Places ────────────────────────────────────────────
  { id: 'home', prompt: 'a cozy colorful house with a red roof, windows with curtains, a front door, smoke from chimney, flowers in front. Warm and inviting.' },
  { id: 'school', prompt: 'a friendly school building with a bell tower, wide doors, a flagpole, and a playground visible. Bright colors, welcoming.' },
  { id: 'park', prompt: 'a sunny park scene with a playground — swings, a slide, green trees, flowers, and a path. Bright and inviting.' },
  { id: 'bathroom', prompt: 'a clean bathroom with a bathtub, toilet, and sink visible. Soap bubbles floating, a rubber duck on the tub. Child-friendly colors.' },
  { id: 'outside', prompt: 'a child standing at an open door looking out at a bright sunny day with green grass, blue sky, white clouds, and a tree.' },
  { id: 'bed', prompt: 'a cozy child\'s bed with colorful blankets, pillows, and a teddy bear on it. A nightlight glowing softly nearby.' },
  { id: 'car_place', prompt: 'a cute friendly-looking car in bright colors (like a small family car), with round headlights that look like eyes. On a road.' },
  { id: 'store', prompt: 'a small friendly store front with a colorful awning, an "OPEN" sign, and items visible in the window display. Bright and welcoming.' },

  // ─── Objects ───────────────────────────────────────────
  { id: 'book', prompt: 'a colorful open storybook with illustrations visible on the pages, standing upright. Magical sparkles coming from the pages.' },
  { id: 'ball', prompt: 'a bright colorful bouncing ball (red, blue, yellow stripes), slightly bouncing off the ground with a small shadow beneath it.' },
  { id: 'phone', prompt: 'a smartphone or tablet device showing a smiling face emoji on its screen. Simple and clearly recognizable.' },
  { id: 'tv', prompt: 'a TV screen showing a colorful cartoon with a happy character on it. Simple and clearly recognizable as a television.' },
  { id: 'toy', prompt: 'a collection of colorful toys — a teddy bear, building blocks, a toy car — arranged together in a cheerful pile.' },
  { id: 'shoes', prompt: 'a pair of small colorful children\'s sneakers with velcro straps, side by side. Bright colors, clearly recognizable as shoes.' },
  { id: 'hat', prompt: 'a fun colorful children\'s hat (like a baseball cap or sunhat) with bright colors and a small star decoration.' },
  { id: 'blanket', prompt: 'a soft cozy blanket with colorful patterns (stars, stripes), draped and folded warmly. Looks soft and comforting.' },

  // ─── Body ──────────────────────────────────────────────
  { id: 'head', prompt: 'a child pointing with both hands to their own head, with a glowing highlight circle around the head area. Clear and simple.' },
  { id: 'hand', prompt: 'an open child\'s hand, palm facing the viewer, fingers spread, with a glowing highlight. Small and friendly looking.' },
  { id: 'mouth', prompt: 'a child pointing to their own open smiling mouth with one finger. A speech bubble or sound waves coming from the mouth.' },
  { id: 'eyes', prompt: 'a child pointing to their own wide open eyes with both index fingers. The eyes are large, bright, and expressive.' },
  { id: 'ears', prompt: 'a child cupping one hand behind their ear in a listening gesture, with colorful sound waves or musical notes coming toward the ear.' },
  { id: 'tummy', prompt: 'a child holding both hands on their tummy/belly area, with a glowing highlight circle around the stomach. Happy expression.' },
  { id: 'feet', prompt: 'a child sitting and pointing at their own bare feet with both hands. Cute small toes visible, colorful toenails.' },

  // ─── Time ──────────────────────────────────────────────
  { id: 'now', prompt: 'a child pointing at the ground with one finger, urgently, with a bright yellow lightning bolt and an exclamation mark. A clock showing the current moment with a highlighted center.' },
  { id: 'later', prompt: 'a child with a calm patient expression, a clock with the hands moving forward (arrow on clock), a gentle curved arrow pointing into the distance.' },
  { id: 'today', prompt: 'a child standing under a bright sun and blue sky, a calendar page with today\'s date circled in bright red. Happy daytime setting.' },
  { id: 'tomorrow', prompt: 'a child looking forward with anticipation, a calendar page with the next day circled, a sunrise on the horizon in the distance.' },
  { id: 'morning', prompt: 'a bright sunrise scene — a child stretching and waking up, golden sun peeking over the horizon, a rooster crowing. Warm golden colors.' },
  { id: 'night', prompt: 'a dark blue sky with a crescent moon and stars, a child in pajamas looking up at the sky. Cozy and calm nighttime scene.' },
]

// ---------------------------------------------------------------------------
// Consistent style prefix applied to every prompt
// ---------------------------------------------------------------------------

const STYLE_PREFIX = [
  'Generate an image for an AAC communication board for young children.',
  'The image must clearly and unambiguously represent the concept — a child should instantly understand the meaning without any text.',
  'Cute, friendly children\'s book illustration style.',
  'Soft pastel colors, rounded shapes, thick clean outlines.',
  'Simple and clear, minimal background, white or very light solid color background.',
  'Warm and cheerful, appealing for young children aged 3-6.',
  'Centered composition, no text or letters anywhere in the image.',
  'Exaggerated body language and facial expressions for clarity.',
].join(' ')

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('❌ Missing GEMINI_API_KEY environment variable.')
    console.error('   Usage: GEMINI_API_KEY=your_key node scripts/generateSymbols.mjs')
    process.exit(1)
  }

  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const onlyFlag = args.find(a => a.startsWith('--only='))
  const onlyId = onlyFlag ? onlyFlag.split('=')[1] : null

  const ai = new GoogleGenAI({ apiKey })

  await mkdir(OUTPUT_DIR, { recursive: true })

  const items = onlyId
    ? vocabulary.filter(v => v.id === onlyId)
    : vocabulary

  if (items.length === 0) {
    console.error(`❌ No vocabulary item found with id "${onlyId}"`)
    process.exit(1)
  }

  console.log(`\n🎨 Generating ${items.length} symbol image(s) with Gemini...\n`)

  let succeeded = 0
  let skipped = 0
  let failed = 0

  for (const item of items) {
    const outputPath = join(OUTPUT_DIR, `${item.id}.webp`)

    // Skip if file exists and --force not set
    if (!force) {
      try {
        await access(outputPath)
        console.log(`  ⏭  ${item.id} — already exists, skipping (use --force to regenerate)`)
        skipped++
        continue
      } catch {
        // File doesn't exist, generate it
      }
    }

    const fullPrompt = `${STYLE_PREFIX} ${item.prompt}.`

    try {
      console.log(`  🖌  ${item.id} — generating...`)

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: fullPrompt,
      })

      // Find the image part in the response
      const parts = response?.candidates?.[0]?.content?.parts
      if (!parts) {
        console.error(`  ❌ ${item.id} — no response parts returned`)
        failed++
        continue
      }

      const imagePart = parts.find(p => p.inlineData)
      if (!imagePart?.inlineData?.data) {
        console.error(`  ❌ ${item.id} — no image data in response`)
        failed++
        continue
      }

      // Save as temporary PNG, then convert to WebP
      const pngBuffer = Buffer.from(imagePart.inlineData.data, 'base64')
      const tmpPngPath = join(OUTPUT_DIR, `${item.id}.tmp.png`)
      await writeFile(tmpPngPath, pngBuffer)

      try {
        await execFileAsync('cwebp', ['-q', '80', tmpPngPath, '-o', outputPath])
      } finally {
        await unlink(tmpPngPath).catch(() => {})
      }

      const { size } = await import('node:fs').then(fs =>
        fs.promises.stat(outputPath)
      )

      console.log(`  ✅ ${item.id} — saved (${(size / 1024).toFixed(0)} KB webp, was ${(pngBuffer.length / 1024).toFixed(0)} KB png)`)
      succeeded++

      // Small delay to avoid rate limiting
      if (items.indexOf(item) < items.length - 1) {
        await sleep(1500)
      }
    } catch (err) {
      console.error(`  ❌ ${item.id} — error: ${err.message}`)
      failed++
    }
  }

  console.log(`\n📊 Done! ${succeeded} generated, ${skipped} skipped, ${failed} failed.`)
  console.log(`   Images saved to: public/symbols/ai/\n`)

  if (succeeded > 0) {
    console.log('💡 Next step: the app will automatically use these AI-generated images.')
    console.log('   Run "npm run dev" to see them in action.\n')
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
