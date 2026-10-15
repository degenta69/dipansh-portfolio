# Dipansh Saxena

Static portfolio for Dipansh Saxena, a full-stack engineer. The site is a Next.js App Router export: a homepage with a systems map, draft case studies, a résumé, and contact links. This repository does not deploy the site and does not link to project repositories. Production hosting is Vercel Hobby from the public GitHub repository; see [docs/deployment.md](docs/deployment.md).

Case studies are drafts pending confirmation.

## Run it locally

Use the Node release in `.nvmrc` (26). `engines.node` also accepts `^22.22.2` and `^24.15.0`.

```bash
nvm install
nvm use
npm ci
npm run dev
```

## Commands

```bash
npm run dev             # Start the development server
npm run format          # Format with Prettier and Biome
npm run lint            # Run Biome checks
npm run type-check      # Run TypeScript
npm test                # Run Vitest
npm run build           # Build the production static export
npm run verify-export   # Inspect the generated HTML
npm run measure-export  # Weigh the export against scripts/budget.json
npm run og              # Regenerate the site share card
npm run og:check        # Verify the card ledger and a fresh render
npm run icons           # Regenerate the monogram icons
npm run guard           # Banned-terms and upstream-identity scan
npm run ci              # Full gate: format, lint, types, tests, guard, cards, build, export
```

## Licence and credits

The application code is based on [mldangelo/personal-site](https://github.com/mldangelo/personal-site) and remains [MIT](./LICENSE). Copyright notices for Michael D'Angelo and Dipansh Saxena are in that file.

Site content — biography, case studies, and résumé — is © Dipansh Saxena. All rights reserved. It is not covered by the MIT licence.

IBM Plex Sans, Source Serif 4, and JetBrains Mono are self-hosted under the SIL Open Font License. The licence texts are in `public/licenses/fonts/`. Do not modify the fonts or republish them under the reserved names Plex or Source.
