# Signal Atlas Lite — Dipansh Saxena portfolio (v0.1)

Vite + React 19 + TypeScript, GSAP/ScrollTrigger. Static output (`dist/`), deployable on free Vercel (framework preset: Vite, build `npm run build`, output `dist`). Not deployed; local git only.

    npm install
    npm run dev          # http://localhost:5173
    npm run build        # type-check + production build
    npm run serve        # static preview of dist on :4173
    node qa.mjs          # Playwright QA + screenshots (needs preview running)

Routes: `/` (single page) and `#/resume` (printable résumé, hash route so no rewrites needed).

Motion: honours `prefers-reduced-motion`; the nav toggle overrides and persists (localStorage). With motion off all content shows statically; demos need a click to advance.
Placeholders: hero portrait slot (reserved for the 3D photo). No three.js yet (phase 2).
All demos are labelled "illustrative simulation".
