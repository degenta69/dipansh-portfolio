import { describe, expect, it } from 'vitest';

import { isPortfolioPublic, robotsTxt } from '../write-robots.mjs';

const env = (values: Record<string, string | undefined>) =>
  values as NodeJS.ProcessEnv;

describe('exported robots.txt', () => {
  it('disallows the whole site unless production is marked public', () => {
    expect(isPortfolioPublic(env({}))).toBe(false);
    expect(isPortfolioPublic(env({ PORTFOLIO_PUBLIC: '1' }))).toBe(false);
    expect(
      isPortfolioPublic(
        env({
          PORTFOLIO_PUBLIC: '1',
          VERCEL_ENV: 'preview',
        }),
      ),
    ).toBe(false);
    expect(robotsTxt(env({}))).toBe('User-agent: *\nDisallow: /\n');
  });

  it('advertises the sitemap only for a public production build', () => {
    const publicProduction = env({
      PORTFOLIO_PUBLIC: '1',
      VERCEL_ENV: 'production',
    });

    expect(isPortfolioPublic(publicProduction)).toBe(true);
    expect(robotsTxt(publicProduction, 'https://portfolio.example/')).toBe(
      'User-agent: *\nDisallow: /api\n\nSitemap: https://portfolio.example/sitemap.xml\n',
    );
  });
});
