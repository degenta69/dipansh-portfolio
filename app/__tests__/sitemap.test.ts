import { afterEach, describe, expect, it, vi } from 'vitest';

import { caseStudies } from '@/data/case-studies';
import { SITE_URL } from '@/lib/utils';
import sitemap from '../sitemap';

afterEach(() => {
  vi.unstubAllEnvs();
});

function markPublic() {
  vi.stubEnv('PORTFOLIO_PUBLIC', '1');
  vi.stubEnv('VERCEL_ENV', 'production');
}

describe('sitemap', () => {
  it('lists no urls while the site is private', () => {
    vi.stubEnv('PORTFOLIO_PUBLIC', '');
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(sitemap()).toEqual([]);

    vi.stubEnv('PORTFOLIO_PUBLIC', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    expect(sitemap()).toEqual([]);
  });

  it('uses trailing slashes for exported page routes', () => {
    markPublic();
    const entries = sitemap();

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: `${SITE_URL}/` }),
        expect.objectContaining({ url: `${SITE_URL}/work/` }),
        expect.objectContaining({ url: `${SITE_URL}/about/` }),
        expect.objectContaining({ url: `${SITE_URL}/resume/` }),
        expect.objectContaining({ url: `${SITE_URL}/projects/` }),
        expect.objectContaining({ url: `${SITE_URL}/contact/` }),
        ...caseStudies.map((study) =>
          expect.objectContaining({
            url: `${SITE_URL}/work/${study.slug}/`,
          }),
        ),
      ]),
    );
  });

  it('does not invent modification dates', () => {
    markPublic();
    expect(sitemap().every((entry) => entry.lastModified === undefined)).toBe(
      true,
    );
  });

  it('does not publish removed sections', () => {
    markPublic();
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.some((url) => url.includes('/writing'))).toBe(false);
    expect(urls.some((url) => url.includes('/stats'))).toBe(false);
  });
});
