#!/usr/bin/env node

/**
 * Generate a logo for Norah Speech using Gemini's native image generation.
 *
 * Usage:
 *   GEMINI_API_KEY=your_key node scripts/generateLogo.mjs
 *
 * Options:
 *   --force   Regenerate even if logo already exists
 *
 * Output:
 *   Saves images to public/:
 *     - logo.png          (original, high-res)
 *     - favicon.png       (64x64)
 *     - apple-touch-icon.png (180x180)
 *     - pwa-192x192.png   (192x192)
 *     - pwa-512x512.png   (512x512)
 *     - logo-header.png   (48x48, for the in-app header)
 *
 * Requires:
 *   sips (macOS built-in) for resizing
 */

import { GoogleGenAI } from '@google/genai'
import { writeFile, mkdir, access, copyFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC = join(ROOT, 'public')

const LOGO_PROMPT = [
  'Design an app icon / logo for "Norah Speech", an AAC (Augmentative and Alternative Communication) app for young autistic children aged 3-6.',
  'The logo should feature a friendly, cute speech bubble as the central element, with a small colorful heart or star inside the bubble to convey warmth and communication.',
  'Use soft, rounded shapes with thick clean outlines.',
  'Color palette: soft indigo/purple as primary (similar to #6366f1) with accents of warm pink, gentle yellow, and light teal.',
  'The style should match a children\'s book illustration — warm, inviting, and playful.',
  'Simple, iconic design that reads well at small sizes (app icon).',
  'Perfectly centered composition on a pure white background.',
  'No text, no letters, no words anywhere in the image.',
  'No person or character — just the speech bubble icon.',
  'Square aspect ratio, suitable for use as an app icon.',
].join(' ')

async function resizeImage(inputPath, outputPath, size) {
  await execFileAsync('sips', [
    '-z', String(size), String(size),
    '--setProperty', 'format', 'png',
    inputPath,
    '--out', outputPath,
  ])
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('❌ Missing GEMINI_API_KEY environment variable.')
    console.error('   Usage: GEMINI_API_KEY=your_key node scripts/generateLogo.mjs')
    process.exit(1)
  }

  const args = process.argv.slice(2)
  const force = args.includes('--force')

  const logoPath = join(PUBLIC, 'logo.png')

  if (!force) {
    try {
      await access(logoPath)
      console.log('⏭  logo.png already exists, use --force to regenerate.')
      console.log('   Regenerating icon sizes from existing logo...\n')
      await generateSizes(logoPath)
      return
    } catch {
      // File doesn't exist, generate it
    }
  }

  console.log('\n🎨 Generating logo with Gemini...\n')

  const ai = new GoogleGenAI({ apiKey })

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: LOGO_PROMPT,
  })

  const parts = response?.candidates?.[0]?.content?.parts
  if (!parts) {
    console.error('❌ No response parts returned')
    process.exit(1)
  }

  const imagePart = parts.find(p => p.inlineData)
  if (!imagePart?.inlineData?.data) {
    console.error('❌ No image data in response')
    process.exit(1)
  }

  const pngBuffer = Buffer.from(imagePart.inlineData.data, 'base64')
  await writeFile(logoPath, pngBuffer)

  const sizeKB = (pngBuffer.length / 1024).toFixed(0)
  console.log(`✅ logo.png saved (${sizeKB} KB)\n`)

  await generateSizes(logoPath)
}

async function generateSizes(logoPath) {
  const sizes = [
    { name: 'favicon.png', size: 64 },
    { name: 'logo-header.png', size: 96 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'pwa-192x192.png', size: 192 },
    { name: 'pwa-512x512.png', size: 512 },
  ]

  console.log('📐 Generating icon sizes...\n')

  for (const { name, size } of sizes) {
    const outputPath = join(PUBLIC, name)
    await resizeImage(logoPath, outputPath, size)
    console.log(`  ✅ ${name} (${size}x${size})`)
  }

  console.log('\n📊 Done! All icons generated.')
  console.log('   Files saved to: public/\n')
  console.log('💡 Next steps:')
  console.log('   - Review the generated logo in public/logo.png')
  console.log('   - Run "npm run dev" to see it in the app header')
  console.log('   - If you don\'t like it, re-run with --force to regenerate\n')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
