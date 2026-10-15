import { afterEach, describe, expect, it, vi } from 'vitest';

import { isPortfolioPublic, robotsPolicy } from '../visibility';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('portfolio visibility', () => {
  it('stays private when the flag is unset', () => {
    vi.stubEnv('PORTFOLIO_PUBLIC', '');
    vi.stubEnv('VERCEL_ENV', 'production');

    expect(isPortfolioPublic()).toBe(false);
    expect(robotsPolicy()).toMatchObject({ index: false, follow: false });
  });

  it('stays private on preview even when the flag is set', () => {
    vi.stubEnv('PORTFOLIO_PUBLIC', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');

    expect(isPortfolioPublic()).toBe(false);
    expect(robotsPolicy()).toMatchObject({ index: false, follow: false });
  });

  it('stays private for a local build', () => {
    vi.stubEnv('PORTFOLIO_PUBLIC', '1');
    vi.stubEnv('VERCEL_ENV', '');

    expect(isPortfolioPublic()).toBe(false);
  });

  it('allows indexing only for a public production build', () => {
    vi.stubEnv('PORTFOLIO_PUBLIC', '1');
    vi.stubEnv('VERCEL_ENV', 'production');

    expect(isPortfolioPublic()).toBe(true);
    expect(robotsPolicy()).toMatchObject({ index: true, follow: true });
  });
});
