import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SkillTag from '../../Resume/Skills/SkillTag';

describe('SkillTag', () => {
  it('renders the skill title without a competency tier', () => {
    const skill = { title: 'TypeScript', category: ['Languages'] };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(tag.className).toBe('skill-tag');
    expect(tag.querySelector('.sr-only')).toBeNull();
    expect(tag.textContent).toBe('TypeScript');
  });
});
