import type { ReactNode } from 'react'

export const SimTag = ({ children = 'illustrative simulation' }: { children?: ReactNode }) => (
  <span className="simtag" title="Not real data or a live system">{children}</span>
)

export const Metric = ({ value, label }: { value: string; label: string }) => (
  <div className="metric">
    <b>{value}</b>
    <span>{label}</span>
    <i className="selfrep">self-reported</i>
  </div>
)

export const Chip = ({ children, tone }: { children: ReactNode; tone?: 'lime' | 'hot' | 'violet' | 'gold' }) => (
  <span className={`chip ${tone ?? ''}`}>{children}</span>
)

export function StoryHead({ n, kicker, title, pitch }: { n: string; kicker: string; title: string; pitch: ReactNode }) {
  return (
    <header className="story-head" data-reveal>
      <span className="story-n" aria-hidden="true">{n}</span>
      <div>
        <p className="kicker">{kicker}</p>
        <h3>{title}</h3>
        <p className="pitch">{pitch}</p>
      </div>
    </header>
  )
}
