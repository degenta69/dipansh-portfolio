/**
 * Rewrites `out/robots.txt` after the static export.
 *
 * `public/robots.txt` is the private default served in development. A
 * production build with `PORTFOLIO_PUBLIC=1` is the only case that advertises
 * a sitemap. Keep this predicate aligned with `src/lib/visibility.ts`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export function isPortfolioPublic(env = process.env) {
  return env.PORTFOLIO_PUBLIC === '1' && env.VERCEL_ENV === 'production';
}

export function robotsTxt(
  env = process.env,
  siteUrl = 'https://portfolio.example/',
) {
  if (!isPortfolioPublic(env)) {
    return 'User-agent: *\nDisallow: /\n';
  }

  const origin = siteUrl.replace(/\/$/, '');
  return `User-agent: *\nDisallow: /api\n\nSitemap: ${origin}/sitemap.xml\n`;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const root = process.cwd();
  const { homepage } = JSON.parse(
    readFileSync(join(root, 'package.json'), 'utf8'),
  );

  writeFileSync(
    join(root, 'out', 'robots.txt'),
    robotsTxt(process.env, homepage),
  );
}
