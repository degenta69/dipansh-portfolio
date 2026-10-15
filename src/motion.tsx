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

/** true while the element is on screen (used to pause demos off-screen) */
export function useInView<T extends Element>(margin = '0px') {
  const ref = useRef<T>(null)
  const [inView, setIn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setIn(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, inView] as const
}
