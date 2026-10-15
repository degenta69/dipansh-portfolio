# Deployment

The public site is a Vercel Hobby project built from the public GitHub repository [degenta69/dipansh-portfolio](https://github.com/degenta69/dipansh-portfolio). Pushes to `main` deploy production. Pull requests deploy previews. Production is publicly visible and indexable. Previews stay `noindex`.

This repository does not deploy itself. The steps at the end are the ones Dipansh runs in Vercel.

## Why GitHub

[Vercel’s Origin git documentation](https://vercel.com/docs/git/vercel-for-origin) says deploying Origin repositories is in beta on **Pro and Enterprise**, and that an Origin repository cannot be deployed from a Hobby team. The Origin repository stays as it is. Hobby deploys from the public GitHub repository instead.

## What this repo already enforces

`npm run ci` is the gate, in this order:

1. `format:check`
2. `lint`
3. `type-check`
4. `test`
5. `guard` (banned names, metrics, and upstream identity)
6. `og:check` (ledger, then a fresh render)
7. `build` (static export into `out/`, then `scripts/write-robots.mjs`)
8. `verify-export`
9. `measure-export`

`vercel.json` sets `buildCommand` to the build, export-verification and size-budget steps (the full `npm run ci` gate, including format, lint and tests, runs in GitHub Actions; Vercel rewrites `vercel.json` during its build, which trips the formatter there) and `outputDirectory` to `out`. Vercel publishes the static export only after that command exits 0. A failed check fails the deployment. `ignoreCommand` is not set, so Vercel does not skip the build.

`output: 'export'` in `next.config.mjs` remains the production build. `trailingSlash` is true in both Next and `vercel.json`.

GitHub Actions runs the same gate. `.github/workflows/node.js.yml` runs on every push and every pull request, checks out with `persist-credentials: false`, keeps `contents: read`, and runs `npm run ci` on Node 26 from `.nvmrc`. It has no deploy job.

## Indexing

A build is indexable only when `PORTFOLIO_PUBLIC` is exactly `1` and `VERCEL_ENV` is `production`. That is the production deployment. Preview builds, pull-request builds, and a local `npm run ci` leave the flag unset, so they emit `<meta name="robots" content="noindex, nofollow">`, `robots.txt` of `Disallow: /`, and an empty sitemap.

`vercel.json` cannot branch on `VERCEL_ENV`. It sends `X-Robots-Tag: noindex, nofollow` only when the `Host` matches a preview or unique deployment URL:

- branch previews, which contain `-git-` before `.vercel.app`
- unique deployment URLs shaped `dipansh-portfolio-<segment>-<segment>.vercel.app`

The stable production hostname `dipansh-portfolio.vercel.app` does not match, so production responses do not send that header. Security headers (nosniff, referrer policy, content security policy, permissions policy) still apply to every response.

If Vercel assigns a different production hostname, update the `has` host pattern in `vercel.json` so that hostname is not covered. Otherwise the production alias would also send `noindex`.

Set `PORTFOLIO_PUBLIC` on the Production environment only. Setting it on Preview does not make preview HTML indexable, and the host rule still sends `noindex` on preview URLs.

## What a failed build looks like

Vercel runs `npm ci`, then `npm run ci`. The first failing script stops the command, and Vercel marks the deployment failed. It does not publish a new deployment from a failed build. The previous successful deployment stays in place.

## Remaining Vercel steps

1. In the Vercel Hobby team, choose **Add New… → Project**.
2. Import the GitHub repository `degenta69/dipansh-portfolio`.
3. Framework Preset: **Next.js**.
4. Root Directory: `./`.
5. Build Command: `npm run ci`. Output Directory: `out`. `vercel.json` already sets both; confirm the dashboard shows those values.
6. Environment variables: `PORTFOLIO_PUBLIC` = `1` for **Production** only. No other variables. Do not set `PORTFOLIO_PUBLIC` on Preview or Development.
7. Deploy.

After that, pushes to `main` deploy production automatically, and pull requests deploy previews automatically. Node.js on Vercel can be 22.x or 24.x when 26 is not in the list. `engines.node` accepts `^22.22.2`, `^24.15.0`, and `>=26`.
