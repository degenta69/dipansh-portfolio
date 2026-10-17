# Orbit — Dipansh Saxena portfolio (v1, avatar-centred redesign)

Vite + React 19 + TypeScript, GSAP, three.js (all MIT). Static output (`dist/`). Local git only.

    npm install
    npm run dev | build | preview

**Concept.** A rigged 3D head is a fixed stage in the centre of the viewport. Each page section is an "orbit station": a left and a right HUD panel that fly in along an orbital arc, dock beside the head, then swing behind it. Scrolling drives one rAF loop (transform/opacity only). The head tracks the cursor, turns toward the docked panel, blinks, smiles on hover and reacts to clicks and station changes. A ring of 13 station nodes circles the head.

**Head model.** `public/avatar/avatar-head.glb` (head-only rigged GLB) is used automatically if it exists at dev/build start; otherwise `public/avatar/avatar.glb` is loaded and cropped at the neck (clipping plane + CSS fade). Bones/morphs are found by name/alias (head, neck, eye.L/R; blink, smile, jawOpen, look*, browRaise, ARKit names). Poster: `avatar-approved-cutout.webp` shows instantly and is the fallback.

**Static fallback** (portrait + CSS-only orbit): reduced motion / Motion off, touch or <760px, ≤4 cores or ≤4GB, no WebGL, or load failure. Force with `?avatar=static` / `?avatar=3d`.

`scripts/optimize-avatar.mjs` documents the GLB diet (split morph targets off the hair, simplify hair, resize textures, meshopt).

Routes: `/` (single page) and `#/resume` (printable résumé, hash route so no rewrites needed).

Motion: honours `prefers-reduced-motion`; the nav toggle overrides and persists (localStorage). With motion off all content shows statically; demos need a click to advance.
Placeholders: hero portrait slot (reserved for the 3D photo). No three.js yet (phase 2).
All demos are labelled "illustrative simulation".
