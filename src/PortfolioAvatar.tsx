import { useEffect, useRef, type CSSProperties } from 'react'
import { useMotion } from './motion'

/**
 * PortfolioAvatar — shows the approved real portrait (never redrawn or restyled).
 * - whole-image pointer parallax only (translate), no fake eye tracking, no face warping
 * - gentle float + portal-style reveal/hide, driven by CSS custom properties and rAF (no re-renders)
 * - honours the site Motion toggle (which follows prefers-reduced-motion): static, instant when off
 */
export type PortfolioAvatarProps = {
  /** show / hide with the portal-style transition; hook to scroll/scene state */
  visible?: boolean
  /** use the local background-removed cutout (default) or the original studio photo */
  source?: 'cutout' | 'original'
  /** max whole-image parallax offset in px (0 disables) */
  parallax?: number
  /** idle float amplitude in px (0 disables) */
  float?: number
  /** transition duration in ms */
  transitionMs?: number
  /** delay before the entrance, in ms (e.g. to follow the hero headline) */
  delayMs?: number
  /** called once the reveal transition finishes */
  onRevealed?: () => void
  className?: string
  alt?: string
  /** load eagerly (above the fold) */
  priority?: boolean
}

const BASE = '/avatar/'
const W = 1312
const H = 1199

export default function PortfolioAvatar({
  visible = true, source = 'cutout', parallax = 18, float = 6, transitionMs = 1100, delayMs = 0,
  onRevealed, className = '', alt = 'Portrait of Dipansh Saxena', priority = false,
}: PortfolioAvatarProps) {
  const root = useRef<HTMLDivElement>(null)
  const { motion } = useMotion()

  // pointer parallax: rAF-lerped CSS variables, no React state
  useEffect(() => {
    const el = root.current
    if (!el || !motion || parallax <= 0) { el?.style.setProperty('--px', '0'); el?.style.setProperty('--py', '0'); return }
    if (!window.matchMedia('(pointer: fine)').matches) return
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, running = false
    const tick = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08
      el.style.setProperty('--px', cx.toFixed(3)); el.style.setProperty('--py', cy.toFixed(3))
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(tick)
      else running = false
    }
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
      if (!running) { running = true; raf = requestAnimationFrame(tick) }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [motion, parallax])

  // report reveal completion
  useEffect(() => {
    if (!visible || !onRevealed) return
    const t = window.setTimeout(onRevealed, motion ? delayMs + transitionMs : 0)
    return () => window.clearTimeout(t)
  }, [visible, motion, delayMs, transitionMs, onRevealed])

  const style = {
    '--par': `${parallax}px`, '--float': `${float}px`,
    '--tm': motion ? `${transitionMs}ms` : '0ms', '--delay': motion ? `${delayMs}ms` : '0ms',
  } as CSSProperties
  const ext = source === 'cutout' ? 'avatar-approved-cutout' : 'avatar-approved'
  return (
    <div ref={root} className={`pa ${source} ${className}`} data-state={visible ? 'in' : 'out'} data-float={motion && float > 0 ? 'on' : 'off'} style={style}>
      <div className="pa-portal">
        <div className="pa-float">
          <picture>
            {source === 'cutout' && <source type="image/webp" srcSet={`${BASE}avatar-approved-cutout-sm.webp 656w, ${BASE}avatar-approved-cutout.webp 1312w`} sizes="(max-width: 700px) 90vw, 560px" />}
            <img src={`${BASE}${ext}.png`} width={W} height={H} alt={alt} decoding="async" loading={priority ? 'eager' : 'lazy'} draggable={false} />
          </picture>
        </div>
      </div>
    </div>
  )
}
