import { useEffect, useState } from 'react'
import { Chip, SimTag, StoryHead } from '../ui'
import { useInView, useMotion } from '../motion'

/* ── KanzPay flow ── */
const FLOW = [
  { t: 'Buyer', d: 'A buyer taps pay in the app. Identity is already known through the shared OTP/JWT auth service I extracted.', ledger: [] as string[] },
  { t: 'Payment request', d: 'One normalised request is created, with an idempotency key so retries can never double-charge.', ledger: ['request  AED 125.00  = 12500 minor  [pending]'] },
  { t: 'Gateway rail', d: 'The request is routed to a rail through an adapter. Webhooks sync the status back, signed and verified.', ledger: ['request  AED 125.00  = 12500 minor  [paid]'] },
  { t: 'Settlement', d: 'Per-order ledger rows in integer minor units roll up into a daily aggregate per seller. No floats anywhere.', ledger: ['ledger   +12500 minor to seller account', 'batch    daily aggregate queued'] },
  { t: 'Seller', d: 'The seller is paid out on the configured schedule. If a refund happens, the buyer is made whole first and recovery from the seller follows.', ledger: ['payout   scheduled'] },
]
function KanzFlow() {
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(false)
  const { motion } = useMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  useEffect(() => {
    if (!play || !inView) return
    const t = setInterval(() => setI((x) => (x + 1) % FLOW.length), 1700)
    return () => clearInterval(t)
  }, [play, inView])
  const rows = FLOW.slice(0, i + 1).flatMap((f) => f.ledger)
  return (
    <div className="demo" ref={ref}>
      <div className="demo-bar"><SimTag /><button className="ghost" onClick={() => setPlay(!play)} aria-pressed={play}>{play ? 'Pause' : 'Play flow'}</button></div>
      <ol className="iot gold-flow">
        {FLOW.map((s, k) => (
          <li key={s.t} className={`${k === i ? 'on' : ''} ${k < i ? 'done' : ''}`}>
            <button onClick={() => { setPlay(false); setI(k) }} aria-pressed={k === i}>{s.t}</button>
            {k < FLOW.length - 1 && <span className="wire"><i className={k === i && play && motion ? 'go' : ''} /></span>}
          </li>
        ))}
      </ol>
      <p className="step-desc" aria-live="polite"><b>{FLOW[i].t}.</b> {FLOW[i].d}</p>
      <pre className="ledger" aria-label="Simulated ledger">{rows.length ? rows.join('\n') : '// ledger empty — advance the flow'}</pre>
    </div>
  )
}

/* ── SafeGold vault ── */
const RATE = 40000 // illustrative: 400.00 per gram, in minor units
function Vault() {
  const [amt, setAmt] = useState(100)
  const [lock, setLock] = useState(0)
  const [rows, setRows] = useState<{ ug: number; amt: number }[]>([])
  const [lane, setLane] = useState<string | null>(null)
  useEffect(() => {
    if (lock <= 0) return
    const t = setTimeout(() => setLock((x) => x - 1), 1000)
    return () => clearTimeout(t)
  }, [lock])
  const minor = Math.round(amt * 100)
  const ug = Math.floor((minor * 1_000_000) / RATE)
  const total = rows.reduce((a, r) => a + r.ug, 0)
  const buy = () => {
    if (lock <= 0) return
    setRows((r) => [{ ug, amt }, ...r].slice(0, 5))
    setLane('buy')
    setTimeout(() => setLane('transfer'), 700)
    setTimeout(() => setLane(null), 1400)
  }
  const R = 26, C = 2 * Math.PI * R
  return (
    <div className="demo vault">
      <div className="demo-bar"><SimTag /><span className="mono dim">made-up rate · not a quote</span></div>
      <div className="vault-grid">
        <div>
          <label className="field">Amount (AED)
            <input type="number" min={1} max={100000} value={amt} onChange={(e) => setAmt(Math.max(0, Math.min(100000, +e.target.value || 0)))} />
          </label>
          <div className="ug"><b>{ug.toLocaleString('en-US')}</b><span>micrograms of gold</span></div>
          <p className="dim small mono">{minor} minor units × 1,000,000 ÷ {RATE} → integer micrograms, no floats</p>
          <div className="vault-actions">
            <button className="btn small" onClick={() => setLock(30)}>Lock rate (30s)</button>
            <button className="btn small primary" onClick={buy} disabled={lock <= 0}>Buy</button>
            <svg width="64" height="64" viewBox="0 0 64 64" role="img" aria-label={`Rate lock: ${lock} seconds left`}>
              <circle cx="32" cy="32" r={R} fill="none" stroke="#2a2640" strokeWidth="5" />
              <circle cx="32" cy="32" r={R} fill="none" stroke="#f5b83d" strokeWidth="5" strokeDasharray={C} strokeDashoffset={C * (1 - lock / 30)} transform="rotate(-90 32 32)" strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
              <text x="32" y="37" textAnchor="middle" fontSize="14" fill="#f2efe8" fontFamily="JetBrains Mono">{lock}</text>
            </svg>
          </div>
        </div>
        <div>
          <div className="lanes" aria-label="Queue lanes">
            {['reward', 'buy', 'transfer'].map((l) => <div key={l} className={`lane ${lane === l ? 'on' : ''}`}><span>gold:{l}</span><i /></div>)}
          </div>
          <div className="wallet"><span>Wallet balance</span><b>{total.toLocaleString('en-US')} µg</b></div>
          <ul className="buys" aria-label="Recent simulated buys">{rows.map((r, k) => <li key={k}>+{r.ug.toLocaleString('en-US')} µg <em>for AED {r.amt}</em></li>)}</ul>
        </div>
      </div>
    </div>
  )
}

