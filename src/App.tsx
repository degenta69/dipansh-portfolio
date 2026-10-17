import { useEffect, useState } from 'react'
import { MotionProvider } from './motion'
import Nav from './sections/Nav'
import Resume from './sections/Resume'
import Stage from './Stage'

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

function Shell() {
  const route = useHashRoute()
  useEffect(() => {
    document.title = route === 'resume' ? 'Résumé — Dipansh Saxena' : 'Dipansh Saxena — Full-stack engineer'
    document.documentElement.dataset.route = route
    window.scrollTo(0, 0)
  }, [route])
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav route={route} />
      {route === 'resume' ? (
        <>
          <Resume />
          <footer className="foot">
            <span>© 2026 Dipansh Saxena</span>
            <span>Built with React, TypeScript, GSAP &amp; three.js · static, no trackers</span>
            <span>All demos are <em>illustrative simulations</em>.</span>
          </footer>
        </>
      ) : <Stage />}
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
