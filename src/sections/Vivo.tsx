import { useEffect, useRef, useState } from 'react'
import { Chip, Metric, SimTag, StoryHead } from '../ui'
import { useInView, useMotion } from '../motion'

/* ───────────── Story 1: GRC ───────────── */
const GRC_STEPS = [
  { id: 'src', t: 'Evidence sources', d: 'Multiple cloud accounts and tools push evidence in different shapes. The platform is source-agnostic: new sources plug in without touching the core.' },
  { id: 'ing', t: 'Ingestion API', d: 'Lambda-backed API handlers validate and normalise each payload, then hand it to a queue. The request returns fast; the work happens next.' },
  { id: 'q', t: 'Event queue', d: 'SQS decouples intake from processing, so spikes and retries are boring. Scheduled jobs on EventBridge re-check controls on a timer.' },
  { id: 'map', t: 'Control mapping', d: 'Workers map evidence to framework controls (SOC 2, ISO 27001, HIPAA) and run automated checks.' },
  { id: 'ready', t: 'Audit readiness', d: 'The admin front end shows control status, assigned tasks and auditor collaboration, tracked in near real time.' },
]
function GrcDemo() {
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(false)
  const { motion } = useMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  useEffect(() => {
    if (!play || !inView) return
    const t = setInterval(() => setI((x) => (x + 1) % GRC_STEPS.length), 1800)
    return () => clearInterval(t)
  }, [play, inView])
  const auto = play && motion
  return (
    <div className="demo" ref={ref}>
      <div className="demo-bar"><SimTag /><button className="ghost" onClick={() => setPlay(!play)} aria-pressed={play}>{play ? 'Pause' : 'Play flow'}</button></div>
      <ol className="pipe">
        {GRC_STEPS.map((s, k) => (
          <li key={s.id} className={k === i ? 'on' : k < i ? 'done' : ''}>
            <button onClick={() => { setPlay(false); setI(k) }} aria-pressed={k === i}><span className="num">{k + 1}</span>{s.t}</button>
          </li>
        ))}
      </ol>
      <div className="pipe-track" aria-hidden="true"><i style={{ width: `${(i / (GRC_STEPS.length - 1)) * 100}%`, transition: auto ? 'width .9s' : 'none' }} /></div>
      <p className="step-desc" aria-live="polite"><b>{GRC_STEPS[i].t}.</b> {GRC_STEPS[i].d}</p>
    </div>
  )
}

