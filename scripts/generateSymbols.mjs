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
  // Social — each needs a unique, unmistakable visual cue
  { id: 'yes', prompt: 'a child giving a big thumbs up, next to a large bright green circle with a white checkmark. The child is smiling and nodding.' },
  { id: 'no', prompt: 'a child with arms crossed in an X shape in front of their body, next to a large bright red circle with a white X. The child has a serious face shaking head side to side.' },
  { id: 'hi', prompt: 'a child facing the viewer waving one hand high above their head in greeting, with a bright yellow sun rising behind them. Cheerful open-mouth smile.' },
  { id: 'bye', prompt: 'a child seen from behind walking away on a path, turning back to wave one hand. There are small footprints on the path.' },
  { id: 'please', prompt: 'a child with both hands pressed together in front of their chest in a prayer/pleading gesture, looking up with big hopeful eyes and a gentle smile.' },
  { id: 'thank_you', prompt: 'a child holding a big red heart shape with both hands in front of their chest, eyes closed with a grateful warm smile.' },
  { id: 'help', prompt: 'a child with both arms stretched upward reaching toward a bigger hand coming from above to help them. The child looks hopeful, with an exclamation mark nearby.' },

  // People — clearly distinct adult vs child figures
  { id: 'mom', prompt: 'a warm mother figure with long hair, wearing an apron, with a big pink heart floating above her. She has her arms open wide for a hug. Clearly an adult woman.' },
  { id: 'dad', prompt: 'a warm father figure with short hair and a beard, wearing a sweater, with a big blue heart floating above him. He has his arms open wide for a hug. Clearly an adult man.' },
  { id: 'me', prompt: 'a child pointing at themselves with both index fingers toward their own chest, with a big colorful arrow pointing down at them from above.' },
  { id: 'you', prompt: 'a child pointing directly forward at the viewer with one index finger extended, with a big colorful arrow pointing outward toward the viewer.' },

  // Actions — strong visual metaphors and props
  { id: 'want', prompt: 'a child reaching both hands forward eagerly toward a glowing star or shiny object floating in front of them, eyes wide with desire, fingers grasping.' },
  { id: 'go', prompt: 'a child running forward energetically with a large bright green arrow pointing to the right behind them. Hair and clothes flowing with motion.' },
  { id: 'stop', prompt: 'a child holding up one flat open palm directly facing the viewer in a clear STOP gesture, with a red octagonal stop sign behind them.' },
  { id: 'more', prompt: 'a child tapping fingertips together repeatedly (ASL sign for MORE), with a large green plus sign (+) symbol floating next to them.' },
  { id: 'eat', prompt: 'a child sitting at a table with a plate of food, holding a spoon and bringing it to their open mouth. Food is colorful (fruits, vegetables).' },
  { id: 'drink', prompt: 'a child holding a big colorful cup or glass with both hands, tilting it to drink from it. Water droplets visible.' },
  { id: 'play', prompt: 'a child sitting on the floor surrounded by colorful toys — building blocks, a toy car, a teddy bear — playing happily with a big smile.' },

  // Feelings — exaggerated facial expressions are key
  { id: 'happy', prompt: 'a child with an enormous beaming smile, rosy cheeks, eyes squeezed into happy crescents, arms thrown up in the air in celebration. Yellow sparkles and stars around them.' },
  { id: 'sad', prompt: 'a child with downturned mouth, big visible teardrops falling from their eyes, shoulders slumped, looking down. A small blue rain cloud above their head.' },
  { id: 'angry', prompt: 'a child with a very angry red face, furrowed eyebrows, gritted teeth, fists clenched at their sides, stomping one foot. Small red zigzag anger marks near their head.' },
  { id: 'tired', prompt: 'a child with droopy half-closed eyes, mouth wide open in a big yawn, one hand rubbing their eye. A pillow and crescent moon with stars nearby.' },
  { id: 'scared', prompt: 'a child with huge round wide eyes, mouth in a surprised O shape, hands up near their face, trembling. Their hair is standing up slightly. Small lightning bolts of fear around them.' },

  // Descriptors — size contrast and temperature cues
  { id: 'big', prompt: 'a tiny child standing next to a very large friendly elephant, arms stretched wide to show how big it is. Emphasis on the size contrast.' },
  { id: 'little', prompt: 'a child kneeling down and looking through a magnifying glass at a tiny ladybug on a leaf. Emphasis on something very small and delicate.' },
  { id: 'hot', prompt: 'a child with a flushed red face, sweating, fanning themselves with one hand. A big bright orange sun with wavy heat lines above them. Warm red and orange colors.' },
  { id: 'cold', prompt: 'a child bundled in a scarf and hat, hugging themselves and shivering, with visible breath in cold air. Snowflakes falling around them. Blue and white color tones.' },

  // Questions — big question marks are essential
  { id: 'what', prompt: 'a child with tilted head, one eyebrow raised, both palms facing up in a shrug gesture, with a very large colorful question mark floating prominently above their head.' },
  { id: 'where', prompt: 'a child holding binoculars up to their eyes, looking and searching, with a very large colorful question mark floating above their head and small footprints on the ground.' },
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
