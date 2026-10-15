import { useEffect, useRef, useState } from 'react'
import { SECTIONS, CONTACT } from '../data'
import { useMotion } from '../motion'

export default function Nav({ route }: { route: string }) {
  const { motion, toggle } = useMotion()
  const [active, setActive] = useState('top')
  const [open, setOpen] = useState(false)
  const [pal, setPal] = useState(false)

  useEffect(() => {
    if (route !== 'home') return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [route])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal((p) => !p) }
      if (e.key === 'Escape') { setPal(false); setOpen(false) }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const go = (id: string) => {
    setOpen(false); setPal(false)
    if (route !== 'home') { location.hash = ''; setTimeout(() => document.getElementById(id)?.scrollIntoView(), 50); return }
    document.getElementById(id)?.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' })
    document.getElementById(id)?.focus({ preventScroll: true })
  }

  return (
    <>
      <header className="nav">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); location.hash = ''; window.scrollTo(0, 0) }} aria-label="Dipansh Saxena, home">
          <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true"><path d="M8 44 C22 44 20 20 32 20 S42 44 56 44" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /></svg>
          <span>DS<em>/atlas</em></span>
        </a>
        <button className="burger" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        <nav id="nav-links" aria-label="Sections" className={open ? 'open' : ''}>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={route === 'home' && active === s.id ? 'on' : ''}
              aria-current={route === 'home' && active === s.id ? 'true' : undefined}
              onClick={(e) => { e.preventDefault(); go(s.id) }}>{s.label}</a>
          ))}
          <a href="#/resume" className={route === 'resume' ? 'on' : ''} onClick={() => setOpen(false)}>Résumé</a>
        </nav>
        <div className="nav-tools">
          <button className="ghost" onClick={() => setPal(true)} aria-label="Open command palette"><kbd>⌘K</kbd></button>
          <button className="ghost" onClick={toggle} aria-pressed={!motion} title="Toggle animation">{motion ? 'Motion on' : 'Motion off'}</button>
        </div>
      </header>
      {pal && <Palette go={go} close={() => setPal(false)} />}
      <span hidden>{CONTACT.email}</span>
    </>
  )
}

function Palette({ go, close }: { go: (id: string) => void; close: () => void }) {
  const [q, setQ] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { ref.current?.focus() }, [])
  const cmds = [
    ...SECTIONS.map((s) => ({ label: `Go to ${s.label}`, run: () => go(s.id) })),
    { label: 'Open résumé', run: () => { close(); location.hash = '#/resume' } },
    { label: 'Copy email', run: () => { navigator.clipboard?.writeText(CONTACT.email); close() } },
    { label: 'Open GitHub', run: () => { window.open(CONTACT.github, '_blank', 'noopener'); close() } },
    { label: 'Open LinkedIn', run: () => { window.open(CONTACT.linkedin, '_blank', 'noopener'); close() } },
  ].filter((c) => c.label.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="pal-back" onClick={close}>
      <div className="pal" role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()}>
        <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a command…" aria-label="Command"
          onKeyDown={(e) => { if (e.key === 'Enter' && cmds[0]) cmds[0].run() }} />
        <ul>{cmds.map((c) => <li key={c.label}><button onClick={c.run}>{c.label}</button></li>)}</ul>
        <p className="hint">Enter runs the first match · Esc closes</p>
      </div>
    </div>
  )
}
