import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { STATIONS } from './stations'
import { StationActive, useMotion } from './motion'
import { addTicker, goStation, setActive, stage, useActiveStation } from './stage'
import HeadStage from './HeadStage'

const N = STATIONS.length
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const PLATEAU = 0.2                                   // fraction of each step a station stays fully docked
const DESKTOP = '(min-width: 900px) and (min-height: 520px)'

/** Orbit ring: dots on a flattened circle. Two copies (back arc under the head, front arc over it). */
function Ring({ front, active }: { front?: boolean; active: number }) {
  return (
    <div className={`ring-clip ${front ? 'front' : 'back'}`} aria-hidden={front ? undefined : true}>
      <div className="ring" data-ring={front ? 'f' : 'b'}>
        <i className="ring-line" />
        {STATIONS.map((s, i) => (
          <span key={s.key} className="ring-dot-pos" style={{ transform: `rotate(${(i * 360) / N}deg) translateX(var(--rr))` }}>
            {front
              ? <button className={`ring-dot ${s.tone} ${i === active ? 'on' : ''}`} tabIndex={-1} onClick={() => goStation(i)} title={s.label} aria-label={`Go to ${s.label}`} />
              : <i className={`ring-dot ${s.tone} ${i === active ? 'on' : ''}`} />}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Stage() {
  const { motion } = useMotion()
  const active = useActiveStation()
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [, force] = useState(0)

  // layout: scroll track height + step
  useLayoutEffect(() => {
    const mq = matchMedia(DESKTOP)
    const size = () => {
      stage.desktop = mq.matches
      stage.step = Math.round(window.innerHeight * (mq.matches ? 0.9 : 0.8))
      stage.count = N
      if (track.current) track.current.style.height = `${stage.step * (N - 1) + window.innerHeight}px`
      root.current?.setAttribute('data-desktop', mq.matches ? '1' : '0')
      stage.progress = NaN // force repaint
    }
    size()
    window.addEventListener('resize', size)
    mq.addEventListener('change', () => force((x) => x + 1))
    return () => window.removeEventListener('resize', size)
  }, [])

  // single scroll → transform director
  useEffect(() => {
    stage.smooth = motion
    const el = root.current!
    const stationEls = Array.from(el.querySelectorAll<HTMLElement>('.station'))
    const panels = stationEls.map((s) => Array.from(s.querySelectorAll<HTMLElement>('.panel')))
    const ringEls = Array.from(el.querySelectorAll<HTMLElement>('.ring'))
    const bar = el.querySelector<HTMLElement>('.hud-bar i')
    const num = el.querySelector<HTMLElement>('.hud-num')
    const lab = el.querySelector<HTMLElement>('.hud-label')
    let lastP = -99, lastDesktop: boolean | null = null, lastIdx = -1

    const applyStation = (i: number, d: number) => {
      const st = stationEls[i], ps = panels[i]
      const a = Math.abs(d)
      let e = a <= PLATEAU ? 0 : (a - PLATEAU) / (1 - PLATEAU)
      if (!stage.smooth) e = a < 0.5 ? 0 : 1
      if (e >= 1) { if (st.style.visibility !== 'hidden') st.style.visibility = 'hidden'; return }
      if (st.style.visibility === 'hidden') st.style.visibility = ''
      const dir = d > 0 ? 1 : -1                       // +1: upcoming, -1: already passed
      const o = stage.smooth ? clamp(1 - e * 1.35, 0, 1) : 1
      if (stage.desktop) {
        const vw = window.innerWidth / 100
        ps.forEach((p) => {
          const s = p.dataset.side === 'l' ? -1 : 1
          if (!stage.smooth) { p.style.transform = ''; p.style.opacity = '1'; return }
          let t: string
          if (dir > 0) t = `translateY(-50%) translate3d(${s * e * 42 * vw}px,${e * 20}px,${-e * 260}px) rotateY(${-s * e * 52}deg)`
          else t = `translateY(-50%) translate3d(${-s * e * 17 * vw}px,${-e * 14}px,${-e * 520}px) rotateY(${s * e * 46}deg) scale(${1 - e * 0.15})`
          p.style.transform = t; p.style.opacity = String(o)
        })
        st.style.transform = ''; st.style.opacity = ''
      } else {
        ps.forEach((p) => { p.style.transform = ''; p.style.opacity = '' })
        st.style.transform = stage.smooth ? `translate3d(0,${dir * e * 36}px,0)` : ''
        st.style.opacity = String(stage.smooth ? o : 1)
      }
    }

    const tick = (_now: number, dt: number) => {
      stage.target = clamp(window.scrollY / stage.step, 0, N - 1)
      const k = stage.smooth ? 1 - Math.pow(0.0004, dt) : 1
      if (!(Math.abs(stage.target - stage.progress) > 0.0004)) stage.progress = stage.target
      else stage.progress += (stage.target - stage.progress) * k
      const p = stage.progress
      if (p === lastP && lastDesktop === stage.desktop) return
      lastP = p; lastDesktop = stage.desktop
      const idx = clamp(Math.round(p), 0, N - 1)
      const lo = Math.floor(p), hi = Math.min(N - 1, lo + 1), f = p - lo
      const lk = STATIONS[lo].look * (1 - f) + STATIONS[hi].look * f
      stage.look = stage.desktop ? lk : 0
      for (let i = 0; i < N; i++) { if (Math.abs(i - p) < 1.0001 || i === lastIdx) applyStation(i, i - p) }
      for (let i = 0; i < N; i++) if (Math.abs(i - p) >= 1.0001 && stationEls[i].style.visibility !== 'hidden') stationEls[i].style.visibility = 'hidden'
      const rot = `rotateX(72deg) rotateZ(${(-p * 360) / N}deg)`
      ringEls.forEach((r) => { r.style.transform = rot })
      if (bar) bar.style.transform = `scaleX(${N > 1 ? p / (N - 1) : 0})`
      if (idx !== lastIdx) {
        lastIdx = idx; setActive(idx)
        if (num) num.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`
        if (lab) lab.textContent = STATIONS[idx].label
        stage.poke = Math.max(stage.poke, 0) // active change handled in head via stage.active
      }
    }
    const off = addTicker(tick)
    return off
  }, [motion])

  // pointer → stage state (one passive listener; no React state)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth, h = window.innerHeight
      stage.px = clamp((e.clientX - w / 2) / (w * 0.5), -1, 1)
      stage.py = clamp((e.clientY - h * 0.42) / (h * 0.5), -1, 1)
      const dx = (e.clientX - w / 2) / (h * 0.2), dy = (e.clientY - h * 0.45) / (h * 0.3)
      stage.hover = dx * dx + dy * dy < 1
    }
    const onDown = () => { if (stage.hover) stage.poke = performance.now() }
    const onLeave = () => { stage.hover = false }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerdown', onDown); document.documentElement.removeEventListener('pointerleave', onLeave) }
  }, [])

  const cur = STATIONS[active]
  return (
    <>
      <div ref={track} className="orbit-track" aria-hidden="true" />
      <div ref={root} className="stage" data-tone={cur.tone} data-motion={motion ? 'on' : 'off'}>
        <div className="space" aria-hidden="true"><i className="glow g1" /><i className="glow g2" /><i className="grid-floor" /></div>
        <div className="deco" aria-hidden="true">
          <svg className="deco-ring r1" viewBox="0 0 200 200"><circle cx="100" cy="100" r="98" /><circle cx="100" cy="100" r="86" strokeDasharray="2 6" /></svg>
          <svg className="deco-ring r2" viewBox="0 0 200 200"><circle cx="100" cy="100" r="98" strokeDasharray="30 14 4 14" /></svg>
        </div>
        <Ring active={active} />
        <main id="main" className="stations">
          {STATIONS.map((s, i) => (
            <StationActive.Provider key={s.key} value={i === active}>
              <section id={s.ids[0] === 'top' ? undefined : s.ids[0]} className={`station ${s.tone}`} data-i={i} inert={i !== active} aria-label={s.label} style={{ visibility: i === 0 ? undefined : 'hidden' }}>
                <div className="panel left" data-side="l">{s.left}</div>
                <div className="panel right" data-side="r">{s.right}</div>
              </section>
            </StationActive.Provider>
          ))}
        </main>
        <HeadStage />
        <Ring front active={active} />
        <div className="hud" aria-hidden="true">
          <span className="br tl" /><span className="br tr" /><span className="br bl" /><span className="br brr" />
          <div className="hud-read hud-l">SYS <b>ONLINE</b><br />RIG <b>HEAD.SKEL</b></div>
          <div className="hud-read hud-r">SECTOR <b className="hud-label">{STATIONS[0].label}</b><br /><b className="hud-num">01 / {String(N).padStart(2, '0')}</b></div>
          <div className="hud-bar"><i /></div>
        </div>
        <div className="foot-hud">
          <span>© 2026 Dipansh Saxena</span>
          <span>Built with React, TypeScript, GSAP &amp; three.js · static, no trackers</span>
          <span>All demos are <em>illustrative simulations</em>.</span>
        </div>
      </div>
    </>
  )
}
