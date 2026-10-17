import { useSyncExternalStore } from 'react'
import { SKILLS } from '../data'

function Card({ g }: { g: (typeof SKILLS)[number] }) {
  return (
    <div className={`skill-card ${g.tone}`}>
      <h3>{g.name}</h3>
      <ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
    </div>
  )
}
// filter state is shared by both panels through module state (tiny external store)
let filter = 'all'
const subs = new Set<() => void>()
const setFilter = (f: string) => { filter = f; subs.forEach((s) => s()) }
const useSkillFilter = () => useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb) } }, () => filter)

export function SkillsLeft() {
  const f = useSkillFilter()
  const shown = SKILLS.filter((g) => f === 'all' || g.id === f)
  const half = f === 'all' ? 3 : shown.length
  return (<>
    <p className="kicker">04 · Toolbox</p>
    <h2 id="sk-h">What's in the bag.</h2>
    <div className="filters" role="group" aria-label="Filter skills">
      {[{ id: 'all', name: 'All' }, ...SKILLS].map((g) => (
        <button key={g.id} className={f === g.id ? 'on' : ''} aria-pressed={f === g.id} onClick={() => setFilter(g.id)}>{g.name}</button>
      ))}
    </div>
    <div className="skill-grid">{shown.slice(0, half).map((g) => <Card key={g.id} g={g} />)}</div>
  </>)
}
export function SkillsRight() {
  const f = useSkillFilter()
  const shown = SKILLS.filter((g) => f === 'all' || g.id === f)
  return <div className="skill-grid">{f === 'all' ? shown.slice(3).map((g) => <Card key={g.id} g={g} />) : <p className="dim">Showing one group. Pick “All” to see the whole toolbox.</p>}</div>
}
