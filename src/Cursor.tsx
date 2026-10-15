import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useMotion } from './motion'

const FINE = '(hover: hover) and (pointer: fine)'
const REDUCED = '(prefers-reduced-motion: reduce)'
const INTERACTIVE = 'a[href],button,[role="button"],summary,select,label[for],[data-cursor]'
const TEXT = 'input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]),textarea,[contenteditable="true"]'
const MAGNET = '.btn.primary,.nav nav a,.nav-tools .ghost,.brand,[data-magnetic]'

/** Pick a label for the hovered element. data-cursor wins, then context. */
function labelFor(el: Element): string {
  const d = el.closest<HTMLElement>('[data-cursor]')?.dataset.cursor
  if (d !== undefined) return d
  if (el.closest('.plug')) return 'Select'
  if (el.closest('.vault')) return 'Open'
  if (el.closest('.console-demo,.console-screen')) return 'Open'
  if (el.closest('.nav')) return 'Go'
  if (el.closest('.demo')) return 'Open'
  if (el.closest('a[href^="mailto"]')) return 'Mail'
  if (el.closest('a[href]')) return 'View'
  return ''
}

export default function Cursor() {
  const { motion } = useMotion()
  const [fine, setFine] = useState(() => matchMedia(FINE).matches)
  const [reduced, setReduced] = useState(() => matchMedia(REDUCED).matches)
  useEffect(() => {
    const a = matchMedia(FINE), b = matchMedia(REDUCED)
    const ha = () => setFine(a.matches), hb = () => setReduced(b.matches)
    a.addEventListener('change', ha); b.addEventListener('change', hb)
    return () => { a.removeEventListener('change', ha); b.removeEventListener('change', hb) }
  }, [])
  const active = fine && !reduced && motion
  return active ? <CursorInner /> : null
}

