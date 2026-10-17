import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

type Ctx = { motion: boolean; toggle: () => void; systemReduced: boolean }
const MotionCtx = createContext<Ctx>({ motion: true, toggle: () => {}, systemReduced: false })
export const useMotion = () => useContext(MotionCtx)

const KEY = 'sal-motion'
export function MotionProvider({ children }: { children: ReactNode }) {
  const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
  const [systemReduced, setSys] = useState(!!mq?.matches)
  const [pref, setPref] = useState<string | null>(() => {
    try { return localStorage.getItem(KEY) } catch { return null }
  })
  useEffect(() => {
    if (!mq) return
    const h = () => setSys(mq.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [mq])
  // explicit user choice wins; otherwise follow the OS setting
  const motion = pref ? pref === 'on' : !systemReduced
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'on' : 'off'
  }, [motion])
  const toggle = () => {
    const next = motion ? 'off' : 'on'
    setPref(next)
    try { localStorage.setItem(KEY, next) } catch { /* ignore */ }
  }
  return <MotionCtx.Provider value={{ motion, toggle, systemReduced }}>{children}</MotionCtx.Provider>
}

/** Set by each orbit station: true while that station is the docked one. */
export const StationActive = createContext<boolean | null>(null)

/** true while the element is "live": the docked station's content, or (outside stations) on screen. */
export function useInView<T extends Element>(margin = '0px') {
  const ref = useRef<T>(null)
  const act = useContext(StationActive)
  const [inView, setIn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || act !== null) return
    const io = new IntersectionObserver(([e]) => setIn(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin, act])
  return [ref, act !== null ? act : inView] as const
}