/* ── Gateway wall ── */
const RAILS = [
  { id: 'mbme', name: 'MBME Pay', kind: 'Cards', tone: 'violet', d: 'Card-payment gateway provider. I did the integration on our side: signed requests and status sync behind the common adapter.' },
  { id: 'spare', name: 'TrySpare · Spare Open Finance', kind: 'Bank payments', tone: 'lime', d: 'Open-finance provider for bank payments. I did the integration: auth, customer, consent redirect, payment, status polling.' },
  { id: 'lean', name: 'Lean', kind: 'Bank payments', tone: 'lime', d: 'Open-banking provider. Adapter covers pay-in, payouts, webhooks, and Account-on-File debits used for refund recovery.' },
  { id: 'ngenius', name: 'N-Genius', kind: 'Cards', tone: 'violet', d: 'Network International card gateway. Adapter uses the hosted payment page, so card data never touches our servers.' },
  { id: 'razor', name: 'Razorpay', kind: 'India payments', tone: 'hot', d: 'India payments provider. Adapter with webhook sync.' },
]
function GatewayWall() {
  const [sel, setSel] = useState<string | null>(null)
  const r = RAILS.find((x) => x.id === sel)
  return (
    <div className="demo wall">
      <div className="demo-bar"><SimTag /><span className="mono dim">pick a rail · same request, same ledger outcome</span></div>
      <div className="wall-grid">
        <div className="req">
          <span className="req-lbl">PaymentRequest</span>
          <pre className={`chip-req ${sel ? 'docked' : ''}`}>{`{
  amountMinor: 12500,
  currency: "AED",
  idempotencyKey: "…",
  orderRef: "…"
}`}</pre>
        </div>
        <div className="plugs" role="group" aria-label="Payment rails">
          {RAILS.map((x) => (
            <button key={x.id} className={`plug ${x.tone} ${sel === x.id ? 'on' : ''}`} aria-pressed={sel === x.id} onClick={() => setSel(sel === x.id ? null : x.id)}>
              <span className="pin" aria-hidden="true" /><b>{x.name}</b><small>{x.kind}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="wall-out" aria-live="polite">
        {r ? (<>
          <p><b>{r.name}.</b> {r.d}</p>
          <pre className="ledger">{`adapter   ${r.id}.createPayment(req) → providerPayload\nwebhook   verified → status: paid\nledger    +12500 minor (identical for every rail)`}</pre>
        </>) : <p className="dim">Select a rail. The order logic never changes; only the adapter does.</p>}
      </div>
      <p className="fine">MBME Pay, TrySpare / Spare Open Finance, Lean, N-Genius and Razorpay are third-party providers. My work is the integration layer, not the providers.</p>
    </div>
  )
}

export function PayIntro() {
  return (<>
    <p className="kicker">03 · Mobcoder Technology · Feb 2026 – now</p>
    <h2 id="pay-h">Money moves. <span className="hl gold">The ledger must not lie.</span></h2>
    <p className="lede">I moved onto the payments platform and built it from the ground up: KanzPay, its gold layer, and the gateway wall that sits under it.</p>
  </>)
}
export function KanzLeft() {
  return (<>
    <StoryHead n="A" kicker="Payment platform · pre-launch" title="KanzPay" pitch={<>A payment platform that takes a buyer's payment through a rail, into a settlement ledger, and out to the seller. <b>Pre-launch</b>: not live yet. I built it from scratch. The Flutter seller app is a sibling project and not mine.</>} />
    <div className="story-copy">
      <ul className="tick">
        <li><b>Minor-unit money model.</b> Whole integers for commissions, tax and settlement.</li>
        <li><b>Daily aggregate settlements</b> across INR/AED, with configurable payout schedules.</li>
        <li><b>Split payments, loyalty earn/redeem</b> and <b>buyer-first refunds</b> with seller recovery.</li>
        <li><b>Hardening:</b> multi-phase security reviews covering auth, signed webhooks, idempotency and payload encryption.</li>
        <li>Extracted a reusable <b>OTP / JWT / Redis auth service</b> for multi-app identity.</li>
      </ul>
    </div>
  </>)
}
export function KanzRight() { return <KanzFlow /> }
export function GoldLeft() {
  return (<>
    <StoryHead n="B" kicker="Digital gold · integration layer" title="SafeGold vault" pitch="Gold is held in micrograms, so every balance is a whole number. SafeGold is the digital-gold provider; I built the service and SDK that talk to it, so apps never call it directly." />
    <div className="story-copy">
      <ul className="tick">
        <li><b>Custodial and KYC wallets</b> held in micrograms.</li>
        <li><b>BullMQ lanes</b> for reward, buy and transfer jobs, with dead-letter handling and alerts.</li>
        <li><b>Rate-lock before buy</b>, idempotency keys, reconciliation and a nightly sweep.</li>
        <li>Buy / sell / gift and KYC flows through the SafeGold integration.</li>
      </ul>
    </div>
  </>)
}
export function GoldRight() { return <Vault /> }
export function GatewayLeft() {
  return (<>
    <StoryHead n="C" kicker="Gateway layer" title="One request. Many rails." pitch="A port-and-adapter payment layer: the order logic speaks one language, and each provider gets its own plug." />
    <div className="chips"><Chip tone="gold">Lean</Chip><Chip tone="gold">N-Genius</Chip><Chip tone="gold">Razorpay</Chip><Chip tone="gold">MBME Pay (integration)</Chip><Chip tone="gold">TrySpare (integration)</Chip></div>
  </>)
}
export function GatewayRight() { return <GatewayWall /> }
