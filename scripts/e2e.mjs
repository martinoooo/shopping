/**
 * End-to-end smoke test for the main purchase journey.
 *
 * Usage: node scripts/e2e.mjs
 * Requires the dev server on http://localhost:3000 (or BASE_URL).
 *
 * Covers: home, shop filtering/sorting/search, PDP options + subscribe + add to cart,
 * cart drawer, three-step checkout with validation + promo, order confirmation and
 * persistence, wishlist, 404, and mobile navigation/filter/buy flows.
 */
import { chromium } from 'playwright-core'

const base = process.env.BASE_URL || 'http://localhost:3000'
const results = []
const browserErrors = []

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function step(name, fn) {
  try {
    await fn()
    results.push({ name, ok: true })
    console.log(`PASS  ${name}`)
  } catch (error) {
    results.push({ name, ok: false, error: error.message })
    console.log(`FAIL  ${name} — ${error.message}`)
  }
}

async function assertNoOverflow(page, label) {
  const widths = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }))
  assert(widths.scroll <= widths.client + 1, `${label} has horizontal overflow (${widths.scroll} > ${widths.client})`)
}

function watch(page) {
  page.on('pageerror', (error) => browserErrors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`)
  })
}

const browser = await chromium.launch({ channel: 'msedge', headless: true })

try {
  /* ------------------------------ Desktop ------------------------------ */
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    reducedMotion: 'reduce',
    locale: 'en-US',
  })
  const page = await desktop.newPage()
  watch(page)

  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })

  await step('Home renders hero and product sections', async () => {
    assert(/Slow coffee/i.test(await page.locator('h1').innerText()), 'hero headline missing')
    assert((await page.locator('article').count()) >= 7, 'expected at least 7 product cards')
    await assertNoOverflow(page, 'Home')
  })

  await step('Shop deep link + facet filtering syncs to URL', async () => {
    await page.goto(`${base}/shop?category=coffee`, { waitUntil: 'networkidle' })
    assert((await page.locator('article').count()) === 9, 'expected 9 coffees')
    const light = page.getByRole('checkbox', { name: /Light/ }).first()
    await light.check({ force: true })
    await page.waitForURL(/roast=Light/)
    await page.waitForTimeout(350)
    assert((await page.locator('article').count()) === 2, 'Light roast filter should yield 2 coffees')
    assert(/2 of 9 products/.test(await page.locator('body').innerText()), 'result count not updated')
  })

  await step('Shop sorting works and is shareable', async () => {
    await page.goto(`${base}/shop?category=coffee&sort=price-asc`, { waitUntil: 'networkidle' })
    const firstCard = await page.locator('article').first().innerText()
    assert(/Brazil Cerrado/i.test(firstCard), `expected Brazil Cerrado first, got: ${firstCard.slice(0, 80)}`)
    assert(/\$18\.00/.test(firstCard), 'expected $18 price on first sorted card')
  })

  await step('Instant search finds a product and navigates', async () => {
    await page.goto(`${base}/shop`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /Search products/i }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('textbox', { name: /Search products/i }).fill('chocolate')
    await page.waitForTimeout(450)
    const text = await dialog.innerText()
    assert(/Brazil Cerrado/i.test(text), 'search did not return Brazil Cerrado')
    assert(/Costa Rica Tarraz/i.test(text), 'search did not return Costa Rica')
    await dialog.getByText('Brazil Cerrado', { exact: true }).first().click()
    await page.waitForURL(/\/product\/brazil-cerrado/)
    assert(/Brazil Cerrado/i.test(await page.locator('h1').innerText()), 'PDP title missing')
  })

  await step('PDP configures size, grind, subscription and quantity', async () => {
    await page.goto(`${base}/product/ethiopia-guji`, { waitUntil: 'networkidle' })
    await page.locator('label').filter({ hasText: '500 g' }).first().click()
    await page.locator('label').filter({ hasText: 'Pour-over' }).first().click()
    await page.locator('label').filter({ hasText: 'Subscribe & save' }).first().click()
    await page.locator('#subscription-cadence').selectOption('4-weeks')
    await page.getByRole('button', { name: 'Increase quantity' }).first().click()
    await page.waitForTimeout(250)
    const body = await page.locator('body').innerText()
    assert(/\$64\.60/.test(body), 'expected $64.60 total for 2 × $32.30')
    assert(/Every 4 weeks/.test(body), 'cadence label missing')
  })

  await step('Add to cart opens drawer with the correct subscription line', async () => {
    await page.getByRole('button', { name: /^Add to bag —/ }).first().click()
    const dialog = page.getByRole('dialog')
    await dialog.waitFor({ state: 'visible' })
    const text = await dialog.innerText()
    assert(/500\s?g/i.test(text), 'cart line missing size')
    assert(/Pour-over/i.test(text), 'cart line missing grind')
    assert(/Subscribe/i.test(text), 'cart line missing subscription badge')
    assert(/\$64\.60/.test(text), 'cart subtotal should be $64.60')
    assert(/Free standard shipping unlocked|away from free shipping/i.test(text), 'free-shipping meter missing')
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ember-oak-cart-v1') || '{}'))
    const line = stored?.state?.lines?.[0]
    assert(line?.purchaseType === 'subscribe', 'line purchase type not persisted')
    assert(line?.cadence === '4-weeks', 'cadence not persisted')
    assert(line?.quantity === 2, 'quantity not persisted')
  })

  await step('Cart drawer quantity edit recalculates totals', async () => {
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'Decrease quantity' }).click()
    await page.waitForTimeout(300)
    const text = await dialog.innerText()
    assert(/\$32\.30/.test(text), 'subtotal should drop to $32.30')
    assert(/away from free shipping/.test(text), 'free-shipping meter should reset below $60')
    await dialog.getByRole('button', { name: 'Increase quantity' }).click()
    await page.waitForTimeout(300)
    assert(/\$64\.60/.test(await dialog.innerText()), 'subtotal should return to $64.60')
  })

  let orderUrl = ''

  await step('Checkout validates, autofills and completes three steps', async () => {
    await page.getByRole('button', { name: /Checkout securely/i }).click()
    await page.waitForURL(/\/checkout/)
    await page.getByRole('button', { name: /Continue to payment/i }).click()
    await page.waitForTimeout(250)
    assert(/Enter your first name/i.test(await page.locator('body').innerText()), 'validation message missing')
    await page.getByRole('button', { name: /Autofill demo details/i }).click()
    await page.waitForTimeout(250)
    await page.getByRole('button', { name: /Continue to payment/i }).click()
    await page.waitForTimeout(300)
    assert(/Step 2 of 3/i.test(await page.locator('body').innerText()), 'did not reach payment step')
    await page.getByRole('button', { name: /Continue to review/i }).click()
    await page.waitForTimeout(300)
    assert(/Step 3 of 3/i.test(await page.locator('body').innerText()), 'did not reach review step')

    await page.locator('#promo-code').fill('WELCOME10')
    await page.getByRole('button', { name: 'Apply', exact: true }).click()
    await page.waitForTimeout(400)
    assert(/WELCOME10 applied/i.test(await page.locator('body').innerText()), 'promo code not applied')
    await page.screenshot({ path: '.qa/e2e-checkout-review.png' })

    await page.getByRole('button', { name: /Place order/i }).click()
    await page.waitForURL(/\/order\/EO-/, { timeout: 15000 })
    orderUrl = page.url()
    const confirmation = await page.locator('body').innerText()
    assert(/Thank you/i.test(confirmation), 'confirmation heading missing')
    assert(/Order confirmed/i.test(confirmation), 'order confirmed eyebrow missing')
    assert(/\$62\.79/.test(confirmation), `expected total $62.79, got: ${confirmation.match(/Total[^$]*\$[\d.]+/)?.[0]}`)
    await page.screenshot({ path: '.qa/e2e-confirmation.png' })
  })

  await step('Order confirmation survives a refresh', async () => {
    await page.reload({ waitUntil: 'networkidle' })
    assert(/Thank you/i.test(await page.locator('body').innerText()), 'order lost after refresh')
    assert(page.url() === orderUrl, 'order URL changed')
  })

  await step('Confirmation gracefully handles an unknown order', async () => {
    await page.goto(`${base}/order/EO-00000`, { waitUntil: 'networkidle' })
    assert(/can't find that order/i.test(await page.locator('body').innerText()), 'fallback missing')
  })

  await step('Wishlist saves and clears', async () => {
    await page.goto(`${base}/product/ceramic-dripper`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /^Save / }).first().click()
    await page.waitForTimeout(300)
    await page.goto(`${base}/wishlist`, { waitUntil: 'networkidle' })
    assert(/Ceramic Pour-Over Dripper/i.test(await page.locator('body').innerText()), 'saved product missing')
    await page.getByRole('button', { name: /Clear saved/i }).click()
    await page.waitForTimeout(400)
    assert(/saved list is empty|Nothing saved|Your saved list/i.test(await page.locator('body').innerText()), 'wishlist empty state missing')
  })

  await step('404 page renders', async () => {
    await page.goto(`${base}/nope`, { waitUntil: 'networkidle' })
    assert(/Lost the trail/i.test(await page.locator('body').innerText()), '404 copy missing')
    assert((await page.locator('body').innerText()).includes('404'), '404 marker missing')
  })

  /* ------------------------------ Mobile ------------------------------ */
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
    locale: 'en-US',
  })
  const m = await mobile.newPage()
  watch(m)

  await m.goto(`${base}/`, { waitUntil: 'networkidle' })
  await m.evaluate(() => localStorage.clear())
  await m.reload({ waitUntil: 'networkidle' })

  await step('Mobile home has no horizontal overflow', async () => {
    await assertNoOverflow(m, 'mobile Home')
  })

  await step('Mobile menu navigates to coffee category', async () => {
    await m.getByRole('button', { name: /Open menu/i }).click()
    await m.getByRole('link', { name: /Coffee/ }).first().click()
    await m.waitForURL(/\/shop\?category=coffee/)
    assert(/9 of 9/.test(await m.locator('body').innerText()), 'coffee count wrong on mobile')
  })

  await step('Mobile filter drawer applies a facet', async () => {
    await m.getByRole('button', { name: /Open filters/i }).click()
    const drawer = m.getByRole('dialog')
    await drawer.waitFor({ state: 'visible' })
    await drawer.getByRole('checkbox', { name: /Light/ }).first().check({ force: true })
    await drawer.getByRole('button', { name: /Show 2 products/i }).click()
    await m.waitForURL(/roast=Light/)
    await m.waitForTimeout(350)
    assert((await m.locator('article').count()) === 2, 'mobile filter did not apply')
    await assertNoOverflow(m, 'mobile Shop')
  })

  await step('Mobile PDP sticky bar adds to cart', async () => {
    await m.goto(`${base}/product/ethiopia-guji`, { waitUntil: 'networkidle' })
    await assertNoOverflow(m, 'mobile PDP')
    const sticky = m.locator('.fixed.inset-x-0.bottom-0').filter({ hasText: 'Add to bag' })
    await sticky.waitFor({ state: 'visible' })
    await sticky.getByRole('button', { name: /Add to bag/i }).click()
    await m.getByRole('dialog').waitFor({ state: 'visible' })
    assert(/Your bag/i.test(await m.getByRole('dialog').innerText()), 'cart drawer did not open on mobile')
    await m.screenshot({ path: '.qa/e2e-mobile-cart.png' })
    await m.getByRole('button', { name: /Checkout securely/i }).click()
    await m.waitForURL(/\/checkout/)
    await assertNoOverflow(m, 'mobile Checkout')
    await m.screenshot({ path: '.qa/e2e-mobile-checkout.png', fullPage: true })
  })

  await step('No browser console or page errors', async () => {
    assert(browserErrors.length === 0, `${browserErrors.length} browser error(s):\n${browserErrors.slice(0, 8).join('\n')}`)
  })
} finally {
  await browser.close()
}

const failed = results.filter((result) => !result.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (failed.length > 0) process.exitCode = 1
