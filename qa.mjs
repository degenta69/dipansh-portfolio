import { chromium } from 'playwright'
const out = '/workspace/portfolio-v2/screenshots'
const b = await chromium.launch()
const errs = []
async function run(name, vp, opts = {}) {
  const ctx = await b.newContext({ viewport: vp, isMobile: !!opts.mobile, hasTouch: !!opts.mobile, reducedMotion: opts.reduced ? 'reduce' : 'no-preference' })
  const p = await ctx.newPage()
  p.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(`${name}: ${m.type()} ${m.text()}`) })
  p.on('pageerror', e => errs.push(`${name}: pageerror ${e.message}`))
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
  await p.waitForTimeout(2800)
  await p.screenshot({ path: `${out}/${name}-01-hero.png` })
  const H = await p.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < H; y += vp.height * 0.6) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(120) }
  await p.waitForTimeout(500)
  for (const [id, f] of [['timeline','02-timeline'],['vivo','03-vivo'],['mobcoder','05-payments'],['skills','07-skills'],['contact','08-contact']]) {
    await p.evaluate(id => document.getElementById(id).scrollIntoView(), id)
    await p.waitForTimeout(700)
    await p.screenshot({ path: `${out}/${name}-${f}.png` })
  }
  // interactions
  await p.evaluate(() => document.querySelector('.console-demo').scrollIntoView({block:'center'}))
  await p.click('text=Open port'); await p.waitForTimeout(1800)
  await p.fill('.console-in input', 'status'); await p.keyboard.press('Enter')
  await p.screenshot({ path: `${out}/${name}-04-serial-console.png` })
  await p.evaluate(() => document.querySelector('.wall').scrollIntoView({block:'center'}))
  await p.click('.plug >> nth=1'); await p.waitForTimeout(600)
  await p.screenshot({ path: `${out}/${name}-06-gateway-wall.png` })
  await p.evaluate(() => document.querySelector('.vault').scrollIntoView({block:'center'}))
  await p.click('text=Lock rate'); await p.click('button:has-text("Buy")'); await p.waitForTimeout(500)
  await p.screenshot({ path: `${out}/${name}-06b-vault.png` })
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  console.log(name, 'height', H, 'h-overflow', overflow)
  await p.goto('http://localhost:4173/#/resume'); await p.waitForTimeout(500)
  await p.screenshot({ path: `${out}/${name}-09-resume.png`, fullPage: true })
  await ctx.close()
}
await run('desktop', { width: 1440, height: 900 })
await run('mobile', { width: 390, height: 844 }, { mobile: true })
await run('desktop-reduced', { width: 1440, height: 900 }, { reduced: true })
// keyboard focus
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p = await ctx.newPage()
await p.goto('http://localhost:4173/'); await p.waitForTimeout(1500)
const seq = []
for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); seq.push(await p.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return (e.textContent||e.tagName).trim().slice(0,20)+' | outline:'+cs.outlineStyle+' '+cs.outlineWidth })) }
console.log('TAB ORDER', seq)
await p.keyboard.press('Control+k'); await p.waitForTimeout(300); await p.screenshot({ path: `${out}/desktop-10-palette.png` })
console.log('palette focus', await p.evaluate(() => document.activeElement.getAttribute('aria-label')))
// basics
const a11y = await p.evaluate(() => ({ lang: document.documentElement.lang, title: document.title, h1: document.querySelectorAll('h1').length, imgsNoAlt: [...document.images].filter(i=>!i.alt).length, btnsNoName: [...document.querySelectorAll('button')].filter(b=>!(b.textContent.trim()||b.getAttribute('aria-label'))).length, meta: !!document.querySelector('meta[name=description]') }))
console.log('BASICS', a11y)
const txt = await p.evaluate(() => document.body.innerText)
for (const w of ['Kafka','Kubernetes','GraphQL','Fooyum','monolith_lambda','65+','100+','5.8']) if (txt.includes(w)) console.log('FOUND WORD', w)
console.log('ERRORS', errs)
await b.close()
