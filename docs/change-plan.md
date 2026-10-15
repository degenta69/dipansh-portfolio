# Change plan: Dipansh Saxena's portfolio

**Status:** implementation updated for a public GitHub repository and Vercel Hobby. Not deployed from this workspace.

**Foundation:** `mldangelo/personal-site` at `9273f7c48e5f4e39693bdc586b6d567f2ab4deb4`. `LICENSE` keeps the upstream copyright notice required by MIT. This repo adds `Copyright (c) 2026 Dipansh Saxena` for the new work. The adapting guide's `src/data/stats/personal.tsx` path was wrong; the file was `personal.ts`, and the stats feature is removed.

**Approval (2026-10-15) overrides the earlier plan, the design proposal's payments node set, and any unticked claim.** Where they conflict, this section wins.

## Approval overrides

1. Deep teal (`#0B5D5E` / `#5FC4BE`). Amber stays the in-progress colour.
2. Systems Map is a server-rendered SVG. Hover, focus, and keyboard use CSS (preview cards and edge highlight) plus a tiny client live-region update. WebGL is not used: SVG is the better fit, and it does not need a second renderer.
3. Portrait is a designed placeholder slot for a future 3D portrait. No fake photograph.
4. Payments stay high level. No refunds, no settlement rewrite, no provider names, no internal payment flows, and no reconstructed architecture. Diagrams are independently drawn and labelled illustrative.
5. Food ordering is a separate pre-launch story and covers the initial contribution only. No production or scale claims. The scanning feature is not mentioned.
6. No disputed metrics. No unshipped feature is described as implemented. AI assistance is disclosed; rows are not marked AI-assisted until that share is confirmed.
7. No deploy, no analytics, no links to project repositories. GitHub on the page is the profile `https://github.com/degenta69` only, because this run asked for it. Credential cleanup (plan H) is still open, so that profile link is not a launch approval.
8. Email and LinkedIn are placeholders. No phone. No city.
9. Case studies are drafts pending confirmation. DiskGod is marked in progress; hardening is not described as done.
10. Writing is removed entirely (a zero-post export cannot build). Stats, Google Analytics, and the GitHub Pages deploy job are removed. `vercel.json` is added and not deployed.

## Identity and removal

Upstream name, bio, photos, links, résumé, analytics IDs, domain, posts, and project images are removed. Expected leftovers of the upstream name:

- `LICENSE` (required notice)
- README and footer credit: `mldangelo/personal-site`
- `AGENTS.md` history, where it still describes the foundation

## Systems Map node set (replaces design-proposal §7 where they differ)

Four areas. No edge crosses an area.

| Area                   | Nodes                                                                                                                          | State                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| 01 Payments            | Checkout (context) → Payment service (link) → Provider interface, names withheld (context)                                     | Illustrative. Not a reconstruction. |
| 02 Commerce workflows  | Buyer, Seller, Delivery, Admin (context, no edges); Order lifecycle → Real-time channels (links)                               | Pre-launch, separate from payments  |
| 03 Serverless & events | API Gateway → Lambda router → Role authorizer (links on the last two); SQS queue, Event workers, Schedules (context, no edges) | No route count. No repository link  |
| 04 Open source         | DiskGod (link, amber, text "in progress"); Lambda API template (link to the serverless study)                                  | No edge between these two projects  |

Removed from the earlier node set: Refunds, Digital gold, Settlement ledger, Webhooks as an internal flow, and any shared-auth node.

## Skills

TypeScript, JavaScript, React, Node.js, AWS Lambda, SQS, EventBridge, MQTT, Ionic, MongoDB, PostgreSQL, Redis, REST APIs, payment integrations, webhooks, CI/CD. Docker is listed with no duration. No Kafka, Kubernetes, GraphQL, or years per technology.

## Validation

`npm ci`, format, lint, type-check, unit tests, `og:check`, production build, `verify-export`, `measure-export`, and the identity search. Report observed results only.

## Still open before any launch

Hygiene items H1–H6 in the original checklist (credential cleanup, DiskGod hardening, music-product links on résumés outside this repo). A real email, LinkedIn profile, 3D portrait, and confirmation of every draft sentence. Hosting is the public GitHub repository on Vercel Hobby; this workspace still does not deploy.
