import { useState } from 'react'
import { CONTACT } from '../data'

export function ContactLeft() {
  return (<>
    <p className="kicker">05 · Transmit</p>
    <h2 id="c-h">Got a system that needs to <span className="hl">move data or money?</span></h2>
  </>)
}
export function ContactRight() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(CONTACT.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* ignore */ }
  }
  return (<>
    <div className="contact-row">
      <a className="btn primary big" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      <button className="btn" onClick={copy}>{copied ? 'Copied ✓' : 'Copy email'}</button>
    </div>
    <ul className="links">
      <li><a href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub <span>{CONTACT.githubLabel}</span></a></li>
      <li><a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span>{CONTACT.linkedinLabel}</span></a></li>
      <li><a href="#/resume">Résumé <span>full page, printable</span></a></li>
    </ul>
  </>)
}
