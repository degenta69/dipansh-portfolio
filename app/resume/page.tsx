import type { Metadata } from 'next';

import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import References from '@/components/Resume/References';
import ResumeNav from '@/components/Resume/ResumeNav';
import Skills from '@/components/Resume/Skills';
import PageWrapper from '@/components/Template/PageWrapper';
import contact, { type ContactId } from '@/data/contact';
import profile from '@/data/profile.json';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';
import { createPageMetadata } from '@/lib/metadata';
import { RESUME_JSON_PATH, RESUME_JSON_URL } from '@/lib/resumeJson';
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/utils';

const resumeMetadata = createPageMetadata({
  title: 'Resume',
  description: `${AUTHOR_NAME}'s résumé. ${SITE_DESCRIPTION} Draft pending confirmation.`,
  path: '/resume/',
});

export const metadata: Metadata = {
  ...resumeMetadata,
  alternates: {
    ...resumeMetadata.alternates,
    types: {
      'application/json': RESUME_JSON_URL,
    },
  },
};

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(?:www\.)?/, '').replace(/\/$/, '');
}

function contactLink(id: ContactId): string {
  const item = contact.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(`No "${id}" entry in src/data/contact.ts`);
  }
  return item.link;
}

export default function ResumePage() {
  const now = Date.now();
  const github = contactLink('github');
  const linkedin = contactLink('linkedin');

  return (
    <PageWrapper>
      <section className="resume-page">
        <header className="resume-header">
          <p className="draft-banner">Draft · pending confirmation</p>
          <div className="resume-header-row">
            <h1 className="resume-title">Résumé</h1>
            <a
              href={`..${RESUME_JSON_PATH}`}
              className="resume-json-link"
              title="JSON Resume"
              aria-label="JSON Resume"
            >
              JSON
            </a>
          </div>
          <p className="resume-summary">
            {SITE_DESCRIPTION} This page is a draft. It lists roles and dates,
            and it does not name employers or figures that are not confirmed.
          </p>
          <address className="resume-print-contact">
            <a href={`${SITE_URL}/`}>{displayUrl(SITE_URL)}</a>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={github}>{displayUrl(github)}</a>
            <a href={linkedin}>{displayUrl(linkedin)}</a>
          </address>
        </header>

        <ResumeNav />

        <div className="resume-content">
          <section id="experience" className="resume-section">
            <Experience data={work} now={now} />
          </section>

          <section id="skills" className="resume-section">
            <Skills skills={skills} categories={categories} />
          </section>

          <section id="education" className="resume-section">
            <Education data={degrees} />
          </section>

          <section id="references" className="resume-section">
            <References />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}
