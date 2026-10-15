import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ContactPage from '../contact/page';

describe('contact page', () => {
  it('keeps the site footer on the contact page', () => {
    render(<ContactPage />);

    expect(screen.getByRole('main')).toHaveClass('page-main--contact');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: /^Email/ }).length,
    ).toBeGreaterThan(0);
  });
});
