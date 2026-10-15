import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useMotion } from '../motion'
import { Chip } from '../ui'

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const { motion } = useMotion()

  useLayoutEffect(() => {
    if (!motion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hero-name .ch', { yPercent: 110, rotate: 6, opacity: 0, duration: 0.9, stagger: 0.035 })
        .from('.hero-line', { opacity: 0, y: 24, duration: 0.7, stagger: 0.12 }, '-=0.5')
        .from('.hero-cta > *', { opacity: 0, y: 16, stagger: 0.08, duration: 0.5 }, '-=0.4')
      gsap.from('.sig-path', { strokeDashoffset: 1, duration: 2.2, ease: 'power2.inOut', delay: 0.4 })
      gsap.to('.sig-pulse', { attr: { r: 14 }, opacity: 0, repeat: -1, duration: 1.6, ease: 'power1.out', stagger: 0.8 })
    }, root)
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to('.hero-art', { x: x * -14, y: y * -10, duration: 0.8, ease: 'power2.out' })
      gsap.to('.hero-grid', { x: x * 8, y: y * 6, duration: 1, ease: 'power2.out' })
    }
    window.addEventListener('pointermove', onMove)
    return () => { ctx.revert(); window.removeEventListener('pointermove', onMove) }
  }, [motion])

  const name = 'Dipansh Saxena'
  return (
    <section id="top" ref={root} className="hero" tabIndex={-1}>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-inner">
        <p className="kicker hero-line">Full-stack engineer · Signal Atlas v0.1</p>
        <h1 className="hero-name" aria-label={name}>
          {name.split(' ').map((w, wi) => (
            <span className="word" key={wi} aria-hidden="true">
              {w.split('').map((c, i) => <span className="mask" key={i}><span className="ch">{c}</span></span>)}
            </span>
          ))}
        </h1>
        <p className="hero-line hero-sub">
          I build the <b>systems behind the screen</b>: payments that settle to the minor unit, firmware tools that talk to hardware, and serverless back ends that don't fall over.
        </p>
        <div className="hero-chips hero-line">
          <Chip tone="lime">Payments</Chip><Chip tone="hot">IoT &amp; devices</Chip><Chip tone="violet">Serverless AWS</Chip><Chip tone="gold">Real-time</Chip>
        </div>
        <div className="hero-cta">
          <a className="btn primary" href="#vivo" onClick={(e) => { e.preventDefault(); document.getElementById('vivo')?.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' }) }}>Enter the atlas ↓</a>
          <a className="btn" href="#/resume">Read résumé</a>
        </div>
      </div>

      <figure className="hero-art" aria-hidden="true">
        <svg viewBox="0 0 520 420" role="img">
          <defs>
            <linearGradient id="sg" x1="0" x2="1"><stop offset="0" stopColor="#ff5a36" /><stop offset="0.5" stopColor="#c6ff3d" /><stop offset="1" stopColor="#8b7bff" /></linearGradient>
          </defs>
          <path className="sig-path" pathLength={1} strokeDasharray={1} strokeDashoffset={0} d="M40 330 C120 330 110 120 200 120 S300 320 360 250 S440 80 480 90" fill="none" stroke="url(#sg)" strokeWidth="5" strokeLinecap="round" />
          <g className="sig-nodes">
            <circle cx="40" cy="330" r="9" fill="#ff5a36" /><circle className="sig-pulse" cx="40" cy="330" r="9" fill="none" stroke="#ff5a36" />
            <circle cx="200" cy="120" r="7" fill="#c6ff3d" />
            <circle cx="360" cy="250" r="7" fill="#f5b83d" />
            <circle cx="480" cy="90" r="9" fill="#8b7bff" /><circle className="sig-pulse" cx="480" cy="90" r="9" fill="none" stroke="#8b7bff" />
          </g>
          <g fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#a7a2c0">
            <text x="20" y="362">device</text><text x="176" y="104">cloud</text><text x="336" y="282">ledger</text><text x="440" y="124">user</text>
          </g>
        </svg>
        {/* PLACEHOLDER: reserved slot for the planned 3D portrait / avatar */}
        <div className="portrait-slot"><span>DS</span><small>portrait slot · placeholder</small></div>
      </figure>
      <div className="scroll-cue" aria-hidden="true"><span /></div>
    </section>
  )
}
