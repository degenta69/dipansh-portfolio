import { describe, expect, it } from 'vitest';

import contact from '@/data/contact';
import profile from '@/data/profile.json';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';
import { sortPositions } from '@/lib/career';
import {
  buildJsonResume,
  RESUME_JSON_PATH,
  RESUME_JSON_URL,
  serializeJsonResume,
  toPlainText,
} from '@/lib/resumeJson';
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/utils';

/** Root properties JSON Resume v1.0.0 allows; the schema forbids the rest. */
const ROOT_KEYS = [
  '$schema',
  'basics',
  'work',
  'volunteer',
  'education',
  'awards',
  'certificates',
  'publications',
  'skills',
  'languages',
  'interests',
  'references',
  'projects',
  'meta',
];

/** The schema's `iso8601` definition: YYYY, YYYY-MM, or YYYY-MM-DD. */
const ISO8601 =
  /^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$/;

const resume = buildJsonResume();

describe('toPlainText', () => {
  it('keeps anchor text and drops the markup', () => {
    expect(
      toPlainText("see <a href='https://example.com'>the docs</a> now"),
    ).toBe('see the docs now');
  });

  it('unwraps markdown links, emphasis, and code', () => {
    expect(
      toPlainText('[docs](https://example.com) are **very** *good* `code`'),
    ).toBe('docs are very good code');
  });

  it('collapses the wrapping and indentation of template literals', () => {
    expect(toPlainText('one\n    two\n\n  three ')).toBe('one two three');
  });

  it('decodes HTML entities', () => {
    expect(toPlainText('Trust &amp; Safety &#38; more')).toBe(
      'Trust & Safety & more',
    );
  });

  it('preserves invalid numeric entities instead of throwing or emitting surrogates', () => {
    for (const entity of [
      '&#1114112;',
      '&#x110000;',
      '&#99999999;',
      '&#xD800;',
      '&#xDFFF;',
    ]) {
      expect(() => toPlainText(`before ${entity} after`)).not.toThrow();
      expect(toPlainText(`before ${entity} after`)).toBe(
        `before ${entity} after`,
      );
    }
  });

  it('decodes valid scalar values at each side of the surrogate range', () => {
    expect(toPlainText('&#xD7FF;&#xE000;&#x10FFFF;')).toBe(
      `${String.fromCodePoint(0xd7ff)}${String.fromCodePoint(
        0xe000,
      )}${String.fromCodePoint(0x10ffff)}`,
    );
  });

  it('leaves underscores alone so identifiers survive', () => {
    expect(toPlainText('the snake_case_name field')).toBe(
      'the snake_case_name field',
    );
  });

  it('preserves angle-bracket comparisons that are not HTML tags', () => {
    expect(
      toPlainText(
        'latency < 50ms and throughput > 1k with Map<string, number>',
      ),
    ).toBe('latency < 50ms and throughput > 1k with Map<string, number>');
  });
});

