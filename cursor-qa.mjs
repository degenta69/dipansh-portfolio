import { chromium } from 'playwright'
const out = '/workspace/portfolio-v2/screenshots'
const b = await chromium.launch(); const errs = []
async function ctxRun(name, o, fn) {
  const c = await b.newContext(o); const p = await c.newPage()
  p.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(`${name}: ${m.text()}`) })
  p.on('pageerror', e => errs.push(`${name}: ${e.message}`))
  await p.goto('http://localhost:4174/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)
  await fn(p); await c.close()
}
await ctxRun('desktop', { viewport: { width: 1440, height: 900 } }, async p => {
  console.log('exists', await p.locator('.cursor').count(), 'htmlclass', await p.evaluate(() => document.documentElement.className))
  await p.mouse.move(200, 200); await p.mouse.move(700, 400, { steps: 8 }); await p.waitForTimeout(700)
  const t = async () => p.evaluate(() => document.querySelector('.cursor-ring')._gsap?.x ?? getComputedStyle(document.querySelector('.cursor-ring')).transform)
  console.log('ring1', await t())
  await p.mouse.move(1000, 600, { steps: 8 }); await p.waitForTimeout(700); console.log('ring2', await t())
  const bb = await p.locator('.btn.primary').first().boundingBox()
  await p.mouse.move(bb.x + bb.width / 2 + 10, bb.y + bb.height / 2, { steps: 10 }); await p.waitForTimeout(900)
  await p.screenshot({ path: `${out}/cursor-01-button-hover.png` })
  await p.mouse.down(); await p.waitForTimeout(500)
  await p.screenshot({ path: `${out}/cursor-02-button-press.png` }); await p.mouse.up()
  console.log('label', await p.textContent('.cursor-label'))
  await p.locator('.nav-tools .ghost').nth(1).click(); await p.waitForTimeout(600)
  console.log('after motion off', await p.locator('.cursor').count(), await p.evaluate(() => document.documentElement.className))
})
await ctxRun('mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, async p => console.log('mobile', await p.locator('.cursor').count()))
await ctxRun('reduced', { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }, async p => console.log('reduced', await p.locator('.cursor').count()))
console.log('errors', errs); await b.close()
