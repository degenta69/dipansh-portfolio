import { useEffect, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionProvider, useMotion } from './motion'
import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Timeline from './sections/Timeline'
import Vivo from './sections/Vivo'
import Mobcoder from './sections/Mobcoder'
import Skills from './sections/Skills'
import Contact from './sections/Contact'
import Resume from './sections/Resume'

gsap.registerPlugin(ScrollTrigger)

function useHashRoute() {
  const get = () => (location.hash.startsWith('#/resume') ? 'resume' : 'home')
  const [r, setR] = useState(get())
  useEffect(() => {
    const h = () => setR(get())
    window.addEventListener('hashchange', h)
    return () => window.removeEventListener('hashchange', h)
  }, [])
  return r
}

function Home() {
  const { motion } = useMotion()
  useLayoutEffect(() => {
    if (!motion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 32, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })
    })
    return () => ctx.revert()
  }, [motion])
  return (
    <main id="main">
      <Hero />
      <Timeline />
      <Vivo />
      <Mobcoder />
      <Skills />
      <Contact />
    </main>
  )
}

function Shell() {
  const route = useHashRoute()
  useEffect(() => {
    document.title = route === 'resume' ? 'Résumé — Dipansh Saxena' : 'Dipansh Saxena — Full-stack engineer · Signal Atlas'
    if (route === 'resume') window.scrollTo(0, 0)
  }, [route])
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav route={route} />
      {route === 'resume' ? <Resume /> : <Home />}
      <footer className="foot">
        <span>© 2026 Dipansh Saxena</span>
        <span>Built with React, TypeScript &amp; GSAP · static, no trackers</span>
        <span>All demos are <em>illustrative simulations</em>; metrics are <em>self-reported</em>.</span>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <MotionProvider>
      <Shell />
    </MotionProvider>
  )
}
