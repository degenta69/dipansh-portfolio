import { lazy, Suspense, useEffect, useState } from 'react'
import { useMotion } from './motion'

const Scene = lazy(() => import('./HeadScene'))
const POSTER = '/avatar/avatar-approved-cutout.webp'
const POSTER_SM = '/avatar/avatar-approved-cutout-sm.webp'

/** Why the live 3D head is NOT used (null = use it). Cheap checks only; no GL context is created here except one probe. */
export function lowEndReason(motion: boolean): string | null {
  const q = new URLSearchParams(location.search).get('avatar')
  if (q === 'static') return 'forced-static'
  if (!motion) return 'reduced-motion'
  if (q === '3d') return webgl() ? null : 'no-webgl'
  if (matchMedia('(pointer: coarse)').matches || window.innerWidth < 760) return 'mobile'
  const nav = navigator as Navigator & { deviceMemory?: number }
  if ((navigator.hardwareConcurrency || 8) <= 4) return 'low-cores'
  if (nav.deviceMemory && nav.deviceMemory <= 4) return 'low-memory'
  return webgl() ? null : 'no-webgl'
}
function webgl() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}

export default function HeadStage() {
  const { motion } = useMotion()
  const [reason, setReason] = useState<string | null | undefined>(undefined)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => { setReason(lowEndReason(motion)); setReady(false) }, [motion])
  const live = reason === null && !failed
  return (
    <div className={`head-stage ${live && ready ? 'is-3d' : ''} ${live ? '' : 'is-static'}`} data-head={live ? (ready ? '3d' : 'loading') : 'static'} data-reason={failed ? 'load-failed' : reason ?? ''}>
      <div className="head-box">
        {/* poster shows instantly and is the whole story when 3D is off; the CSS orbit around it keeps running */}
        <img className="head-poster" src={POSTER} srcSet={`${POSTER_SM} 656w, ${POSTER} 1312w`} sizes="(max-width: 899px) 90vw, 46vw" width={1312} height={1199}
          alt="Portrait of Dipansh Saxena" decoding="async" fetchPriority="high" draggable={false} />
        {live && (
          <Suspense fallback={null}>
            <Scene onReady={() => setReady(true)} onError={() => setFailed(true)} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
