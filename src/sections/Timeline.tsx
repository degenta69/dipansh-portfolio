import { Metric } from '../ui'
import { goStation } from '../stage'

const STOPS = [
  { when: 'Aug 2019 – Aug 2022', title: 'BCA', place: 'Institute of Technology and Science, Ghaziabad', body: 'Bachelor of Computer Application. Learned by building: chat apps, a streaming clone, freelance MVPs.', tone: 'violet' },
  { when: 'Dec 2021 – May 2022', title: 'React intern', place: 'Across The Globe · remote', body: 'Figma to responsive React, Django API + JWT auth integration, Netlify deploys.', tone: 'lime' },
  { when: 'May 2022 – Jan 2026', title: 'React Developer → JS Engineer → Full-stack', place: 'Vivo Collaboration Solution', body: 'From front-end on a connected-device product to owning serverless back ends, a desktop hardware tool and a compliance platform. Three stories next.', tone: 'hot', href: 'vivo' },
  { when: 'Feb 2026 – now', title: 'SDE-2 (Full Stack)', place: 'Mobcoder Technology', body: 'Payments: KanzPay (pre-launch), the SafeGold integration layer, and a gateway-agnostic rail wall.', tone: 'gold', href: 'mobcoder' },
]

function Stop({ s }: { s: (typeof STOPS)[number] }) {
  return (
    <li className={`stop ${s.tone} lit`}>
      <span className="node" aria-hidden="true" />
      <div className="stop-card">
        <time>{s.when}</time>
        <h3>{s.title}</h3>
        <p className="place">{s.place}</p>
        <p>{s.body}</p>
        {s.href && <a className="more" href={`#${s.href}`} onClick={(e) => { e.preventDefault(); goStation(s.href!) }}>Jump there →</a>}
      </div>
    </li>
  )
}

export function PathLeft() {
  return (<>
    <p className="kicker">01 · The path</p>
    <h2 id="tl-h">One line, four stops.</h2>
    <p className="lede">Front-end intern to payments engineer, with a hardware detour that taught me to care about every byte.</p>
    <div className="metrics-strip">
      <h3 className="sr-only">Delivery at Vivo</h3>
      <Metric value="40+" label="features shipped from client feedback" />
      <Metric value="700+" label="bugs and issues fixed" />
      <Metric value="50+" label="reusable Material UI components" />
    </div>
  </>)
}
export function PathRight() {
  return <ol className="spine-list">{STOPS.map((s) => <Stop key={s.title} s={s} />)}</ol>
}
