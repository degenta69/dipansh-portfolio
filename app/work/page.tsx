import type { Metadata } from 'next';
import Link from 'next/link';
import PageWrapper from '@/components/Template/PageWrapper';
import { caseStudies } from '@/data/case-studies';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Work',
  description:
    'Draft case studies: a payment platform, a pre-launch food-ordering MVP, a serverless API, and DiskGod.',
  path: '/work/',
});

export default function WorkIndexPage() {
  return (
    <PageWrapper>
      <header className="work-index-header">
        <p className="draft-banner">Draft · pending confirmation</p>
        <h1 className="page-title">Case studies</h1>
        <p className="page-subtitle">
          Four separate stories. Nothing here is a production or scale claim,
          and nothing links to a project repository.
        </p>
      </header>
      <ol className="case-cards-grid">
        {caseStudies.map((study) => (
          <li key={study.slug}>
            <Link href={`/work/${study.slug}/`} className="case-card">
              <span className="case-card-number">{study.number}</span>
              <h2>{study.title}</h2>
              <p>{study.summary}</p>
              <span className="status-pill">{study.status}</span>
            </Link>
          </li>
        ))}
      </ol>
    </PageWrapper>
  );
}
