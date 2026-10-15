import Link from 'next/link';

import { caseStudies } from '@/data/case-studies';

export default function CaseStudyCards() {
  return (
    <section className="case-cards" aria-labelledby="case-studies-title">
      <div className="case-cards-header">
        <h2 id="case-studies-title">Case studies</h2>
        <p className="case-cards-meta">
          {caseStudies.length} planned · order per the case-study decision
        </p>
      </div>
      <ol className="case-cards-grid">
        {caseStudies.map((study) => (
          <li key={study.slug}>
            <Link href={`/work/${study.slug}/`} className="case-card">
              <span className="case-card-number">{study.number}</span>
              <h3>{study.title}</h3>
              <p>{study.summary}</p>
              <span className="status-pill">{study.status}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
