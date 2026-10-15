import { CONTACT } from '../data'

const Bul = ({ children }: { children: React.ReactNode }) => <li>{children}</li>

export default function Resume() {
  return (
    <main id="main" className="resume" tabIndex={-1}>
      <div className="resume-actions no-print">
        <a className="btn" href="#">← Back to the atlas</a>
        <button className="btn primary" onClick={() => window.print()}>Print / save as PDF</button>
      </div>
      <article className="paper">
        <header>
          <h1>Dipansh Saxena</h1>
          <p className="contact-line">
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> · <a href={CONTACT.github}>{CONTACT.githubLabel}</a> · <a href={CONTACT.linkedin}>{CONTACT.linkedinLabel}</a>
          </p>
        </header>

        <section>
          <h2>Profile</h2>
          <p>Full-stack software engineer building payment, marketplace and real-time systems. Ships Node/TypeScript APIs and React / React Native / Ionic clients end to end: gateway adapters, settlements, refunds, digital-gold flows, serverless AWS back ends and device tooling. Strong focus on system design, clean architecture and long-term reliability. Works in an AI-assisted development workflow while keeping correctness through debugging, validation and refactoring.</p>
        </section>

        <section>
          <h2>Experience</h2>

          <div className="job">
            <div className="job-h"><div><h3>Mobcoder Technology</h3><p>SDE-2 (Full Stack) · Noida</p></div><time>Feb 2026 – Present</time></div>
            <ul>
              <Bul>Built KanzPay (pre-launch), a payment platform covering buyer payments, payment-request orchestration, commission billing, loyalty and seller settlement, from scratch.</Bul>
              <Bul>Payments &amp; settlements: built gateway adapters (Lean open banking, N-Genius cards, Razorpay) with webhook sync, plus MBME Pay (cards) and TrySpare / Spare Open Finance (bank payments) provider integrations; minor-unit commission ledgers and daily aggregate seller settlements across INR/AED.</Bul>
              <Bul>Designed a precision-first financial model (“Minor Pattern”) to eliminate floating-point errors across commissions, GST handling and automated settlement pipelines with configurable payout schedules.</Bul>
              <Bul>SafeGold integration: built the digital-gold buy/sell/gift/KYC service and SDK layer (custodial and KYC wallets in micrograms, BullMQ reward/buy/transfer pipelines, rate-lock, idempotency, reconciliation); split payments, loyalty earn/redeem and buyer-first refunds with Lean Account-on-File seller recovery.</Bul>
              <Bul>Hardening: drove multi-phase security reviews (auth, webhooks, idempotency, payload encryption); extracted reusable oxy-auth (OTP/JWT/Redis) for multi-app identity.</Bul>
              <Bul>Real-time and high-throughput systems: order lifecycle tracking with Socket.io; Redis as a buffer layer with controlled persistence to PostgreSQL.</Bul>
              <Bul>Worked in an AI-assisted development workflow to explore design options and speed up implementation while keeping correctness through debugging, validation and continuous refactoring.</Bul>
            </ul>
          </div>

          <div className="job">
            <div className="job-h"><div><h3>Vivo Collaboration Solution</h3><p>React Developer → Software Engineer (JavaScript) → Software Engineer (Full Stack) · Noida</p></div><time>May 2022 – Jan 2026</time></div>
            <ul>
              <Bul>Built and maintained a mobile application (Ionic, with Cordova/Capacitor plugins) and admin portal for connected devices: bug fixing, new functionality, testing and maintenance. Shipped 40+ features from client feedback and fixed 700+ bugs and issues <i>(self-reported)</i>.</Bul>
              <Bul>Integrated native Android features (contacts, Bluetooth/BLE, Wi-Fi) through Cordova and Capacitor plugins; built camera and contacts integrations from scratch; worked on Web Workers and MQTT with AWS IoT.</Bul>
              <Bul>Led R&amp;D for dynamic data visualisation: 6+ static and 5 live-streaming charts <i>(self-reported)</i>; built 50+ reusable Material UI components <i>(self-reported)</i>.</Bul>
              <Bul>Pioneered an in-house Electron.js desktop tool (Windows) for serial-port data reading, real-time charting and firmware flashing to microcontrollers, used by the internal hardware team (about 15–20 engineers) to debug live devices; main/renderer separation over IPC, buffering and Web Workers. Reduced device-debugging time by 40% <i>(self-reported)</i>.</Bul>
              <Bul>Designed back-end architecture, set up AWS services and environments, and built micro-services, APIs and cron jobs on Lambda, EventBridge and SQS; KMS-protected secrets; AWS Parameter Store, SNS and SES. Created the architecture for a reusable AWS Lambda Node.js API template.</Bul>
              <Bul>Built the GRC / compliance platform back end and admin front end: source-agnostic evidence ingestion for multi-account workflows, control mapping, task assignment and auditor collaboration (SOC 2, ISO 27001, HIPAA).</Bul>
              <Bul>Automated CI/CD with GitHub Actions, shell scripts and AWS SAM for micro-services, Lambda and layers; 30% reduction in deployment time <i>(self-reported)</i>.</Bul>
              <Bul>Developed a custom Prisma/MongoDB wrapper, reducing query time by up to 80% <i>(self-reported)</i>.</Bul>
              <Bul>Trained coworkers on TypeScript and React; took part in peer code reviews and design discussions.</Bul>
            </ul>
          </div>

          <div className="job">
            <div className="job-h"><div><h3>Across The Globe (ATG World)</h3><p>React Developer / React.js Intern · Remote</p></div><time>Dec 2021 – May 2022</time></div>
            <ul>
              <Bul>Translated pixel-perfect Figma designs into responsive websites for client requirements.</Bul>
              <Bul>Integrated a Django API with user authentication and JWT token management; deployed to Netlify and used Ngrok for integration testing. Built for QSI, a global queer-affirmative services platform.</Bul>
            </ul>
          </div>
        </section>

        <section>
          <h2>Skills</h2>
          <dl className="skills-dl">
            <dt>Languages &amp; core</dt><dd>TypeScript, JavaScript, Node.js, Express, HTML/CSS, Python (secondary)</dd>
            <dt>Front end &amp; apps</dt><dd>React, Next.js, React Native (Expo), Ionic, Cordova/Capacitor, Electron, Material UI, Radix UI, Tailwind, Redux, Zustand, TanStack Query, Chart.js, Recharts</dd>
            <dt>Devices &amp; real-time</dt><dd>BLE, Wi-Fi, serial ports, MQTT, AWS IoT, WebSockets, Socket.io, Web Workers</dd>
            <dt>Cloud &amp; back end</dt><dd>AWS (Lambda, SQS, EventBridge, SNS, SES, S3, KMS, Parameter Store, SAM), BullMQ, Redis, Zod, Supabase, Sanity CMS, Vercel</dd>
            <dt>Data</dt><dd>PostgreSQL, MongoDB, Mongoose, Prisma, Drizzle</dd>
            <dt>Payments</dt><dd>Gateway adapters, webhooks, idempotency, minor-unit ledgers, settlements; Lean, N-Genius, Razorpay, Stripe; MBME Pay, TrySpare and SafeGold integrations</dd>
            <dt>Practice</dt><dd>GitHub Actions, CI/CD, Git, Jest/Vitest/Supertest, code review, mentoring</dd>
          </dl>
        </section>

        <section>
          <h2>Projects</h2>
          <ul>
            <Bul><b>Monolith Lambda API template</b> (open source): reusable serverless API template in TypeScript with dependency injection, Prisma, AWS KMS and shell-script deploys.</Bul>
            <Bul><b>MongoDB wrapper</b>: custom data-access wrapper to simplify MongoDB operations.</Bul>
            <Bul><b>DiskGod</b>: Discord-style real-time chat (MongoDB, Express, React, Socket.io, Redux, Tailwind).</Bul>
            <Bul><b>NetFlex</b>: Netflix-style streaming UI (React, Firebase, TMDB API).</Bul>
            <Bul><b>Engage Music</b>: freelance e-commerce MVP for artists to sell albums (React, TypeScript, Material UI, Node/Express, MongoDB, Stripe, AWS EC2 + CodePipeline).</Bul>
            <Bul><b>QSI (Queer Spot India)</b>: global platform front end (React, Recoil, Google login, Razorpay).</Bul>
          </ul>
        </section>

        <section>
          <h2>Education</h2>
          <div className="job-h"><div><h3>Institute of Technology and Science, Ghaziabad</h3><p>Bachelor of Computer Application (B.C.A)</p></div><time>Aug 2019 – Aug 2022</time></div>
          <div className="job-h"><div><h3>DAV Public School (CBSE), Ghaziabad</h3><p>Senior Secondary (XII), Commerce</p></div><time>2018 – 2019</time></div>
        </section>

        <section>
          <h2>Languages &amp; interests</h2>
          <p>English (professional), Hindi (native). Cooking, video games, swimming, chess.</p>
        </section>
        <p className="fine">Figures marked self-reported are my own reported numbers.</p>
      </article>
    </main>
  )
}