describe('json resume document', () => {
  it('declares the schema it conforms to and adds no keys of its own', () => {
    expect(resume.$schema).toBe(
      'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    );
    for (const key of Object.keys(resume)) {
      expect(ROOT_KEYS).toContain(key);
    }
  });

  it('builds basics from the shared profile facts', () => {
    expect(resume.basics).toMatchObject({
      name: AUTHOR_NAME,
      label: profile.role,
      email: profile.email,
      url: `${SITE_URL}/`,
      summary: SITE_DESCRIPTION,
    });
    expect(resume.basics).not.toHaveProperty('image');
    expect(resume.basics).not.toHaveProperty('location');
  });

  it('lists every non-email contact as a profile with its handle', () => {
    const socials = contact.filter((item) => !item.link.startsWith('mailto:'));

    expect(resume.basics.profiles).toHaveLength(socials.length);
    expect(resume.basics.profiles).toContainEqual({
      network: 'GitHub',
      username: 'degenta69',
      url: 'https://github.com/degenta69',
    });
    expect(resume.basics.profiles).toContainEqual({
      network: 'LinkedIn (placeholder)',
      username: 'linkedin-placeholder',
      url: 'https://example.com/linkedin-placeholder',
    });
    expect(
      resume.basics.profiles.every((entry) => entry.username.length > 0),
    ).toBe(true);
  });

  it('carries every position in résumé order', () => {
    expect(resume.work.map((position) => position.name)).toEqual(
      sortPositions(work).map((position) => position.name),
    );
    expect(resume.work[0]).toMatchObject({
      name: 'Payment and commerce systems',
      position: work.find(
        (position) => position.name === 'Payment and commerce systems',
      )?.position,
      startDate: '2026-02-01',
    });
    expect(resume.work[0]).not.toHaveProperty('url');
  });

  it('omits endDate for the current role rather than inventing one', () => {
    expect(resume.work[0]).not.toHaveProperty('endDate');
    expect(
      resume.work.find((position) => position.name === 'Event-driven services')
        ?.endDate,
    ).toBe('2026-01-01');
  });

  it('keeps summaries as plain text', () => {
    expect(resume.work[0].summary).toContain('Draft pending confirmation');
  });

  it('leaves no markup or uncollapsed whitespace anywhere in the prose', () => {
    const prose = resume.work.flatMap((position) => [
      position.summary ?? '',
      ...(position.highlights ?? []),
    ]);

    expect(prose.length).toBeGreaterThan(0);
    for (const text of prose) {
      expect(text).not.toMatch(/[<>]/);
      expect(text).not.toMatch(/\[[^\]]+\]\([^)]*\)/);
      expect(text).not.toMatch(/\s{2,}|[\n\r\t]/);
    }
  });

  it('uses schema-valid dates throughout', () => {
    for (const position of resume.work) {
      expect(position.startDate).toMatch(ISO8601);
      if (position.endDate) expect(position.endDate).toMatch(ISO8601);
    }
    for (const entry of resume.education) {
      expect(entry.endDate).toMatch(ISO8601);
    }
  });

  it('splits the degree string into studyType and area', () => {
    expect(resume.education).toHaveLength(degrees.length);
    expect(resume.education[0]).toMatchObject({
      institution: 'I.T.S Ghaziabad',
      url: 'https://www.its.edu.in',
      area: 'B.C.A.',
      endDate: '2022',
    });
    expect(resume.education[0].studyType).toBeUndefined();
    expect(resume.education[0]).not.toHaveProperty('courses');
  });

  it('groups skills by category with keywords in alphabetical order', () => {
    expect(resume.skills.map((skill) => skill.name)).toEqual(
      categories.map((category) => category.name),
    );

    for (const group of resume.skills) {
      const expected = skills
        .filter((skill) => skill.category.includes(group.name))
        .map((skill) => skill.title)
        .sort((a, b) => a.localeCompare(b, 'en'));

      expect(group.keywords).toEqual(expected);
    }
  });

  it('keeps the canonical file-like without inventing a modification date', () => {
    expect(RESUME_JSON_PATH).toBe('/resume.json');
    expect(RESUME_JSON_URL).toBe(`${SITE_URL}/resume.json`);
    expect(resume.meta.canonical).toBe(RESUME_JSON_URL);
    expect(resume.meta.canonical).not.toMatch(/resume\.json\/$/);
    // Work dates describe employment, not edits to profile, education, skills,
    // prose, or this generator. JSON Resume makes lastModified optional.
    expect(resume.meta).not.toHaveProperty('lastModified');
    expect(serializeJsonResume()).not.toContain('lastModified');
  });

  it('serializes to stable, pretty-printed bytes', () => {
    const serialized = serializeJsonResume();

    expect(serialized).toBe(serializeJsonResume());
    expect(serialized.endsWith('\n')).toBe(true);
    expect(serialized).toContain('\n  "basics": {');
    expect(JSON.parse(serialized)).toEqual(resume);
  });
});