function CursorInner() {
  const root = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const ringPos = useRef<HTMLDivElement>(null)
  const ringShape = useRef<HTMLDivElement>(null)
  const labelEl = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const html = document.documentElement
    const rootEl = root.current!, dotEl = dot.current!, posEl = ringPos.current!, shape = ringShape.current!, lbl = labelEl.current!
    html.classList.add('has-cursor')

    gsap.set([dotEl, posEl], { xPercent: -50, yPercent: -50, x: -100, y: -100 })
    const dx = gsap.quickTo(dotEl, 'x', { duration: 0.04, ease: 'none' })
    const dy = gsap.quickTo(dotEl, 'y', { duration: 0.04, ease: 'none' })
    const rx = gsap.quickTo(posEl, 'x', { duration: 0.55, ease: 'power3.out' })
    const ry = gsap.quickTo(posEl, 'y', { duration: 0.55, ease: 'power3.out' })
    const sx = gsap.quickTo(shape, 'scaleX', { duration: 0.35, ease: 'power3.out' })
    const sy = gsap.quickTo(shape, 'scaleY', { duration: 0.35, ease: 'power3.out' })
    const rot = gsap.quickTo(shape, 'rotation', { duration: 0.2, ease: 'power2.out' })
    const vis = gsap.quickTo(rootEl, 'opacity', { duration: 0.25, ease: 'power2.out' })

    let mode: 'idle' | 'hover' | 'text' = 'idle'
    let pressed = false
    let size = 1, curLabel = ''
    let px = -100, py = -100, lx = -100, ly = -100, seen = false
    let magnet: HTMLElement | null = null
    const magX = new WeakMap<HTMLElement, [gsap.QuickToFunc, gsap.QuickToFunc]>()

    const render = () => {
      const s = pressed ? 0.7 : 1
      const dotScale = mode === 'text' ? 0 : mode === 'hover' ? 0.4 : 1
      gsap.to(dotEl, { scale: dotScale * (pressed ? 0.7 : 1), duration: 0.25, ease: 'power3.out', overwrite: 'auto' })
      gsap.to(posEl, { scale: s, duration: 0.25, ease: 'power3.out', overwrite: 'auto' })
      if (mode === 'text') {
        gsap.to(shape, { width: 2, height: 26, borderRadius: 2, duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
        gsap.to(lbl, { opacity: 0, duration: 0.15 })
        shape.classList.remove('is-hover'); shape.classList.add('is-text')
      } else {
        shape.classList.remove('is-text')
        shape.classList.toggle('is-hover', mode === 'hover')
        const big = mode === 'hover' ? (curLabel ? 72 : 52) : 34
        gsap.to(shape, { width: big, height: big, borderRadius: big, duration: 0.4, ease: 'back.out(1.6)', overwrite: 'auto' })
        lbl.textContent = curLabel
        gsap.to(lbl, { opacity: mode === 'hover' && curLabel ? 1 : 0, duration: 0.2 })
      }
      size = 0
      void size
    }

    const setMagnet = (el: HTMLElement | null) => {
      if (magnet === el) return
      if (magnet) { const m = magX.get(magnet); m?.[0](0); m?.[1](0) }
      magnet = el
      if (el && !magX.has(el)) {
        magX.set(el, [gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }), gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })])
      }
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      px = e.clientX; py = e.clientY
      if (!seen) { seen = true; gsap.set(posEl, { x: px, y: py }); gsap.set(dotEl, { x: px, y: py }); lx = px; ly = py }
      vis(1)
      dx(px); dy(py)
      // magnetic pull (max 8px) toward the centre of primary controls
      const t = e.target as Element | null
      const m = t?.closest<HTMLElement>(MAGNET) ?? null
      setMagnet(m)
      let tx = px, ty = py
      if (m) {
        const r = m.getBoundingClientRect()
        const cx = r.left + r.width / 2 - (magX.has(m) ? Number(gsap.getProperty(m, 'x')) : 0)
        const cy = r.top + r.height / 2 - (magX.has(m) ? Number(gsap.getProperty(m, 'y')) : 0)
        const k = (v: number) => Math.max(-8, Math.min(8, v * 0.25))
        magX.get(m)?.[0](k(px - cx)); magX.get(m)?.[1](k(py - cy))
        tx = px + (cx - px) * 0.35; ty = py + (cy - py) * 0.35
      }
      rx(tx); ry(ty)
      // context
      let next: typeof mode = 'idle'
      let l = ''
      if (t) {
        if (t.closest(TEXT)) next = 'text'
        else if (t.closest(INTERACTIVE)) { next = 'hover'; l = labelFor(t) }
      }
      if (next !== mode || l !== curLabel) { mode = next; curLabel = l; render() }
    }
    const onDown = () => { pressed = true; render() }
    const onUp = () => { pressed = false; render() }
    const onLeave = () => vis(0)
    const onEnter = () => seen && vis(1)
    const onBlur = () => vis(0)

    // velocity-based squash & stretch, one rAF read of tween state only (no layout reads)
    const tick = () => {
      const cx = Number(gsap.getProperty(posEl, 'x')), cy = Number(gsap.getProperty(posEl, 'y'))
      const vx = cx - lx, vy = cy - ly
      lx = cx; ly = cy
      const v = Math.min(Math.hypot(vx, vy) / 40, 0.45)
      if (mode === 'text') { sx(1); sy(1); rot(0) }
      else {
        sx(1 + v); sy(1 - v * 0.55)
        if (v > 0.02) rot(Math.atan2(vy, vx) * 180 / Math.PI)
      }
    }
    gsap.ticker.add(tick)
    gsap.set(rootEl, { opacity: 0 })
    render()

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)
    window.addEventListener('blur', onBlur)
    return () => {
      html.classList.remove('has-cursor')
      gsap.ticker.remove(tick)
      setMagnet(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('blur', onBlur)
      gsap.killTweensOf([rootEl, dotEl, posEl, shape, lbl])
    }
  }, [])

  return (
    <div ref={root} className="cursor" aria-hidden="true" data-cursor-root>
      <div ref={ringPos} className="cursor-ring">
        <div ref={ringShape} className="cursor-shape" />
        <span ref={labelEl} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  )
}
