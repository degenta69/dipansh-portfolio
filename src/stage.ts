import { useSyncExternalStore } from 'react'

/** Shared, non-React state for the fixed head stage. Mutated by the single rAF director loop. */
export const stage = {
  count: 1, step: 800,
  progress: 0, target: 0, active: 0,
  look: 0,                 // -1 (left panel) … +1 (right panel): which way the head should turn
  px: 0, py: 0,            // cursor relative to the head centre, normalised -1…1
  hover: false, poke: 0,   // pointer over head / clicked head (timestamp)
  smooth: true,            // false: discrete station swaps (reduced motion / static)
  desktop: true,
}
const subs = new Set<() => void>()
const subscribe = (cb: () => void) => { subs.add(cb); return () => { subs.delete(cb) } }
export const setActive = (i: number) => { if (i !== stage.active) { stage.active = i; subs.forEach((f) => f()) } }
export const useActiveStation = () => useSyncExternalStore(subscribe, () => stage.active)

/* ── ONE rAF loop for the whole page (director + head renderer register tickers) ── */
type Ticker = (now: number, dt: number) => void
const tickers = new Set<Ticker>()
let raf = 0, last = 0
const loop = (now: number) => {
  raf = requestAnimationFrame(loop)
  const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000)); last = now
  tickers.forEach((t) => t(now, dt))
}
const start = () => { if (!raf && !document.hidden && tickers.size) { last = performance.now(); raf = requestAnimationFrame(loop) } }
const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0 }
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()))
export function addTicker(t: Ticker) { tickers.add(t); start(); return () => { tickers.delete(t); if (!tickers.size) stop() } }

/* ── navigation ── */
export const STATION_IDS: string[][] = []   // filled by stations.tsx: anchors per station
export function stationIndex(idOrIndex: string | number) {
  if (typeof idOrIndex === 'number') return idOrIndex
  const i = STATION_IDS.findIndex((a) => a.includes(idOrIndex))
  return i < 0 ? 0 : i
}
export function goStation(idOrIndex: string | number, smooth = stage.smooth) {
  window.scrollTo({ top: stationIndex(idOrIndex) * stage.step, behavior: smooth ? 'smooth' : 'auto' })
}
