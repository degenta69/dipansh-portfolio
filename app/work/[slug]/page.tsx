import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ArchitectureDiagram from '@/components/CaseStudy/ArchitectureDiagram';
import ContributionTable from '@/components/CaseStudy/ContributionTable';
import TraceWaterfall from '@/components/CaseStudy/TraceWaterfall';
import PageWrapper from '@/components/Template/PageWrapper';
import {
  caseStudies,
  caseStudyParams,
  getCaseStudy,
} from '@/data/case-studies';
import {
  createPageMetadata,
  sharedOpenGraph,
  sharedTwitter,
} from '@/lib/metadata';
import { AUTHOR_NAME, SITE_URL } from '@/lib/utils';

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudyParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  const page = createPageMetadata({
    title: study.title,
    description: `${study.summary} ${study.status}.`,
    path: `/work/${study.slug}/`,
  });

  return {
    ...page,
    openGraph: {
      ...sharedOpenGraph,
      ...page.openGraph,
    },
    twitter: {
      ...sharedTwitter,
      ...page.twitter,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((item) => item.slug === study.slug);
  const previous = index > 0 ? caseStudies[index - 1] : undefined;
  const next =
    index >= 0 && index < caseStudies.length - 1
      ? caseStudies[index + 1]
      : undefined;

  return (
    <PageWrapper mainClassName="page-main--read">
      <article className="case-study">
        <header className="case-study-header">
          <p className="draft-banner">{study.status}</p>
          <p className="case-study-kicker">
            {study.number} · {study.period}
          </p>
          <h1>{study.title}</h1>
          <p className="case-study-summary">{study.summary}</p>
        </header>

        <ContributionTable rows={study.contributions} />

        <section>
          <h2>Problem</h2>
          {study.problem.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        {study.sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <ArchitectureDiagram
          nodes={study.diagram.nodes}
          caption={study.diagram.caption}
        />

        <TraceWaterfall
          steps={study.trace.steps}
          caption={study.trace.caption}
        />

        <section>
          <h2>Decisions</h2>
          <dl className="decision-list">
            {study.decisions.map((item) => (
              <div key={item.decision}>
                <dt>{item.decision}</dt>
                <dd>
                  {item.why} {item.tradeoff}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2>Testing</h2>
          <ul>
            {study.testing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Limits</h2>
          <ul>
            {study.limits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <aside className="ai-note">
          <h2>AI assistance</h2>
          <p>{study.aiNote}</p>
        </aside>

        <nav className="case-study-pager" aria-label="Other case studies">
          {previous ? (
            <Link href={`/work/${previous.slug}/`}>
              Previous: {previous.title}
            </Link>
          ) : (
            <span />
          )}
          <Link href="/work/">All case studies</Link>
          {next ? (
            <Link href={`/work/${next.slug}/`}>Next: {next.title}</Link>
          ) : (
            <span />
          )}
        </nav>
        <p className="case-study-canonical">
          <a href={`${SITE_URL}/work/${study.slug}/`}>{AUTHOR_NAME}</a>
        </p>
      </article>
    </PageWrapper>
  );
}
