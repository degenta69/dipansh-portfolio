import { MetadataRoute } from 'next';

import { caseStudies } from '@/data/case-studies';
import { SITE_URL } from '@/lib/utils';
import { isPortfolioPublic } from '@/lib/visibility';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isPortfolioPublic()) return [];

  const studies: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${SITE_URL}/work/${study.slug}/`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/work/`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...studies,
    {
      url: `${SITE_URL}/about/`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/resume/`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects/`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact/`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
