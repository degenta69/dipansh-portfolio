import { lazy, Suspense, useEffect, useState } from 'react'
import PortfolioAvatar, { type PortfolioAvatarProps } from './PortfolioAvatar'
import { useMotion } from './motion'

/**
 * Avatar3D — lazy three.js version of the portfolio avatar.
 * - falls back to the static approved portrait (PortfolioAvatar) when: Motion is off / prefers-reduced-motion,
 *   coarse pointer or narrow viewport (mobile), no WebGL, GLB fails to load, or 3D is not enabled.
 * - the three.js chunk and the GLB are only fetched when the 3D path is actually taken.
 * - 3D is opt-in while the likeness is a POC: add ?avatar=3d to the URL (persisted in localStorage), or set VITE_AVATAR_3D=1.
 */
export type Avatar3DProps = PortfolioAvatarProps & {
  /** 'hero' = large, 'small' = Contact variant (lower pixel ratio, calmer motion) */
  size?: 'hero' | 'small'
}

const Scene = lazy(() => import('./Avatar3DScene'))

function enabled3D(): boolean {
  try {
    const q = new URLSearchParams(window.location.search).get('avatar')
    if (q === '3d') localStorage.setItem('sal-avatar3d', '1')
    if (q === 'static') localStorage.removeItem('sal-avatar3d')
    if (localStorage.getItem('sal-avatar3d') === '1') return true
  } catch { /* ignore */ }
  return import.meta.env.VITE_AVATAR_3D === '1'
}

function webglOk(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}

function useUse3D(): boolean {
  const { motion } = useMotion()
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 760px) and (pointer: fine)')
    const check = () => setOk(enabled3D() && desktop.matches && webglOk())
    check()
    desktop.addEventListener('change', check)
    return () => desktop.removeEventListener('change', check)
  }, [])
  return ok && motion
}

export default function Avatar3D({ size = 'hero', className = '', ...rest }: Avatar3DProps) {
  const use3D = useUse3D()
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const on = use3D && !failed
  useEffect(() => { if (!on) setReady(false) }, [on])
  return (
    <div className={`a3d-wrap ${size} ${on && ready ? 'is-3d' : ''} ${className}`}>
      {/* static portrait is always rendered first: it holds the layout and is the loading/fallback state */}
      <div className="a3d-static" aria-hidden={on && ready ? true : undefined}>
        <PortfolioAvatar {...rest} />
      </div>
      {on && (
        <Suspense fallback={null}>
          <Scene visible={rest.visible ?? true} size={size} onReady={() => setReady(true)} onError={() => setFailed(true)} />
        </Suspense>
      )}
    </div>
  )
}
