import type { ReactNode } from 'react'
import { HeroLeft, HeroRight } from './sections/Hero'
import { PathLeft, PathRight } from './sections/Timeline'
import { VivoIntro, Story1Left, Story1Right, Story2Left, Story2Right, Story3Left, Story3Right } from './sections/Vivo'
import { PayIntro, KanzLeft, KanzRight, GoldLeft, GoldRight, GatewayLeft, GatewayRight } from './sections/Mobcoder'
import { SkillsLeft, SkillsRight } from './sections/Skills'
import { DossierLeft, DossierRight } from './sections/Dossier'
import { ContactLeft, ContactRight } from './sections/Contact'
import { goStation, STATION_IDS } from './stage'

export type Station = {
  key: string; label: string
  /** anchors that resolve to this station (nav, palette, in-page links) */
  ids: string[]
  /** head turn while docked: -1 toward the left panel … +1 toward the right panel */
  look: number
  tone: 'cy' | 'mg' | 'am' | 'vi'
  left: ReactNode; right: ReactNode
}

function VivoIndex() {
  const items = [['grc', 'GRC / compliance platform', 'Serverless · SOC 2 · ISO 27001 · HIPAA'], ['electron', 'Electron hardware utility', 'Serial ports · IPC · Web Workers'], ['ionic', 'Ionic app: BLE, Wi-Fi, native', 'MQTT · AWS IoT · live charts']]
  return (
    <ol className="index-list">
      {items.map(([id, t, d], i) => (
        <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); goStation(id) }}><span>{i + 1}</span><b>{t}</b><small>{d}</small></a></li>
      ))}
    </ol>
  )
}
function PayIndex() {
  const items = [['kanzpay', 'KanzPay', 'Payment platform · pre-launch'], ['safegold', 'SafeGold vault', 'Digital gold · integration layer'], ['gateway', 'One request. Many rails.', 'MBME Pay · TrySpare · Lean · N-Genius · Razorpay']]
  return (
    <ol className="index-list">
      {items.map(([id, t, d], i) => (
        <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); goStation(id) }}><span>{'ABC'[i]}</span><b>{t}</b><small>{d}</small></a></li>
      ))}
    </ol>
  )
}

export const STATIONS: Station[] = [
  { key: 'hero', label: 'Start', ids: ['top'], look: -0.5, tone: 'cy', left: <HeroLeft />, right: <HeroRight /> },
  { key: 'path', label: 'The path', ids: ['timeline'], look: 0, tone: 'vi', left: <PathLeft />, right: <PathRight /> },
  { key: 'vivo', label: 'Vivo', ids: ['vivo'], look: -0.4, tone: 'mg', left: <VivoIntro />, right: <VivoIndex /> },
  { key: 'grc', label: 'Vivo · GRC platform', ids: ['grc'], look: 0, tone: 'mg', left: <Story1Left />, right: <Story1Right /> },
  { key: 'electron', label: 'Vivo · Electron utility', ids: ['electron'], look: 0, tone: 'mg', left: <Story2Left />, right: <Story2Right /> },
  { key: 'ionic', label: 'Vivo · Ionic app', ids: ['ionic'], look: 0, tone: 'mg', left: <Story3Left />, right: <Story3Right /> },
  { key: 'pay', label: 'Payments', ids: ['mobcoder'], look: -0.4, tone: 'am', left: <PayIntro />, right: <PayIndex /> },
  { key: 'kanz', label: 'KanzPay', ids: ['kanzpay'], look: 0, tone: 'am', left: <KanzLeft />, right: <KanzRight /> },
  { key: 'gold', label: 'SafeGold', ids: ['safegold'], look: 0, tone: 'am', left: <GoldLeft />, right: <GoldRight /> },
  { key: 'gateway', label: 'MBME · TrySpare · rails', ids: ['gateway'], look: 0, tone: 'am', left: <GatewayLeft />, right: <GatewayRight /> },
  { key: 'skills', label: 'Skills', ids: ['skills'], look: 0, tone: 'cy', left: <SkillsLeft />, right: <SkillsRight /> },
  { key: 'dossier', label: 'Résumé dossier', ids: ['dossier'], look: 0.2, tone: 'vi', left: <DossierLeft />, right: <DossierRight /> },
  { key: 'contact', label: 'Contact', ids: ['contact'], look: 0.4, tone: 'cy', left: <ContactLeft />, right: <ContactRight /> },
]
STATIONS.forEach((s, i) => { STATION_IDS[i] = s.ids })
