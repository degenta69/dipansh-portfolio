import { describe, expect, it } from 'vitest';
import { caseStudies } from '@/data/case-studies';
import profile from '@/data/profile.json';
import { sharedOpenGraph } from '@/lib/metadata';
import { RESUME_JSON_URL } from '@/lib/resumeJson';
import { AUTHOR_NAME, SHARE_IMAGE_PATH, SITE_URL } from '@/lib/utils';
import { metadata as aboutMetadata } from '../about/page';
import { metadata as contactMetadata } from '../contact/page';
import { metadata as notFoundMetadata } from '../not-found';
import { metadata as projectsMetadata } from '../projects/page';
import { metadata as resumeMetadata } from '../resume/page';
import { generateMetadata as generateCaseStudyMetadata } from '../work/[slug]/page';
import { metadata as workMetadata } from '../work/page';

const pages = [
  ['about', aboutMetadata, `${SITE_URL}/about/`],
  ['contact', contactMetadata, `${SITE_URL}/contact/`],
  ['archive', projectsMetadata, `${SITE_URL}/projects/`],
  ['resume', resumeMetadata, `${SITE_URL}/resume/`],
  ['work', workMetadata, `${SITE_URL}/work/`],
] as const;

describe('page metadata', () => {
  it('builds the contact description from the shared profile email', () => {
    expect(contactMetadata.description).toContain(profile.email);
  });

  it.each(pages)(
    'sets page-specific open graph metadata for %s',
    (_, metadata, url) => {
      expect(metadata.openGraph?.url).toBe(url);
      expect(metadata.openGraph?.description).toBe(metadata.description);
      expect(metadata.openGraph?.title).toBe(
        `${metadata.title} | ${AUTHOR_NAME}`,
      );
    },
  );

  it.each(pages)(
    'sets page-specific twitter metadata for %s',
    (_, metadata) => {
      expect(metadata.twitter?.description).toBe(metadata.description);
      expect(metadata.twitter?.title).toBe(
        `${metadata.title} | ${AUTHOR_NAME}`,
      );
      expect(metadata.twitter).not.toHaveProperty('site');
      expect(metadata.twitter).not.toHaveProperty('creator');
    },
  );

  it.each([...pages, ['404', notFoundMetadata, ''] as const])(
    'declares the share card on %s',
    (_, metadata) => {
      expect(JSON.stringify(metadata.openGraph?.images)).toContain(
        SHARE_IMAGE_PATH,
      );
      expect(JSON.stringify(metadata.twitter?.images)).toContain(
        SHARE_IMAGE_PATH,
      );
    },
  );

  it.each(pages)('declares a canonical url for %s', (_, metadata, url) => {
    expect(metadata.alternates?.canonical).toBe(url);
  });

  it('omits the canonical on 404, which has no stable url', () => {
    expect(notFoundMetadata.alternates?.canonical).toBeUndefined();
    expect(notFoundMetadata.openGraph?.url).toBeUndefined();
  });

  it('advertises the JSON Resume alongside the resume canonical', () => {
    expect(resumeMetadata.alternates?.types).toEqual({
      'application/json': RESUME_JSON_URL,
    });
    expect(resumeMetadata.alternates?.canonical).toBe(`${SITE_URL}/resume/`);
  });

  it('keeps the shared open graph fields on a case study', async () => {
    const metadata = await generateCaseStudyMetadata({
      params: Promise.resolve({ slug: caseStudies[0].slug }),
    });

    expect(metadata.alternates?.canonical).toBe(
      `${SITE_URL}/work/${caseStudies[0].slug}/`,
    );
    expect(metadata.openGraph?.siteName).toBe(sharedOpenGraph?.siteName);
    expect(metadata.openGraph).toMatchObject({ locale: 'en_US' });
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
    expect(JSON.stringify(metadata.openGraph?.images)).toContain(
      SHARE_IMAGE_PATH,
    );
  });
});
