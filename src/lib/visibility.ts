import type { Metadata } from 'next';

/**
 * The site is indexable only for a Vercel production build that was
 * explicitly marked public (`PORTFOLIO_PUBLIC=1`). Preview builds stay
 * noindex even if the flag leaks into them, and a missing flag stays noindex.
 */
export function isPortfolioPublic(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.PORTFOLIO_PUBLIC === '1' && env.VERCEL_ENV === 'production';
}

/** Robots directives baked into every page at build time. */
export function robotsPolicy(
  env: NodeJS.ProcessEnv = process.env,
): Metadata['robots'] {
  if (!isPortfolioPublic(env)) {
    return { index: false, follow: false, nocache: true };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}
