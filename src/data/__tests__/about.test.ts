import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '../about';

describe('about data', () => {
  it('exports aboutMarkdown as a string', () => {
    expect(typeof aboutMarkdown).toBe('string');
    expect(aboutMarkdown.length).toBeGreaterThan(0);
  });

  it('introduces the work and the draft status', () => {
    expect(aboutMarkdown).toContain('# Intro');
    expect(aboutMarkdown).toContain('full-stack engineer');
    expect(aboutMarkdown).toContain('drafts');
  });

  it('discloses AI assistance', () => {
    expect(aboutMarkdown).toContain('# AI assistance');
    expect(aboutMarkdown).toContain('Cursor');
  });

  it('does not publish a city or a photograph', () => {
    expect(aboutMarkdown).toContain('# Portrait');
    expect(aboutMarkdown).not.toContain('New York');
  });
});
