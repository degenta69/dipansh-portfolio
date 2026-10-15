import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Hero from '../../Template/Hero';

describe('Hero', () => {
  it('renders the agreed headline', () => {
    render(<Hero />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Full-stack engineer building payment systems, real-time commerce workflows, and the applications around them.',
    );
  });

  it('links the case studies and the résumé', () => {
    render(<Hero />);

    expect(
      screen.getByRole('link', { name: 'Read the case studies' }),
    ).toHaveAttribute('href', '/work');
    expect(screen.getByRole('link', { name: 'Résumé' })).toHaveAttribute(
      'href',
      '/resume',
    );
  });

  it('marks the portrait as a placeholder', () => {
    render(<Hero />);

    expect(screen.getByText(/Portrait pending/)).toBeInTheDocument();
    expect(document.querySelector('img')).toBeNull();
  });
});
