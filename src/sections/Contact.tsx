import { useEffect, useState } from 'react'
import { CONTACT } from '../data'
import Avatar3D from '../Avatar3D'
import { useInView } from '../motion'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [seen, setSeen] = useState(false)
  const [portRef, inView] = useInView<HTMLDivElement>('0px 0px -15% 0px')
  useEffect(() => { if (inView) setSeen(true) }, [inView])
  const copy = async () => {
    try { await navigator.clipboard.writeText(CONTACT.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* ignore */ }
  }
  return (
    <section id="contact" className="sec contact" tabIndex={-1} aria-labelledby="c-h">
      <div className="contact-head">
        <div ref={portRef} className="contact-portrait"><Avatar3D size="small" visible={seen} parallax={10} float={4} transitionMs={1000} /></div>
        <div>
          <p className="kicker" data-reveal>05 · Transmit</p>
          <h2 id="c-h" data-reveal>Got a system that needs to <span className="hl">move data or money?</span></h2>
        </div>
      </div>
      <div className="contact-row" data-reveal>
        <a className="btn primary big" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <button className="btn" onClick={copy}>{copied ? 'Copied ✓' : 'Copy email'}</button>
      </div>
      <ul className="links" data-reveal>
        <li><a href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub <span>{CONTACT.githubLabel}</span></a></li>
        <li><a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span>{CONTACT.linkedinLabel}</span></a></li>
        <li><a href="#/resume">Résumé <span>full page, printable</span></a></li>
      </ul>
    </section>
  )
}
