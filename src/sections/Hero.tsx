import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useMotion } from '../motion'
import { Chip } from '../ui'
import { goStation } from '../stage'
import { THEME_LABEL, useTheme } from '../theme'

export function HeroLeft() {
  const root = useRef<HTMLDivElement>(null)
  const { motion } = useMotion()
  const theme = useTheme()
  useLayoutEffect(() => {
    if (!motion) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-name .ch', { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.03, ease: 'power4.out' })
      gsap.from('.hero-line', { opacity: 0, y: 18, duration: 0.7, stagger: 0.1, delay: 0.3, ease: 'power3.out' })
    }, root)
    return () => ctx.revert()
  }, [motion])
  const name = 'Dipansh Saxena'
  return (
    <div ref={root}>
      <p className="kicker hero-line">Full-stack engineer · {THEME_LABEL[theme]} v1</p>
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
    </div>
  )
}
export function HeroRight() {
  return (<>
    <p className="hero-line profile">Full-stack software engineer building payment, marketplace and real-time systems. Ships Node/TypeScript APIs and React / React Native / Ionic clients end to end: gateway adapters, settlements, refunds, digital-gold flows, serverless AWS back ends and device tooling. Strong focus on system design, clean architecture and long-term reliability.</p>
    <div className="hero-chips hero-line">
      <Chip tone="lime">Payments</Chip><Chip tone="hot">IoT &amp; devices</Chip><Chip tone="violet">Serverless AWS</Chip><Chip tone="gold">Real-time</Chip>
    </div>
    <div className="hero-cta hero-line">
      <a className="btn primary" href="#vivo" onClick={(e) => { e.preventDefault(); goStation('vivo') }}>Enter the orbit ↓</a>
      <a className="btn" href="#/resume">Read résumé</a>
    </div>
  </>)
}