/* ───────────── Story 2: Electron serial console ───────────── */
const rnd = (a: number, b: number) => a + Math.random() * (b - a)
function SerialConsole() {
  const [open, setOpen] = useState(false)
  const [baud, setBaud] = useState(115200)
  const [batched, setBatched] = useState(true)
  const [lines, setLines] = useState<string[]>(['// serial console · illustrative simulation', '// pick a baud rate, then open the port'])
  const [stats, setStats] = useState({ rx: 0, paints: 0 })
  const [input, setInput] = useState('')
  const buf = useRef<string[]>([])
  const counters = useRef({ rx: 0, paints: 0, t: 0 })
  const screen = useRef<HTMLDivElement>(null)
  const [ref, inView] = useInView<HTMLDivElement>()

  const push = (arr: string[]) => setLines((l) => [...l, ...arr].slice(-40))

  useEffect(() => {
    if (!open || !inView) return
    const gen = setInterval(() => {
      counters.current.t += 1
      const line = `[${String(counters.current.t).padStart(5, '0')}] TEMP=${rnd(22, 27).toFixed(1)}C RSSI=${-Math.round(rnd(55, 75))} STATE=${Math.random() > 0.9 ? 'WARN' : 'OK'}`
      counters.current.rx += line.length + 2
      if (batched) buf.current.push(line)
      else { counters.current.paints += 1; push([line]) }
    }, 60)
    const flush = setInterval(() => {
      if (batched && buf.current.length) { counters.current.paints += 1; push(buf.current); buf.current = [] }
    }, 250)
    const stat = setInterval(() => setStats({ rx: counters.current.rx, paints: counters.current.paints }), 400)
    return () => { clearInterval(gen); clearInterval(flush); clearInterval(stat) }
  }, [open, inView, batched])

  useEffect(() => { const s = screen.current; if (s) s.scrollTop = s.scrollHeight }, [lines])

  const run = (cmd: string) => {
    const c = cmd.trim().toLowerCase()
    const out: string[] = [`> ${cmd}`]
    if (c === 'help') out.push('commands: help, status, version, baud, clear')
    else if (c === 'status') out.push(open ? `port OPEN @ ${baud} baud · ${batched ? 'batched' : 'unbatched'} paint` : 'port CLOSED')
    else if (c === 'version') out.push('fw v1.0.0-demo (fake)')
    else if (c === 'baud') out.push(`${baud}`)
    else if (c === 'clear') { setLines([]); return }
    else if (c) out.push(`unknown command: ${c} (try help)`)
    push(out)
  }

  return (
    <div className="demo console-demo" ref={ref}>
      <div className="demo-bar"><SimTag /><span className="mono dim">fake device · no real hardware</span></div>
      <div className="console-grid">
        <div>
          <div className="console-ctl">
            <label>Baud
              <select value={baud} onChange={(e) => setBaud(+e.target.value)} disabled={open}>
                {[9600, 57600, 115200, 921600].map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
            <button className={`btn small ${open ? '' : 'primary'}`} onClick={() => { setOpen(!open); push([open ? '-- port closed' : `-- port opened @ ${baud}`]) }}>{open ? 'Close port' : 'Open port'}</button>
            <label className="check"><input type="checkbox" checked={batched} onChange={(e) => setBatched(e.target.checked)} /> Batch paints (ring buffer)</label>
          </div>
          <div className="console-screen" ref={screen} role="log" aria-label="Simulated serial output" tabIndex={0}>
            {lines.map((l, k) => <div key={k} className={l.includes('WARN') ? 'warn' : l.startsWith('>') ? 'cmd' : ''}>{l}</div>)}
          </div>
          <form className="console-in" onSubmit={(e) => { e.preventDefault(); run(input); setInput('') }}>
            <span aria-hidden="true">›</span>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="type: help" aria-label="Console command" />
          </form>
        </div>
        <div className="console-side">
          <div className="gauge"><b>{(stats.rx / 1024).toFixed(1)} KB</b><span>received</span></div>
          <div className="gauge"><b>{stats.paints}</b><span>DOM paints</span></div>
          <p className="dim small">Toggle batching while the port is open: the same data, a fraction of the repaint work.</p>
        </div>
      </div>
    </div>
  )
}

/* ───────────── Story 3: Device → cloud path with live charts ───────────── */
const PATH = [
  { id: 'dev', t: 'Device', tone: 'hot', d: 'Connected hardware with a microcontroller. It advertises over BLE and reports sensor state.' },
  { id: 'ble', t: 'BLE', tone: 'hot', d: 'The phone scans, connects and exchanges data using a native plugin bridged into the web layer. Wi-Fi and Bluetooth are exposed to the app as native features.' },
  { id: 'app', t: 'Ionic app', tone: 'violet', d: 'Cordova/Capacitor native features. I built the camera and contacts integrations from scratch, plus background work in Web Workers.' },
  { id: 'mqtt', t: 'MQTT · AWS IoT', tone: 'lime', d: 'The app and devices exchange messages over MQTT through AWS IoT as the broker/gateway.' },
  { id: 'lam', t: 'Lambda', tone: 'lime', d: 'Serverless handlers process messages, store state and serve the admin portal.' },
  { id: 'chart', t: 'Live charts', tone: 'gold', d: 'Streaming charts render telemetry as it arrives, next to static history charts.' },
]
function LiveChart({ running }: { running: boolean }) {
  const N = 60
  const [pts, setPts] = useState<number[]>(() => Array.from({ length: N }, (_, i) => 50 + 22 * Math.sin(i / 5)))
  const tick = useRef(N)
  useEffect(() => {
    if (!running) return
    const t = setInterval(() => {
      tick.current += 1
      const k = tick.current
      setPts((p) => [...p.slice(1), 50 + 22 * Math.sin(k / 5) + 8 * Math.sin(k / 1.7) + rnd(-4, 4)])
    }, 120)
    return () => clearInterval(t)
  }, [running])
  const d = pts.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i / (N - 1)) * 300},${100 - y}`).join(' ')
  return (
    <svg viewBox="0 0 300 100" className="chart" role="img" aria-label="Simulated live telemetry line chart" preserveAspectRatio="none">
      {[25, 50, 75].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#2a2640" strokeWidth="0.5" />)}
      <path d={`${d} L300,100 L0,100 Z`} fill="url(#cg)" opacity="0.35" />
      <defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#c6ff3d" /><stop offset="1" stopColor="#c6ff3d" stopOpacity="0" /></linearGradient></defs>
      <path d={d} fill="none" stroke="#c6ff3d" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
function IotPath() {
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(true)
  const { motion } = useMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const run = play && motion && inView
  useEffect(() => {
    if (!run) return
    const t = setInterval(() => setI((x) => (x + 1) % PATH.length), 1500)
    return () => clearInterval(t)
  }, [run])
  return (
    <div className="demo" ref={ref}>
      <div className="demo-bar"><SimTag /><button className="ghost" onClick={() => setPlay(!play)} aria-pressed={play}>{play && motion ? 'Pause' : 'Auto-play'}</button></div>
      <ol className="iot">
        {PATH.map((s, k) => (
          <li key={s.id} className={`${s.tone} ${k === i ? 'on' : ''} ${k < i ? 'done' : ''}`}>
            <button onClick={() => { setPlay(false); setI(k) }} aria-pressed={k === i}>{s.t}</button>
            {k < PATH.length - 1 && <span className="wire" aria-hidden="true"><i className={k === i && run ? 'go' : ''} /></span>}
          </li>
        ))}
      </ol>
      <p className="step-desc" aria-live="polite"><b>{PATH[i].t}.</b> {PATH[i].d}</p>
      <div className="chart-box"><div className="chart-cap"><span>Telemetry · simulated stream</span><span className="live"><i /> {run || (play && motion) ? 'streaming' : 'paused'}</span></div><LiveChart running={run || i === 5 && inView && motion} /></div>
    </div>
  )
}

export default function Vivo() {
  return (
    <section id="vivo" className="sec vivo" tabIndex={-1} aria-labelledby="vivo-h">
      <p className="kicker" data-reveal>02 · Vivo Collaboration Solution · May 2022 – Jan 2026</p>
      <h2 id="vivo-h" data-reveal>Three stories. <span className="hl">One engineer inside each.</span></h2>
      <p className="lede" data-reveal>Over three and a half years I moved from front-end to owning whole systems. Here are the three stories, each with something you can poke.</p>

      <article className="story" aria-labelledby="s1">
        <StoryHead n="1" kicker="Compliance · serverless" title="GRC / compliance platform" pitch="Turn messy evidence from many cloud accounts into audit-ready control status for SOC 2, ISO 27001 and HIPAA." />
        <h4 id="s1" className="sr-only">GRC platform story</h4>
        <div className="story-body">
          <GrcDemo />
          <div className="story-copy" data-reveal>
            <ul className="tick">
              <li><b>Serverless backend</b> on AWS Lambda, with APIs for ingestion, control mapping, tasks and auditors.</li>
              <li><b>Event-driven workflows</b> with SQS and EventBridge: ingest fast, process async, re-check on schedule.</li>
              <li><b>Source-agnostic evidence ingestion</b> for multi-account setups.</li>
              <li><b>Admin frontend</b> for control status, task assignment and auditor collaboration.</li>
              <li>I also created the architecture for a reusable Lambda API template, with deploy automation through GitHub Actions, shell scripts and AWS SAM.</li>
            </ul>
            <div className="metrics-strip tight">
              <Metric value="30%" label="reduction in deployment time" />
              <Metric value="up to 80%" label="query-time improvement (custom Prisma/Mongo wrapper)" />
            </div>
            <div className="chips"><Chip tone="lime">Lambda</Chip><Chip tone="lime">SQS</Chip><Chip tone="lime">EventBridge</Chip><Chip tone="lime">KMS</Chip><Chip>TypeScript</Chip><Chip>MongoDB</Chip><Chip>React</Chip></div>
          </div>
        </div>
      </article>

      <article className="story" aria-labelledby="s2">
        <StoryHead n="2" kicker="Desktop · hardware" title="Electron real-time hardware debugging utility" pitch="A Windows desktop tool that lets engineers watch a device talk, live, instead of guessing from logs." />
        <h4 id="s2" className="sr-only">Electron utility story</h4>
        <div className="story-body">
          <SerialConsole />
          <div className="story-copy" data-reveal>
            <ul className="tick">
              <li>Reads <b>serial ports</b> in real time and charts the stream.</li>
              <li><b>Main / renderer separation</b> over IPC: the main process owns the port, the renderer only paints.</li>
              <li><b>Buffering + Web Workers</b> keep the UI smooth when data arrives faster than a screen can repaint.</li>
              <li><b>Packaged for Windows</b> and used by the internal hardware team, roughly 15–20 engineers.</li>
              <li>The tool also flashed firmware to microcontrollers.</li>
            </ul>
            <div className="arch" aria-label="Electron architecture">
              <div className="box hot">Serial port</div><span>→</span>
              <div className="box lime">Main process<small>port I/O · buffer</small></div><span>⇄ IPC</span>
              <div className="box violet">Renderer<small>UI · Web Worker</small></div>
            </div>
            <div className="metrics-strip tight"><Metric value="40%" label="reduction in device-debugging time" /></div>
          </div>
        </div>
      </article>

      <article className="story" aria-labelledby="s3">
        <StoryHead n="3" kicker="Mobile · BLE · cloud" title="Ionic mobile app: BLE, Wi-Fi, native features" pitch="The phone is the bridge between a physical device and the cloud. I worked on both ends of that bridge." />
        <h4 id="s3" className="sr-only">Ionic app story</h4>
        <div className="story-body">
          <IotPath />
          <div className="story-copy" data-reveal>
            <ul className="tick">
              <li><b>Ionic app</b> with BLE, Wi-Fi and native device features via Cordova and Capacitor plugins.</li>
              <li>I built the <b>camera</b> and <b>contacts</b> integrations from scratch.</li>
              <li><b>Workers and MQTT</b> work for background processing and device messaging, via AWS IoT.</li>
              <li><b>Dynamic data visualisation R&amp;D</b>: static history charts plus streaming live charts.</li>
              <li>Matching admin portal on the web, with reusable Material UI components.</li>
            </ul>
            <div className="metrics-strip tight">
              <Metric value="6+ static · 5 live" label="charts built during visualisation R&D" />
              <Metric value="50+" label="reusable Material UI components" />
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}
