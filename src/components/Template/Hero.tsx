import Link from 'next/link';

import PortraitSlot from '@/components/Home/PortraitSlot';
import contact from '@/data/contact';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-primary">
          <p className="hero-kicker">
            Full-stack engineer · TypeScript · Node.js · React
          </p>
          <h1 className="hero-title">
            Full-stack engineer building{' '}
            <span className="hero-accent">payment systems</span>,{' '}
            <span className="hero-accent">real-time commerce workflows</span>,
            and the applications around them.
          </h1>
          <p className="hero-summary">
            I work across Node.js services, React apps, and AWS serverless. The
            case studies below explain how each system is shaped, what I
            personally built, and where AI tools helped. They are drafts.
          </p>
          <div className="hero-cta">
            <Link href="/work/" className="button">
              Read the case studies
            </Link>
            <Link href="/resume/" className="button button--quiet">
              Résumé
            </Link>
          </div>
          <p className="hero-contact">
            {contact.map((item) => (
              <a key={item.id} href={item.link}>
                {item.label}
              </a>
            ))}
          </p>
        </div>
        <PortraitSlot />
      </div>
    </section>
  );
}
