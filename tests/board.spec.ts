import { test, expect } from '@playwright/test'

// Stub speechSynthesis before each test
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const spoken: string[] = []
    const mockSpeechSynthesis = {
      speak: (utterance: SpeechSynthesisUtterance) => {
        spoken.push(utterance.text)
      },
      cancel: () => {},
      paused: false,
      speaking: false,
      pending: false,
      getVoices: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onvoiceschanged: null,
    }
    Object.defineProperty(window, 'speechSynthesis', {
      value: mockSpeechSynthesis,
      writable: true,
      configurable: true,
    })
    // Expose spoken words for assertions
    ;(window as unknown as Record<string, string[]>).__spokenWords = spoken
  })

  await page.goto('/')
})

test.describe('Board', () => {
  test('loads with symbols and category tabs', async ({ page }) => {
    // Category tabs should be visible
    await expect(page.getByTestId('category-all')).toBeVisible()
    await expect(page.getByTestId('category-social')).toBeVisible()
    await expect(page.getByTestId('category-people')).toBeVisible()
    await expect(page.getByTestId('category-actions')).toBeVisible()
    await expect(page.getByTestId('category-feelings')).toBeVisible()

    // Symbol grid should be visible with all words (default "All" tab)
    await expect(page.getByTestId('symbol-grid')).toBeVisible()
    await expect(page.getByTestId('symbol-yes')).toBeVisible()
    await expect(page.getByTestId('symbol-want')).toBeVisible()
    await expect(page.getByTestId('symbol-happy')).toBeVisible()
  })

  test('tap symbol triggers speech', async ({ page }) => {
    // Default language is French
    await page.getByTestId('symbol-yes').click()

    const spoken = await page.evaluate(() => {
      return (window as unknown as Record<string, string[]>).__spokenWords
    })
    expect(spoken).toContain('oui')
  })

  test('category navigation switches visible symbols', async ({ page }) => {
    // Start on "All" — should see symbols from every category
    await expect(page.getByTestId('symbol-yes')).toBeVisible()
    await expect(page.getByTestId('symbol-want')).toBeVisible()

    // Switch to actions
    await page.getByTestId('category-actions').click()

    // Social symbols should be hidden, action symbols visible
    await expect(page.getByTestId('symbol-yes')).not.toBeVisible()
    await expect(page.getByTestId('symbol-want')).toBeVisible()
    await expect(page.getByTestId('symbol-eat')).toBeVisible()
  })

  test('language switch changes labels and TTS language', async ({ page }) => {
    // Default is French — "oui" should be visible
    await expect(page.getByTestId('symbol-yes')).toContainText('oui')

    // Toggle to English
    await page.getByTestId('language-toggle').click()

    // Labels should now be English
    await expect(page.getByTestId('symbol-yes')).toContainText('yes')

    // Tap the symbol and verify English word was spoken
    await page.getByTestId('symbol-yes').click()
    const spoken = await page.evaluate(() => {
      return (window as unknown as Record<string, string[]>).__spokenWords
    })
    expect(spoken).toContain('yes')
  })

  test('sentence building — symbols accumulate in strip', async ({ page }) => {
    // Tap two symbols
    await page.getByTestId('symbol-hi').click()
    await page.getByTestId('symbol-please').click()

    // Sentence strip should contain both words (in French)
    const strip = page.getByTestId('sentence-strip')
    await expect(strip).toContainText('salut')
    await expect(strip).toContainText("s'il te plaît")

    // Play button should speak the full sentence
    await page.getByTestId('play-sentence').click()
    const spoken = await page.evaluate(() => {
      return (window as unknown as Record<string, string[]>).__spokenWords
    })
    // The last spoken entry should be the full sentence
    const lastSpoken = spoken[spoken.length - 1]
    expect(lastSpoken).toContain('salut')
    expect(lastSpoken).toContain("s'il te plaît")
  })

  test('clear sentence empties the strip', async ({ page }) => {
    // Build a sentence
    await page.getByTestId('symbol-yes').click()
    await page.getByTestId('symbol-no').click()

    // Strip should have content
    const strip = page.getByTestId('sentence-strip')
    await expect(strip).toContainText('oui')

    // Clear it
    await page.getByTestId('clear-sentence').click()

    // Strip should now show the empty state placeholder
    await expect(strip).not.toContainText('oui')
    await expect(strip).toContainText('Appuie sur les images')
  })
})
