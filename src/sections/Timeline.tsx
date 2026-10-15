import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotion } from '../motion'
import { Metric } from '../ui'

const STOPS = [
  { when: 'Aug 2019 – Aug 2022', title: 'BCA', place: 'Institute of Technology and Science, Ghaziabad', body: 'Bachelor of Computer Application. Learned by building: chat apps, a streaming clone, freelance MVPs.', tone: 'violet' },
  { when: 'Dec 2021 – May 2022', title: 'React intern', place: 'Across The Globe · remote', body: 'Figma to responsive React, Django API + JWT auth integration, Netlify deploys.', tone: 'lime' },
  { when: 'May 2022 – Jan 2026', title: 'React Developer → JS Engineer → Full-stack', place: 'Vivo Collaboration Solution', body: 'From front-end on a connected-device product to owning serverless back ends, a desktop hardware tool and a compliance platform. Three stories below.', tone: 'hot', href: '#vivo' },
  { when: 'Feb 2026 – now', title: 'SDE-2 (Full Stack)', place: 'Mobcoder Technology', body: 'Payments: KanzPay (pre-launch), the SafeGold integration layer, and a gateway-agnostic rail wall.', tone: 'gold', href: '#mobcoder' },
]

export default function Timeline() {
  const root = useRef<HTMLElement>(null)
  const { motion } = useMotion()
  useLayoutEffect(() => {
    if (!motion) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.spine-fill', { scaleY: 0 }, {
        scaleY: 1, ease: 'none', transformOrigin: 'top',
        scrollTrigger: { trigger: '.spine', start: 'top 70%', end: 'bottom 60%', scrub: 0.4 },
      })
      gsap.utils.toArray<HTMLElement>('.stop').forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: 'top 65%', onEnter: () => el.classList.add('lit'), onLeaveBack: () => el.classList.remove('lit') })
      })
    }, root)
    return () => ctx.revert()
  }, [motion])
  return (
    <section id="timeline" ref={root} className="sec" tabIndex={-1} aria-labelledby="tl-h">
      <p className="kicker" data-reveal>01 · The path</p>
      <h2 id="tl-h" data-reveal>One line, four stops.</h2>
      <p className="lede" data-reveal>Front-end intern to payments engineer, with a hardware detour that taught me to care about every byte.</p>
      <div className="spine">
        <div className="spine-line" aria-hidden="true"><i className="spine-fill" /></div>
      <ol>
        {STOPS.map((s) => (
          <li key={s.title} className={`stop ${s.tone} ${motion ? '' : 'lit'}`}>
            <span className="node" aria-hidden="true" />
            <div className="stop-card">
              <time>{s.when}</time>
              <h3>{s.title}</h3>
              <p className="place">{s.place}</p>
              <p>{s.body}</p>
              {s.href && <a className="more" href={s.href}>Jump there →</a>}
            </div>
          </li>
        ))}
      </ol>
      </div>
      <div className="metrics-strip" data-reveal>
        <h3 className="sr-only">Delivery at Vivo</h3>
        <Metric value="40+" label="features shipped from client feedback" />
        <Metric value="700+" label="bugs and issues fixed" />
        <Metric value="50+" label="reusable Material UI components" />
      </div>
    </section>
  )
}
