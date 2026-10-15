import { render, screen, waitFor, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import { createHeadingId } from '@/lib/anchors';
import AboutContent from '../Sections';

function getActualSectionTitles(markdown: string) {
  return Array.from(markdown.matchAll(/^# (.+)$/gm))
    .map((match) => match[1])
    .filter((title) => title !== 'Intro');
}

describe('AboutContent', () => {
  it('renders intro copy without an Intro heading', () => {
    render(
      <AboutContent
        markdown={`# Intro

Hello from the intro.

# Some History

- Built a thing.`}
      />,
    );

    expect(screen.getByText('Hello from the intro.')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Intro' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Some History' }),
    ).toBeInTheDocument();
  });

  it('assigns section variants for compact and links sections', () => {
    const { container } = render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# I Like

- Running

# Websites from People I Admire

- [Example](https://example.com)`}
      />,
    );

    const sections = container.querySelectorAll('.about-section');

    expect(sections).toHaveLength(2);
    expect(sections[0]).toHaveClass('about-section--compact');
    expect(sections[1]).toHaveClass('about-section--links');
  });

  it('adds stable heading ids for deep links', () => {
    render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# Some History

- Built a thing.

# Travel / Geography

- Went somewhere.`}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Some History' }),
    ).toHaveAttribute('id', 'some-history');
    expect(
      screen.getByRole('heading', { name: 'Travel / Geography' }),
    ).toHaveAttribute('id', 'travel-geography');
  });

  it('renders section navigation and self-links for the real about markdown', () => {
    const sectionTitles = getActualSectionTitles(aboutMarkdown);
    const { container } = render(<AboutContent markdown={aboutMarkdown} />);
    const nav = screen.getByRole('navigation', { name: 'About sections' });

    expect(within(nav).getAllByRole('link')).toHaveLength(sectionTitles.length);

    for (const title of sectionTitles) {
      const headingId = createHeadingId(title);
      const heading = screen.getByRole('heading', { name: title });

      expect(heading).toHaveAttribute('id', headingId);
      expect(within(nav).getByRole('link', { name: title })).toHaveAttribute(
        'href',
        `#${headingId}`,
      );
      expect(
        container.querySelector(`h2#${headingId} > a[href="#${headingId}"]`),
      ).toBeTruthy();
    }
  });

  it('renders matching hash links and heading ids into static markup', () => {
    const html = renderToStaticMarkup(
      <AboutContent markdown={aboutMarkdown} />,
    );

    expect(html).toContain('href="#how-i-work"');
    expect(html).toContain('id="how-i-work"');
    expect(html).toContain('href="#portrait"');
    expect(html).toContain('id="portrait"');
  });

  it('renders only the history markers stated by the prose', () => {
    const markdown = `# Intro

Hello.

# Some History

- In 1993, a computer in my bedroom in 1993.
- In 1995, another year.
- In the summer of 1996, I played a game.
- At 7, I discovered the mini-games hidden in Microsoft Office.
`;
    const { container } = render(<AboutContent markdown={markdown} />);
    const history = container.querySelector('.about-section--log');
    const entries = Array.from(
      history?.querySelectorAll('.log-entry') ?? [],
    ) as HTMLElement[];

    expect(entries).toHaveLength(4);
    expect(
      entries.map((entry) => ({
        year: entry.querySelector('.log-entry-year')?.textContent ?? null,
        age: entry.querySelector('.log-entry-age')?.textContent ?? null,
      })),
    ).toEqual([
      { year: '1993', age: null },
      { year: '1995', age: null },
      { year: '1996', age: null },
      { year: null, age: 'Age 7' },
    ]);

    // Embedded markers remain in the prose, including meaningful qualifiers.
    expect(entries[0].querySelector('.log-entry-body')?.textContent).toContain(
      'A computer in my bedroom in 1993',
    );
    expect(entries[2].querySelector('.log-entry-body')?.textContent).toContain(
      'In the summer of 1996',
    );
    // A qualifier that stays in the sentence is hidden in the gutter. A
    // leading marker that was lifted out is the only copy of that fact.
    expect(entries[2].querySelector('.log-entry-marker')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    for (const index of [0, 1]) {
      expect(
        entries[index].querySelector('.log-entry-marker'),
      ).not.toHaveAttribute('aria-hidden');
    }

    // A leading marker is lifted out instead, leaving a sentence behind.
    expect(entries[3].querySelector('.log-entry-body')?.textContent).toMatch(
      /^I discovered the mini-games/,
    );
    expect(entries[3].querySelector('.log-entry-marker')).not.toHaveAttribute(
      'aria-hidden',
    );
  });

  it('leaves an undated entry an empty gutter rather than a broken marker', () => {
    const markdown = `# Travel / Geography

- A place with no date.
- Another undated stop.
- A third undated stop.
- In 2016, a dated stop.
`;
    const { container } = render(<AboutContent markdown={markdown} />);
    const markers = Array.from(
      container.querySelectorAll('.about-section--log .log-entry-marker'),
    );
    const empty = markers.filter((marker) => marker.textContent === '');

    expect(markers).toHaveLength(4);
    expect(empty).toHaveLength(3);

    for (const marker of empty) {
      expect(marker.querySelector('.log-entry-year')).toBeNull();
    }
  });

  it('supports same-page hash navigation from section links', async () => {
    window.history.replaceState({}, '', '/about/');

    render(<AboutContent markdown={aboutMarkdown} />);

    const nav = screen.getByRole('navigation', { name: 'About sections' });
    const navLink = within(nav).getByRole('link', {
      name: 'How I work',
    });

    navLink.click();

    await waitFor(() => {
      expect(window.location.hash).toBe('#how-i-work');
    });
    expect(document.querySelector(window.location.hash)).toHaveTextContent(
      'How I work',
    );

    const heading = screen.getByRole('heading', { name: 'Portrait' });
    const permalink = within(heading).getByRole('link', {
      name: 'Portrait',
    });

    permalink.click();

    await waitFor(() => {
      expect(window.location.hash).toBe('#portrait');
    });
    expect(document.querySelector(window.location.hash)).toHaveTextContent(
      'Portrait',
    );
  });
});
