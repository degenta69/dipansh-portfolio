import { useSyncExternalStore } from 'react'

/** Design-token themes. Tokens live in CSS (html[data-theme=…] in stage.css); this module owns the choice, persistence,
 *  the animated switch, and the 3D light palette so the head scene can follow without remounting. */
export type ThemeName = 'orbit' | 'atlas'
export const THEME_LABEL: Record<ThemeName, string> = { orbit: 'Orbit', atlas: 'Atlas' }
const KEY = 'sal-theme'

export const THEME_LIGHTS: Record<ThemeName, { hemiSky: number; hemiGround: number; hemiI: number; keyI: number; rimA: number; rimAI: number; rimB: number; rimBI: number }> = {
  orbit: { hemiSky: 0xdfe9ff, hemiGround: 0x1a1236, hemiI: 1.25, keyI: 1.2, rimA: 0x4de1ff, rimAI: 2.2, rimB: 0xff5bd1, rimBI: 0.9 },
  atlas: { hemiSky: 0xffffff, hemiGround: 0x3b3560, hemiI: 1.35, keyI: 1.15, rimA: 0x8b7bff, rimAI: 3.0, rimB: 0xc6ff3d, rimBI: 0.7 },
}

function read(): ThemeName {
  try { const v = localStorage.getItem(KEY); if (v === 'atlas' || v === 'orbit') return v } catch { /* ignore */ }
  return 'orbit'
}
let current: ThemeName = typeof window === 'undefined' ? 'orbit' : read()
const subs = new Set<(t: ThemeName) => void>()
export const getTheme = () => current
export const subscribeTheme = (cb: (t: ThemeName) => void) => { subs.add(cb); return () => { subs.delete(cb) } }
export const useTheme = () => useSyncExternalStore((cb) => subscribeTheme(cb), getTheme)
export const applyThemeAttr = (t: ThemeName) => {
  document.documentElement.dataset.theme = t
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', t === 'atlas' ? '#0c0b12' : '#04060d')
}
export function initTheme() { applyThemeAttr(current) }

type VTDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } }

/** Switch theme. Reduced motion: instant. View Transitions: circular reveal from the toggle (root) + live crossfade of the head/rings/HUD.
 *  Fallback: ~650ms CSS colour cross-fade. The head canvas is never remounted either way. */
export function setTheme(next: ThemeName, origin?: { x: number; y: number }, animate = true) {
  if (next === current) return
  const commit = () => {
    current = next
    try { localStorage.setItem(KEY, next) } catch { /* ignore */ }
    applyThemeAttr(next)
    subs.forEach((f) => f(next))
  }
  const root = document.documentElement
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || root.dataset.motion === 'off'
  if (!animate || reduced) { commit(); return }
  const d = document as VTDoc
  const x = origin?.x ?? innerWidth / 2, y = origin?.y ?? 0
  if (d.startViewTransition) {
    root.classList.add('vt-active')
    const vt = d.startViewTransition(commit)
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    vt.ready.then(() => {
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 800, easing: 'cubic-bezier(.65,0,.25,1)', pseudoElement: '::view-transition-new(root)' })
    }).catch(() => {})
    vt.finished.finally(() => root.classList.remove('vt-active'))
  } else {
    root.classList.add('theme-fade')
    commit()
    setTimeout(() => root.classList.remove('theme-fade'), 750)
  }
}
export const toggleTheme = (origin?: { x: number; y: number }) => setTheme(current === 'orbit' ? 'atlas' : 'orbit', origin)
