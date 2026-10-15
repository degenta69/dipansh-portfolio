import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

interface HeaderRule {
  source: string;
  has?: { type: string; value: string }[];
  headers: { key: string; value: string }[];
}

const config = JSON.parse(
  readFileSync(join(process.cwd(), 'vercel.json'), 'utf8'),
) as {
  buildCommand: string;
  outputDirectory: string;
  framework: string;
  trailingSlash: boolean;
  headers: HeaderRule[];
};

const PRODUCTION_HOST = 'dipansh-portfolio.vercel.app';
const PREVIEW_HOST = 'dipansh-portfolio-git-main-degenta69.vercel.app';
const DEPLOYMENT_HOST = 'dipansh-portfolio-a1b2c3d4e5-degenta69.vercel.app';

describe('vercel.json', () => {
  it('builds with the guard, export checks and exports the static site', () => {
    expect(config.buildCommand).toBe(
      'npm run build && npm run verify-export && npm run measure-export',
    );
    expect(config.outputDirectory).toBe('out');
    expect(config.framework).toBe('nextjs');
    expect(config.trailingSlash).toBe(true);
  });

  it('does not send noindex on the production hostname', () => {
    const unconditional = config.headers.filter((rule) => !rule.has);
    const robots = unconditional.flatMap((rule) =>
      rule.headers.filter((header) => header.key === 'X-Robots-Tag'),
    );

    expect(robots).toEqual([]);
    expect(
      unconditional.some((rule) =>
        rule.headers.some((header) => header.key === 'X-Content-Type-Options'),
      ),
    ).toBe(true);
  });

  it('sends noindex on preview and deployment hosts only', () => {
    const conditional = config.headers.filter((rule) => rule.has);
    expect(conditional).toHaveLength(1);

    const host = conditional[0]?.has?.find((entry) => entry.type === 'host');
    expect(host?.value).toBeTruthy();
    const pattern = new RegExp(host?.value ?? '');

    expect(pattern.test(PRODUCTION_HOST)).toBe(false);
    expect(pattern.test(PREVIEW_HOST)).toBe(true);
    expect(pattern.test(DEPLOYMENT_HOST)).toBe(true);
    expect(
      conditional[0]?.headers.find((header) => header.key === 'X-Robots-Tag')
        ?.value,
    ).toBe('noindex, nofollow');
  });
});
