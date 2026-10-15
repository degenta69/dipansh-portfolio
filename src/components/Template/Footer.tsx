import Link from 'next/link';

import ContactIcons from '@/components/Contact/ContactIcons';
import work from '@/data/resume/work';
import routes from '@/data/routes';
import { currentPosition } from '@/lib/career';
import { AUTHOR_NAME } from '@/lib/utils';

export default function Footer() {
  const current = currentPosition(work);

  return (
    <footer className="site-footer-new">
      <div className="footer-content">
        <div className="footer-identity">
          <div className="footer-info">
            <span className="footer-name">{AUTHOR_NAME}</span>
            {current ? (
              <p className="footer-role">
                {current.url
                  ? `${current.position} at ${current.name}`
                  : current.position}
              </p>
            ) : null}
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} {AUTHOR_NAME}. Built on{' '}
              <a
                href="https://github.com/mldangelo/personal-site"
                target="_blank"
                rel="noopener noreferrer"
              >
                mldangelo/personal-site
                <span className="sr-only"> (opens in a new tab)</span>
              </a>{' '}
              (MIT).
            </p>
            <p className="footer-licenses">
              Fonts:{' '}
              <a href="/licenses/fonts/OFL-IBM-Plex.txt">IBM Plex Sans</a>,{' '}
              <a href="/licenses/fonts/OFL-Source-Serif-4.txt">
                Source Serif 4
              </a>
              ,{' '}
              <a href="/licenses/fonts/OFL-JetBrains-Mono.txt">
                JetBrains Mono
              </a>{' '}
              (OFL).
            </p>
            <p className="footer-ai">
              Case studies are drafts. AI assistance is disclosed on each one.
            </p>
          </div>
        </div>

        <div className="footer-right">
          <nav className="footer-links" aria-labelledby="footer-links-heading">
            <span id="footer-links-heading" className="footer-links-label">
              Explore
            </span>
            <div className="footer-links-grid">
              {routes
                .filter((route) => !route.index)
                .map((route) => (
                  <Link key={route.path} href={route.path}>
                    {route.label}
                  </Link>
                ))}
            </div>
          </nav>

          <div
            className="footer-social"
            aria-labelledby="footer-social-heading"
          >
            <span id="footer-social-heading" className="footer-social-label">
              Connect
            </span>
            <ContactIcons />
          </div>
        </div>
      </div>
    </footer>
  );
}
