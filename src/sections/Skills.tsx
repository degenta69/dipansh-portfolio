import { useState } from 'react'
import { SKILLS } from '../data'

export default function Skills() {
  const [f, setF] = useState('all')
  return (
    <section id="skills" className="sec" tabIndex={-1} aria-labelledby="sk-h">
      <p className="kicker" data-reveal>04 · Toolbox</p>
      <h2 id="sk-h" data-reveal>What's in the bag.</h2>
      <div className="filters" role="group" aria-label="Filter skills" data-reveal>
        {[{ id: 'all', name: 'All' }, ...SKILLS].map((g) => (
          <button key={g.id} className={f === g.id ? 'on' : ''} aria-pressed={f === g.id} onClick={() => setF(g.id)}>{g.name}</button>
        ))}
      </div>
      <div className="skill-grid">
        {SKILLS.filter((g) => f === 'all' || g.id === f).map((g) => (
          <div key={g.id} className={`skill-card ${g.tone}`} data-reveal>
            <h3>{g.name}</h3>
            <ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  )
}
