export const CONTACT = {
  email: 'dipansh.dev.saxena@gmail.com',
  github: 'https://github.com/degenta69',
  githubLabel: 'github.com/degenta69',
  linkedin: 'https://www.linkedin.com/in/dipansh-saxena',
  linkedinLabel: 'linkedin.com/in/dipansh-saxena',
}

export const SECTIONS = [
  { id: 'top', label: 'Start' },
  { id: 'timeline', label: 'Path' },
  { id: 'vivo', label: 'Vivo' },
  { id: 'mobcoder', label: 'Payments' },
  { id: 'skills', label: 'Skills' },
  { id: 'dossier', label: 'Résumé file' },
  { id: 'contact', label: 'Contact' },
]

export type SkillGroup = { id: string; name: string; tone: string; items: string[] }
export const SKILLS: SkillGroup[] = [
  { id: 'lang', name: 'Languages & core', tone: 'lime', items: ['TypeScript', 'JavaScript', 'Node.js', 'Express', 'Python (secondary)', 'HTML/CSS'] },
  { id: 'front', name: 'Front end & apps', tone: 'violet', items: ['React', 'Next.js', 'React Native (Expo)', 'Ionic', 'Cordova / Capacitor', 'Material UI', 'Radix UI', 'Tailwind', 'Redux', 'Zustand', 'TanStack Query', 'Chart.js', 'Recharts', 'Electron'] },
  { id: 'device', name: 'Devices & real-time', tone: 'hot', items: ['BLE', 'Wi-Fi', 'Serial ports', 'MQTT', 'AWS IoT', 'WebSockets', 'Socket.io', 'Web Workers', 'IPC (Electron)'] },
  { id: 'cloud', name: 'Cloud & back end', tone: 'lime', items: ['AWS Lambda', 'SQS', 'EventBridge', 'SNS / SES', 'S3', 'KMS', 'Parameter Store', 'AWS SAM', 'BullMQ', 'Redis', 'Zod', 'Supabase', 'Sanity CMS', 'Vercel'] },
  { id: 'data', name: 'Data', tone: 'gold', items: ['PostgreSQL', 'MongoDB', 'Mongoose', 'Prisma', 'Drizzle'] },
  { id: 'pay', name: 'Payments', tone: 'gold', items: ['Gateway adapters', 'Webhooks', 'Idempotency', 'Minor-unit ledgers', 'Settlements', 'Lean', 'N-Genius', 'Razorpay', 'MBME Pay (integration)', 'TrySpare (integration)', 'SafeGold (integration)', 'Stripe'] },
  { id: 'craft', name: 'Craft', tone: 'violet', items: ['GitHub Actions', 'CI/CD', 'Git', 'Jest / Vitest / Supertest', 'Code review', 'Mentoring', 'AI-assisted development'] },
]
