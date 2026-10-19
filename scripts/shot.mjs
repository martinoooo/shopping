/**
 * Visual QA screenshot helper.
 *
 * Usage:
 *   node scripts/shot.mjs / home --full
 *   node scripts/shot.mjs /shop shop --mobile --full
 *   SHOT_URL=http://localhost:3000 node scripts/shot.mjs /product/ethiopia-guji pdp
 *
 * Output: .qa/<name>[-mobile].png
 * Prints console errors and page errors so regressions are easy to spot.
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const args = process.argv.slice(2)
const path = args[0] || '/'
const name = args[1] || path.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'
const mobile = args.includes('--mobile')
const full = args.includes('--full')
const base = process.env.SHOT_URL || 'http://localhost:3000'
const outDir = '.qa'
const out = `${outDir}/${name}${mobile ? '-mobile' : ''}.png`

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const context = await browser.newContext({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: mobile ? 2 : 1,
  isMobile: mobile,
  hasTouch: mobile,
  locale: 'en-US',
  // Reveal-on-scroll and CSS transitions settle instantly, so full-page shots are complete.
  reducedMotion: 'reduce',
})
const page = await context.newPage()
const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
})
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))

await mkdir(outDir, { recursive: true })
try {
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 45000 })
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.loading = 'eager'
    })
  })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(600)
  await page.waitForLoadState('networkidle')
  if (full) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0
        const timer = setInterval(() => {
          window.scrollBy(0, 700)
          y += 700
          if (y > document.body.scrollHeight + 1200) {
            clearInterval(timer)
            resolve()
          }
        }, 50)
      })
    })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)
  }
  // Wait for every image to settle so full-page shots never show skeletons.
  await page.evaluate(async () => {
    const images = [...document.images]
    await Promise.all(
      images.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true })
              img.addEventListener('error', resolve, { once: true })
              window.setTimeout(resolve, 10000)
            }),
      ),
    )
  })
  await page.waitForTimeout(400)
  await page.screenshot({ path: out, fullPage: full })
  console.log(`saved ${out}`)
} finally {
  if (errors.length) {
    console.log(`--- ${errors.length} browser error(s) ---`)
    console.log(errors.join('\n'))
  } else {
    console.log('no console errors')
  }
  await browser.close()
}
