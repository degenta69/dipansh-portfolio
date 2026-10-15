import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { caseStudies } from '@/data/case-studies';
import HomePage from '../page';

describe('homepage information architecture', () => {
  it('renders the hero sentence without a client script', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Full-stack engineer building payment systems, real-time commerce workflows, and the applications around them.',
    );
  });

  it('links each case study and the systems map', () => {
    render(<HomePage />);

    for (const study of caseStudies) {
      const links = screen.getAllByRole('link', {
        name: new RegExp(study.title),
      });
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveAttribute(
        'href',
        expect.stringContaining(`/work/${study.slug}`),
      );
    }

    expect(document.querySelector('.systems-map-svg')).not.toBeNull();
    expect(
      document.querySelectorAll('.systems-map-list a').length,
    ).toBeGreaterThan(0);
  });
});
